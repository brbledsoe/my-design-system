import { writeFile } from 'node:fs/promises'

// Resolve token CSS against the consumer's installed version.
await writeFile(new URL('./dist/styles.css', import.meta.url), [
  '@import "@my-design-system/tokens/web.css";',
  '@import "./controls.css";',
  '',
].join('\n'))
