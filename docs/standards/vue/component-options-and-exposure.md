# Component options and exposure

**Status** — Approved

**Scope** — Attribute routing and imperative instance APIs.

## Standard

Use `defineOptions` after imports when an SFC needs options. Default attribute inheritance suits a single root that is also the intended target. For a wrapped input, explicit routing can be clearer:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'

defineOptions({ inheritAttrs: false })
const input = useTemplateRef<HTMLInputElement>('input')
function focus() {
  input.value?.focus()
}
defineExpose({ focus })
</script>

<template>
  <div class="field"><input ref="input" v-bind="$attrs" /></div>
</template>
```

Choose the destination of classes, ARIA attributes and undeclared listeners deliberately. Disabling inheritance without forwarding them can discard an accessible description or a listener.

Script setup keeps private bindings closed to parents by default. Expose a narrow method such as `focus()` when a parent genuinely needs imperative access. A value change normally belongs in the model. Exposing the entire private state ties callers to the implementation.

See [public boundaries](../shared/public-api-boundaries.md), [template refs](template-refs-and-ids.md) and [Vue script setup](https://vuejs.org/api/sfc-script-setup.html#defineexpose).
