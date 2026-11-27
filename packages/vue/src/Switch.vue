<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  label: string
  description?: string
  disabled?: boolean
}

const {
  label,
  description,
  disabled,
} = defineProps<Props>()

const checked = defineModel<boolean>({ required: true })
const id = useId()
</script>

<template>
  <label class="mds-switch" :data-disabled="disabled || undefined">
    <span>
      <span :id="id" class="mds-switch__label">{{ label }}</span>
      <span v-if="description" :id="id + '-description'" class="mds-switch__description">
        {{ description }}
      </span>
    </span>
    <input
      v-model="checked"
      class="mds-switch__input"
      type="checkbox"
      role="switch"
      :disabled="disabled"
      :aria-labelledby="id"
      :aria-describedby="description ? id + '-description' : undefined"
    />
    <span class="mds-switch__track" aria-hidden="true"></span>
  </label>
</template>
