# Generic components

**Status** — Approved

**Scope** — Type relationships that improve data-driven component use.

## Standard

Use a generic SFC when a type parameter connects consumer inputs, events or slots in a way that prevents real errors. This illustrative FieldList relates a field name and a selected row to the caller's items.

```vue
<script setup lang="ts" generic="T extends object">
interface Props {
  items: readonly T[]
  field: Extract<keyof T, string>
}
const { items, field } = defineProps<Props>()
const emit = defineEmits<{ select: [item: T] }>()
</script>

<template>
  <ul>
    <li v-for="(item, index) in items" :key="index">
      <button type="button" @click="emit('select', item)">{{ item[field] }}</button>
    </li>
  </ul>
</template>
```

For rows of type `{ temperature: number }`, `field="temperature"` should type-check and `field="pressure"` should fail. Verify both calls with the installed `vue-tsc`. Use a stable domain key when rows have identity and can move. This example only renders a list and reports the selected row.

Top-level keys do not establish types for dotted paths, nested child components, provide/inject, dynamic registries or transformed data. Validate those boundaries individually before promising inference. Prefer a concrete type when generics would force callers to supply annotations for ordinary usage.

See [component types](component-types.md) and [Vue generic SFCs](https://vuejs.org/api/sfc-script-setup.html#generics).
