<template>
  <div
    class="eq-group"
    :class="[
      rootClasses,
      `eq-group--${props.direction}`,
      `eq-group--overflow-${props.overflow}`,
    ]"
    :style="groupStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEqComponentStyles } from '../composables/useEqComponentStyles';
import type { EqGroup } from '../types';

defineOptions({ name: 'EqGroup' });

const props = withDefaults(defineProps<EqGroup>(), {
  emphasis: 'tertiary',
  appearance: 'filled',
  hover: true,
  selected: false,
  color: 'neutral',
  size: 'md',
  radius: 'md',
  padding: 'standard',
  width: 'auto',
  direction: 'horizontal',
  gap: '8',
  overflow: 'visible',
});

const { rootClasses, rootStyle } = useEqComponentStyles(props);
const groupStyle = computed(() => ({
  ...rootStyle.value,
  '--eq-group-gap': `var(--eq-space-${props.gap})`,
}));
</script>

<style scoped>
.eq-group {
  gap: var(--eq-group-gap);
  align-items: stretch;
}

.eq-group--horizontal {
  flex-direction: row;
}

.eq-group--vertical {
  flex-direction: column;
}

.eq-group--overflow-visible {
  overflow: visible;
}

.eq-group--overflow-wrap {
  flex-wrap: wrap;
}

.eq-group--overflow-scroll {
  overflow: auto;
}

.eq-group--overflow-clip {
  overflow: clip;
}
</style>
