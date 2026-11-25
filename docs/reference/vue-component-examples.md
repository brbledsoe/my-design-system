# Vue component examples

These illustrative source files demonstrate the [Vue standards](../standards/vue/README.md). The package's [actual exports](../../packages/vue/src/index.ts) list the components available to install.

## Badge.vue

A label and a private variant vocabulary fit in one file.

```vue
<script setup lang="ts">
interface Props {
  label: string
  variant?: 'neutral' | 'success' | 'warning'
}
const { label, variant = 'neutral' } = defineProps<Props>()
</script>

<template>
  <span :class="variant">{{ label }}</span>
</template>
```

## SearchInput

Here the consumer can name a size in its own configuration, so the example module exports that type. An input whose size is purely local could keep the union inline.

### SearchInput.types.ts

```ts
export type InputSize = 'small' | 'medium' | 'large'
```

### SearchInput.vue

```vue
<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
import type { InputSize } from './SearchInput.types'

defineOptions({ inheritAttrs: false })

interface Props {
  id?: string
  label?: string
  placeholder?: string
  size?: InputSize
  disabled?: boolean
  clearable?: boolean
}
const {
  id,
  label = 'Search',
  placeholder = 'Search…',
  size = 'medium',
  disabled = false,
  clearable = true,
} = defineProps<Props>()

const value = defineModel<string>({ required: true })
const emit = defineEmits<{
  clear: []
  search: [query: string]
}>()
defineSlots<{
  prefix?(): any
  suffix?(): any
}>()

const generatedId = useId()
const input = useTemplateRef<HTMLInputElement>('input')

function clear() {
  value.value = ''
  emit('clear')
  input.value?.focus()
}
</script>

<template>
  <div :class="size">
    <label :for="id ?? generatedId">{{ label }}</label>
    <slot name="prefix" />
    <input
      ref="input"
      v-bind="$attrs"
      :id="id ?? generatedId"
      v-model="value"
      type="search"
      :placeholder
      :disabled
      @keyup.enter="emit('search', value)"
    />
    <button v-if="clearable && value" type="button" :disabled @click="clear">
      Clear
    </button>
    <slot name="suffix" />
  </div>
</template>
```

### index.ts

```ts
export { default as SearchInput } from './SearchInput.vue'
export type { InputSize } from './SearchInput.types'
```

### Consumer.vue

In this example the consumer is beside the module's index. It owns the initial query and decides what a submitted search does.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SearchInput } from './index'

const query = ref('')
const lastSearch = ref('')
function performSearch(value: string) {
  lastSearch.value = value
}
</script>

<template>
  <SearchInput v-model="query" @search="performSearch" />
  <p v-if="lastSearch">Last search: {{ lastSearch }}</p>
</template>
```
