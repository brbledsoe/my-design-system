import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { themes } from '../dist/native.js'

test('CSS and native output agree on semantic colors and use platform dimensions', async () => {
  const css = await readFile(new URL('../dist/web.css', import.meta.url), 'utf8')
  assert.equal(themes.light.color.action, '#24523c')
  assert.equal(themes.dark.color.action, '#b6e2bf')
  assert.equal(themes.light.space.medium, 16)
  for (const [name, theme] of Object.entries(themes)) {
    const block = css.split(`[data-mds-theme="${name}"] {`)[1].split('}')[0]
    assert.ok(block.includes(`--mds-color-action: ${theme.color.action};`))
    assert.ok(block.includes(`--mds-space-medium: ${theme.space.medium}px;`))
    assert.deepEqual(Object.keys(theme.color), Object.keys(themes.light.color))
  }
})
