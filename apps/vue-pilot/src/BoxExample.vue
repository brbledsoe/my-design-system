<script setup lang="ts">
import { Box } from '@my-design-system/vue'
</script>

<template>
  <Box class="box-preview">Zero padding</Box>
  <Box as="section" padding="medium" aria-label="Overview" class="box-preview">
    Project overview
  </Box>
</template>

<style scoped>
.box-preview {
  border: 1px solid var(--mds-color-border);
  margin-block-end: var(--mds-space-small);
}
</style>
