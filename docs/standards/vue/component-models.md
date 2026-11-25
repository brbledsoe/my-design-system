# Component models

**Status** — Approved

**Scope** — State that parent and child can both update.

## Standard

Prefer `defineModel` when the parent needs to bind a value and the child edits it. Keep the declaration with the public contract. A required binding can use `const checked = defineModel<boolean>({ required: true })`. The parent initializes its ref and supplies it through `v-model`. The [Switch implementation](../../../packages/vue/src/Switch.vue) illustrates this contract.

Use a named model for an independently controlled value, for example `const open = defineModel<boolean>('open', { required: true })` paired with `v-model:open`. Keep transient state such as a hovered row private. Emit a semantic event when the consumer is responding to an action.

The macro declares the prop and corresponding update event. Repeating them in props, emits or a computed setter obscures the source of the contract. A typed prop and update event are a valid compatibility alternative for earlier Vue targets.

A child-side default can leave the child initialized while the bound parent ref is still undefined. Prefer initializing the parent. Handle undefined for optional bindings and use a factory for mutable model defaults when one is needed. See [component emits](component-emits.md) and [Vue component v-model](https://vuejs.org/guide/components/v-model.html).
