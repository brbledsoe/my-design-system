# Naming conventions

**Status** — Approved

**Scope** — Names that identify a file's owner and purpose in isolation.

## Standard

Choose filenames that a reader can recognize in an editor tab, diff or error message. Prefer the component name plus the responsibility for component-owned files. Match established package terminology and test tooling.

| Responsibility | Illustrative name |
| --- | --- |
| Component | `Select.vue` in Vue, using PascalCase |
| Types and helpers | `Select.types.ts`, `Select.utils.ts` |
| Constants and style variants | `Select.constants.ts`, `Select.variants.ts` |
| Reactive behavior in Vue | `useSelect.ts`, or `useSelectKeyboard.ts` for one capability |
| Test or story, when used | `Select.test.ts`, `Select.stories.ts` |
| Public module entry | `index.ts` |

A search result for `Select.types.ts` identifies its owner immediately. Several tabs named `types.ts` require inspecting each path. A short conventional name works at an established module boundary, and a domain-specific name such as `fieldRegistry.ts` can already be clear inside a subsystem. Create supporting files as responsibilities emerge. See [code colocation](code-colocation.md).
