<script setup lang="ts">
withDefaults(defineProps<{
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), { type: 'button' })
</script>

<template>
  <button class="mds-button" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
