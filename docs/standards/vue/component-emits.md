# Component emits

**Status** — Approved

**Scope** — Consumer-facing actions and their payloads.

## Standard

Declare events beside models, using named tuples. Name the action and its arguments so the consumer can understand an event without searching for its emit calls.

```ts
const emit = defineEmits<{
  select: [id: string]
  close: []
}>()
```

Emit `select` on a selection action when that distinction matters. A model update synchronizes a value. Firing `change`, `select` and `update:modelValue` for one interaction requires a distinct consumer use for each. Keep internal DOM activity inside the component.

Call-signature declarations remain valid on older toolchains. Choose a runtime emits declaration if development-time payload validation is needed. Use a single declaration form to keep types and validators from drifting.

See [models](component-models.md) and [Vue event typing](https://vuejs.org/guide/typescript/composition-api.html#typing-component-emits).
