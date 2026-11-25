# Component folder structure

**Status** — Approved

**Scope** — Choosing a physical home for Vue component code.

## Standard

Choose the smallest structure that makes the component's responsibilities easy to find. Keep the existing package placement for primitives and controls. The examples below illustrate growth within that placement.

| Shape | When it earns its place | Illustrative layout |
| --- | --- | --- |
| Standalone SFC | One template, public contract and straightforward behavior | `Badge.vue` |
| Component module | Private children, reusable types or cohesive logic need separate files | `Select/{Select.vue, SelectOption.vue, Select.types.ts, useSelect.ts, index.ts}` |
| Subsystem | Independently changing capabilities have recognizable owners | Layout below |

```text
DataView/
  DataView.vue
  DataView.types.ts
  index.ts
  core/fieldRegistry.ts
  fields/NumberField.vue
  features/filtering/
  views/TableView.vue
  views/CardView.vue
  components/DataViewToolbar.vue
```

In this illustrative subsystem, numeric field semantics can serve both table and card views. Extract that boundary when both representations need it. A single Badge typically needs none of these folders.

Keep props, defaults, models, emits, slots and simple state in the SFC. Keep private children, pure helpers, reusable types, constants, style variants and focused composables beside their owner. Colocate tests where practical and put consuming examples in the established catalog. Introduce a module index when there is a public boundary to name. File counts and line counts make poor promotion criteria.

See [existing package layout and style ownership](../../architecture/vue.md), [colocation](../shared/code-colocation.md) and [filenames](../shared/naming-conventions.md).
