# Template refs and IDs

**Status** — Approved

**Scope** — DOM and component access, and accessible ID relationships.

## Standard

Use `useTemplateRef` for imperative access to a rendered element or child component. Match the string to the template's static ref name. Current Vue language tools can infer many static targets. Supply an explicit type when inference needs help.

```ts
const input = useTemplateRef<HTMLInputElement>('input')
function focus() {
  input.value?.focus()
}
```

The template supplies `ref="input"`. The value can be null before mount or after a conditional removal. For a child component, depend only on the instance API it exposes. An older compiler/runtime target can use a nullable ref and a matching template name.

Use `const id = useId()` to connect `<label :for="id">` with `<input :id>`. Derive suffixes such as `id + '-error'` for additional relationships and reference a description only while it exists. The generated ID is unique within the app and stable across SSR and hydration. Use domain identifiers for data keys. Per-render random IDs can break server/client associations.

See the [Switch label and description](../../../packages/vue/src/Switch.vue), [instance exposure](component-options-and-exposure.md) and [Vue 3.5 release notes](https://blog.vuejs.org/posts/vue-3-5).
