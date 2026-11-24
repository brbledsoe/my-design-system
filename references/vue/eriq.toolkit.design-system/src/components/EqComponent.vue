<template>
  <div :class="rootClasses" :style="rootStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useEqComponentStyles } from '../composables/useEqComponentStyles';
import type { EqComponent } from '../types';

defineOptions({ name: 'EqComponent' });

const props = withDefaults(defineProps<EqComponent>(), {
  emphasis: 'tertiary',
  appearance: 'filled',
  hover: true,
  selected: false,
  lineStyle: 'solid',
  color: 'neutral',
  size: 'md',
  radius: 'md',
  shadow: 'none',
  padding: 'standard',
  width: 'auto',
});

const { rootClasses, rootStyle } = useEqComponentStyles(props);
</script>
