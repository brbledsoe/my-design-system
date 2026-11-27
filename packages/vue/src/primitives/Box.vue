<script setup lang="ts">
interface Props {
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav'
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xLarge'
}

const {
  as = 'div',
  padding = 'none',
} = defineProps<Props>()

defineSlots<{
  default?(): any
}>()
</script>

<template>
  <component :is="as" :class="'mds-box--padding-' + padding">
    <slot />
  </component>
</template>

<style>
.mds-box--padding-none { padding: 0; }
.mds-box--padding-small { padding: var(--mds-space-small); }
.mds-box--padding-medium { padding: var(--mds-space-medium); }
.mds-box--padding-large { padding: var(--mds-space-large); }
.mds-box--padding-xLarge { padding: var(--mds-space-x-large); }
</style>
