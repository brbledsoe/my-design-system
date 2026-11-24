import { mkdir, readFile, writeFile } from 'node:fs/promises'

const read = async (name) => JSON.parse(await readFile(new URL(`./src/${name}.json`, import.meta.url), 'utf8'))

function resolve(tree, path, chain = []) {
  if (chain.includes(path)) throw new Error(`Circular token alias: ${[...chain, path].join(' -> ')}`)
  const token = path.split('.').reduce((node, key) => node?.[key], tree)
  if (!token || !Object.hasOwn(token, '$value')) throw new Error(`Missing token: ${path}`)
  const { $type: type, $value: value } = token
  const reference = typeof value === 'string' && /^\{([\w.]+)\}$/.exec(value)
  if (reference) {
    const resolved = resolve(tree, reference[1], [...chain, path])
    if (resolved.type !== type) throw new Error(`Token type mismatch: ${path}`)
    return resolved
  }
  return { type, value }
}

function convert({ type, value }, path) {
  if (type === 'dimension' && value?.unit === 'px' && Number.isFinite(value.value)) {
    return { css: `${value.value}px`, native: value.value }
  }
  if (type === 'color' && value?.colorSpace === 'srgb' && value.alpha === undefined &&
    Array.isArray(value.components) && value.components.length === 3 &&
    value.components.every((channel) => Number.isFinite(channel) && channel >= 0 && channel <= 1)) {
    const hex = '#' + value.components.map((channel) => Math.round(channel * 255).toString(16).padStart(2, '0')).join('')
    return { css: hex, native: hex }
  }
  throw new Error(`Unsupported token value: ${path}`)
}

function buildTheme(tree) {
  const native = {}
  const declarations = []
  for (const [group, tokens] of Object.entries(tree.semantic)) {
    native[group] = {}
    for (const name of Object.keys(tokens)) {
      const path = `semantic.${group}.${name}`
      const values = convert(resolve(tree, path), path)
      const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
      native[group][name] = values.native
      declarations.push(`  --mds-${group}-${cssName}: ${values.css};`)
    }
  }
  return { native, declarations: declarations.join('\n') }
}

const common = await read('common')
const light = buildTheme({ ...common, ...await read('light') })
const dark = buildTheme({ ...common, ...await read('dark') })
const output = new URL('./dist/', import.meta.url)
await mkdir(output, { recursive: true })
const native = { light: light.native, dark: dark.native }
const groups = Object.entries(light.native).map(([group, tokens]) => {
  const fields = Object.entries(tokens).map(([key, value]) => `readonly ${key}: ${typeof value}`).join('; ')
  return `  readonly ${group}: { ${fields} }`
}).join('\n')
await Promise.all([
  writeFile(new URL('web.css', output), `:root, [data-mds-theme="light"] {\n${light.declarations}\n}\n[data-mds-theme="dark"] {\n${dark.declarations}\n}\n`),
  writeFile(new URL('native.js', output), `export const themes = ${JSON.stringify(native, null, 2)};\n`),
  writeFile(new URL('native.d.ts', output), `export type ThemeName = 'light' | 'dark'\nexport interface ThemeTokens {\n${groups}\n}\nexport declare const themes: Readonly<Record<ThemeName, ThemeTokens>>\n`),
])
