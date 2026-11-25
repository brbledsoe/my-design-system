import assert from 'node:assert/strict'
import { execFileSync, execSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { basename, isAbsolute, join, relative, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('../', import.meta.url))
const scope = '@my-design-system'
const prefix = `${scope}/`
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'))

function run(command, args, cwd, capture = false) {
  // On Windows pnpm and npm are cmd shims. All shell arguments here are fixed literals.
  const options = {
    cwd,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  }
  if (process.platform === 'win32' && ['pnpm', 'npm'].includes(command)) {
    assert.ok(args.every((arg) => /^[\w@./:-]+$/.test(arg)), 'Unexpected package manager argument')
    return execSync([command, ...args].join(' '), options)
  }
  return execFileSync(command, args, options)
}

function targets(exports) {
  return typeof exports === 'string' ? [exports] : Object.values(exports).flatMap(targets)
}

async function pack(name, workspaceRoot = root) {
  const output = join(workspaceRoot, 'artifacts')
  const workspace = join(workspaceRoot, 'packages', name)
  const manifest = await readJson(join(workspace, 'package.json'))
  await mkdir(output, { recursive: true })
  run('pnpm', ['pack', '--pack-destination', '../../artifacts'], workspace)

  const archive = join(output, `my-design-system-${name}-${manifest.version}.tgz`)
  const files = run('tar', ['-tf', basename(archive)], output, true).split(/\r?\n/)
  const packed = JSON.parse(run('tar', ['-xOf', basename(archive), 'package/package.json'], output, true))
  assert.equal(packed.name, `${prefix}${name}`)
  for (const target of targets(packed.exports)) {
    assert.ok(files.includes(`package/${target.slice(2)}`), `Missing export in ${packed.name}: ${target}`)
  }
  for (const [dependency, range] of Object.entries(packed.dependencies ?? {})) {
    assert.ok(!range.startsWith('workspace:'), `${dependency} kept its workspace range`)
  }
  const forbiddenHost = name === 'vue' ? 'react-native' : 'vue'
  assert.ok(!Object.hasOwn(packed.dependencies ?? {}, forbiddenHost))
  assert.ok(!Object.hasOwn(packed.peerDependencies ?? {}, forbiddenHost))
  return { archive, manifest: packed }
}

async function createConsumer(directory, pilot) {
  const source = join(root, 'apps', pilot)
  await mkdir(directory)
  const entries = await readdir(source)
  const excluded = new Set(['node_modules', 'dist', '.expo', 'package.json', 'package-lock.json'])
  for (const entry of entries.filter((name) => !excluded.has(name))) {
    await cp(join(source, entry), join(directory, entry), { recursive: true })
  }
  const manifest = await readJson(join(source, 'package.json'))
  for (const dependency of Object.keys(manifest.dependencies)) {
    if (dependency.startsWith(prefix)) delete manifest.dependencies[dependency]
  }
  await writeFile(join(directory, 'package.json'), JSON.stringify(manifest, null, 2))
}

async function installArchives(directory, hosts, packages) {
  const vendor = join(directory, 'vendor')
  await mkdir(vendor, { recursive: true })
  const archivePaths = []
  for (const { archive } of packages) {
    const filename = basename(archive)
    await cp(archive, join(vendor, filename))
    archivePaths.push(`./vendor/${filename}`)
  }
  run('npm', ['install', '--prefer-offline', '--no-audit', '--no-fund', ...archivePaths], directory)
  const lock = await readJson(join(directory, 'package-lock.json'))
  const installed = Object.entries(lock.packages).filter(([path]) => path.includes(`node_modules/${scope}/`))
  assert.equal(installed.length, packages.length)
  for (const { manifest: packed } of packages) {
    const entry = lock.packages[`node_modules/${packed.name}`]
    assert.equal(entry.version, packed.version)
    assert.match(entry.resolved, /^file:vendor\//)
    assert.ok(entry.integrity)
  }
  for (const host of hosts) {
    const copies = Object.keys(lock.packages).filter((path) => path.endsWith(`node_modules/${host}`))
    assert.deepEqual(copies, [`node_modules/${host}`], `Expected one copy of ${host}`)
  }
  run('npm', ['run', 'typecheck'], directory)
}

async function verifyWeb(directory, tokens, vue) {
  await installArchives(directory, ['vue'], [tokens, vue])
  run('npm', ['run', 'build'], directory)
  await verifyBrowser(directory, tokens.manifest.version)
}

async function verifyNative(directory, tokens, native) {
  await installArchives(directory, ['expo', 'react', 'react-native'], [tokens, native])
  run('npm', ['run', 'bundle'], directory)
}

async function verifyBrowser(directory, tokenVersion) {
  const server = createServer(async (request, response) => {
    const path = request.url === '/' ? '/index.html' : request.url
    const asset = /^\/(?:index\.html|box\.html|notification-preferences\.html|assets\/[\w.-]+\.(?:css|js))$/.exec(path)?.[0].slice(1)
    if (!asset) return response.writeHead(404).end()
    const mime = asset.endsWith('.css') ? 'text/css' : asset.endsWith('.js') ? 'text/javascript' : 'text/html'
    try {
      const content = await readFile(join(directory, 'dist', asset))
      response.writeHead(200, { 'content-type': mime }).end(content)
    } catch {
      response.writeHead(404).end()
    }
  })
  await new Promise((done, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', done)
  })
  let browser
  try {
    const address = server.address()
    browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined })
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`http://127.0.0.1:${address.port}/`)
    assert.ok(await page.getByRole('heading', { name: 'My Design System' }).isVisible())
    assert.equal(await page.locator('script, style, link[rel="stylesheet"]').count(), 0)

    await page.getByRole('link', { name: 'Box', exact: true }).click()
    const basicBox = page.getByText('Zero padding', { exact: true })
    const namedBox = page.getByRole('region', { name: 'Overview' })
    await namedBox.waitFor()
    assert.equal(await basicBox.evaluate((element) => element.tagName), 'DIV')
    assert.equal(await basicBox.evaluate((element) => getComputedStyle(element).padding), '0px')
    const boxStyle = await namedBox.evaluate((element) => {
      const style = getComputedStyle(element)
      return { tag: element.tagName, padding: style.padding, token: style.getPropertyValue('--mds-space-medium').trim() }
    })
    assert.equal(boxStyle.tag, 'SECTION')
    assert.ok(boxStyle.token)
    assert.equal(boxStyle.padding, boxStyle.token)
    assert.equal((await namedBox.textContent())?.trim(), 'Project overview')
    await page.getByRole('link', { name: 'Back to catalog' }).click()

    await page.getByRole('link', { name: 'Button', exact: true }).click()
    await page.locator('button#button').waitFor()
    assert.ok(page.url().endsWith('/notification-preferences.html#button'))
    await page.getByRole('link', { name: 'Back to catalog' }).click()

    const inputs = page.locator('summary').filter({ hasText: /^Inputs$/ })
    const switchLink = page.getByRole('link', { name: 'Switch', exact: true })
    assert.ok(!(await switchLink.isVisible()))
    await inputs.focus()
    await page.keyboard.press('Space')
    await switchLink.click()
    await page.locator('#switch').waitFor()
    assert.ok(page.url().endsWith('/notification-preferences.html#switch'))

    await page.getByRole('link', { name: 'Back to catalog' }).click()
    await page.getByRole('link', { name: 'Notification preferences' }).click()
    await page.getByRole('heading', { name: 'Notification preferences' }).waitFor()
    const digest = page.getByRole('switch', { name: 'Weekly digest' })
    const save = page.getByRole('button', { name: 'Save preferences' })
    const theme = page.getByRole('switch', { name: 'Dark appearance' })
    assert.ok(await save.isDisabled())
    await page.keyboard.press('Tab')
    assert.ok(await page.getByRole('link', { name: 'Back to catalog' }).evaluate((element) => element === document.activeElement))
    await page.keyboard.press('Tab')
    assert.ok(await digest.evaluate((element) => element.matches(':focus-visible')))
    await page.keyboard.press('Space')
    assert.ok(await digest.isChecked())
    assert.ok(await save.isEnabled())
    const tokenFile = pathToFileURL(join(directory, 'node_modules', scope, 'tokens', 'dist', 'native.js'))
    tokenFile.searchParams.set('version', tokenVersion)
    const { themes } = await import(tokenFile.href)
    const toRgb = (hex) => 'rgb(' + hex.slice(1).match(/../g).map((part) => Number.parseInt(part, 16)).join(', ') + ')'
    const style = () => save.evaluate((element) => {
      const computed = getComputedStyle(element)
      return { color: computed.backgroundColor, padding: computed.paddingInlineStart }
    })
    assert.deepEqual(await style(), { color: toRgb(themes.light.color.action), padding: `${themes.light.space.medium}px` })
    await page.keyboard.press('Tab')
    assert.ok(await save.evaluate((element) => element.matches(':focus-visible')))
    await page.keyboard.press('Enter')
    assert.equal(await page.getByRole('status').textContent(), 'Preferences saved.')
    assert.ok(await save.isDisabled())
    await theme.focus()
    await page.keyboard.press('Space')
    await digest.focus()
    await page.keyboard.press('Space')
    assert.ok(await save.isEnabled())
    assert.equal((await style()).color, toRgb(themes.dark.color.action))
    assert.deepEqual(errors, [])
    console.log('Vue catalog and packed demo: navigation, keyboard, save state, and light/dark styling passed')
  } finally {
    await browser?.close()
    await new Promise((done) => server.close(done))
  }
}

const patchOf = (version) => {
  assert.match(version, /^\d+\.\d+\.\d+$/)
  const [major, minor, patch] = version.split('.').map(Number)
  return `${major}.${minor}.${patch + 1}`
}

async function rehearse(workspace, webDirectory, nativeDirectory, tokens, vue, native) {
  await mkdir(join(workspace, '.changeset'), { recursive: true })
  await cp(join(root, '.changeset', 'config.json'), join(workspace, '.changeset', 'config.json'))
  const ignored = new Set(['node_modules', 'dist', '.expo'])
  for (const entry of ['.gitignore', 'package.json', 'pnpm-workspace.yaml', 'pnpm-lock.yaml', 'tsconfig.base.json', 'packages', 'apps']) {
    await cp(join(root, entry), join(workspace, entry), {
      recursive: true,
      filter: (source) => !ignored.has(basename(source)),
    })
  }
  run('git', ['init', '-b', 'main'], workspace)
  run('git', ['-c', 'core.autocrlf=false', 'add', '.'], workspace)
  run('git', ['-c', 'user.name=Release Rehearsal', '-c', 'user.email=rehearsal@example.invalid',
    'commit', '--quiet', '-m', 'Create disposable release fixture'], workspace)
  run('pnpm', ['install', '--frozen-lockfile'], workspace)
  const version = async (name) => (await readJson(join(workspace, 'packages', name, 'package.json'))).version
  async function bump(name, note) {
    await writeFile(join(workspace, '.changeset', 'rehearsal.md'), `---\n"${prefix}${name}": patch\n---\n\n${note}\n`)
    run('pnpm', ['exec', 'changeset', 'version'], workspace)
    run('pnpm', ['install', '--lockfile-only', '--no-frozen-lockfile'], workspace)
  }

  const buttonStyle = join(workspace, 'packages', 'vue', 'src', 'styles.css')
  const initialStyle = await readFile(buttonStyle, 'utf8')
  assert.ok(initialStyle.includes('outline-offset: 3px'))
  await writeFile(buttonStyle, initialStyle.replace('outline-offset: 3px', 'outline-offset: 4px'))
  await bump('vue', 'Adjust the offset of the Vue focus outline.')
  assert.equal(await version('vue'), patchOf(vue.manifest.version))
  assert.equal(await version('tokens'), tokens.manifest.version)
  assert.equal(await version('react-native'), native.manifest.version)
  run('pnpm', ['--filter', '@my-design-system/vue...', 'build'], workspace)
  const upgradedVue = await pack('vue', workspace)
  await verifyWeb(webDirectory, tokens, upgradedVue)

  const light = join(workspace, 'packages', 'tokens', 'src', 'light.json')
  const palette = await readJson(light)
  palette.palette.action.$value.components = [36 / 255, 88 / 255, 64 / 255]
  await writeFile(light, JSON.stringify(palette, null, 2))
  await bump('tokens', 'Refine the light theme primary action color.')
  assert.equal(await version('tokens'), patchOf(tokens.manifest.version))
  assert.equal(await version('vue'), upgradedVue.manifest.version)
  assert.equal(await version('react-native'), native.manifest.version)
  run('pnpm', ['--filter', '@my-design-system/tokens', 'build'], workspace)
  const upgradedTokens = await pack('tokens', workspace)
  await verifyWeb(webDirectory, upgradedTokens, upgradedVue)
  await verifyNative(nativeDirectory, upgradedTokens, native)
  const { themes } = await import(pathToFileURL(join(nativeDirectory, 'node_modules', scope, 'tokens', 'dist', 'native.js')).href)
  assert.equal(themes.light.color.action, '#245840')
  console.log('Release rehearsal passed: Vue-only patch, then one shared token patch with both installed UI packages')
}

const consumerRoot = await mkdtemp(join(tmpdir(), 'mds-consumer-'))
try {
  const pathFromRoot = relative(root, consumerRoot)
  assert.ok(isAbsolute(pathFromRoot) || pathFromRoot.startsWith(`..${sep}`), 'Consumer must be outside the workspace')
  const tokens = await pack('tokens')
  const vue = await pack('vue')
  const native = await pack('react-native')
  const webDirectory = join(consumerRoot, 'vue-pilot')
  const nativeDirectory = join(consumerRoot, 'native-pilot')
  await createConsumer(webDirectory, 'vue-pilot')
  await createConsumer(nativeDirectory, 'native-pilot')
  await verifyWeb(webDirectory, tokens, vue)
  await verifyNative(nativeDirectory, tokens, native)
  if (process.argv.includes('--rehearse')) {
    await rehearse(join(consumerRoot, 'release-rehearsal'), webDirectory, nativeDirectory, tokens, vue, native)
  }
  console.log(`Verified ${[tokens, vue, native].map(({ archive }) => basename(archive)).join(', ')}`)
} finally {
  await rm(consumerRoot, { recursive: true, force: true, maxRetries: 3 })
}
