# Component defaults

**Status** — Approved

**Scope** — Visible defaults and reactive access to inputs.

## Standard

On the supported Vue compiler, destructure directly from `defineProps<Props>()` after the local interface. Keep names in declaration order. Default the common case and leave genuinely required choices to the caller.

```ts
interface Props {
  query: string
  suggestions?: string[]
}
const { query, suggestions = [] } = defineProps<Props>()
```

Array and object literals here give each instance its own default. With ordinary Boolean props, omission normally casts to false. Account for casting and explicit defaults when absence has a distinct meaning.

## Passing a reactive input

Within the same script setup block the compiler tracks reads of the destructured binding. It is a value when passed as an argument. For a string prop, use `watch(() => query, onChange)`, not `watch(query, onChange)`. A composable accepting a getter can similarly receive `() => query`. Use `toRef(() => query)` when an API expects a readonly ref.

Keep the whole props object when forwarding it, when namespacing improves clarity, or when an older target requires it. In that case `const props = withDefaults(defineProps<Props>(), { suggestions: () => [] })` supplies a fresh mutable default. Keep the interface and defaults adjacent in either form.

See [composable inputs](composables.md) and [Vue reactive props destructure](https://vuejs.org/api/sfc-script-setup.html#reactive-props-destructure).
