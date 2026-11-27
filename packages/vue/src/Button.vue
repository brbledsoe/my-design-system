<script setup lang="ts">
interface Props {
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const {
  disabled,
  type = 'button',
} = defineProps<Props>()

defineSlots<{
  default?(): any
}>()
</script>

<template>
  <button class="mds-button" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
