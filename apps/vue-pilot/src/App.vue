<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Switch } from '@my-design-system/vue'

const theme = ref<'light' | 'dark'>('light')
const weeklyDigest = ref(false)
const savedDigest = ref(false)
const confirmation = ref('')
const dirty = computed(() => weeklyDigest.value !== savedDigest.value)

function save() {
  if (!dirty.value) return
  savedDigest.value = weeklyDigest.value
  confirmation.value = 'Preferences saved.'
}
</script>

<template>
  <main class="settings" :data-mds-theme="theme">
    <div class="settings__body">
      <h1>Notification preferences</h1>
      <p>Choose which updates you get by email.</p>

      <form aria-label="Email preferences" @submit.prevent="save">
        <h2>Email updates</h2>
        <Switch
          v-model="weeklyDigest"
          label="Weekly digest"
          description="Get one email with the highlights from your account."
          @update:model-value="confirmation = ''"
        />
        <div class="settings__actions">
          <Button type="submit" :disabled="!dirty">Save preferences</Button>
          <p role="status">{{ confirmation }}</p>
        </div>
      </form>

      <div class="settings__appearance">
        <Switch
          :model-value="theme === 'dark'"
          label="Dark appearance"
          @update:model-value="theme = $event ? 'dark' : 'light'"
        />
      </div>
    </div>
  </main>
</template>

<style>
body { margin: 0; }
.settings {
  box-sizing: border-box;
  min-height: 100dvh;
  padding: clamp(24px, 8vw, 88px) var(--mds-space-large);
  background: var(--mds-color-canvas);
  color: var(--mds-color-text);
  color-scheme: light;
  font: var(--mds-font-body)/1.5 system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.settings[data-mds-theme="dark"] { color-scheme: dark; }
.settings__body { max-width: 560px; margin-inline: auto; }
.settings h1 {
  margin: 0;
  font-size: clamp(28px, 6vw, var(--mds-font-title));
  line-height: 1.17;
  letter-spacing: -0.035em;
  text-wrap: balance;
}
.settings h2 { margin: 0; font-size: 1.125em; }
.settings p { margin: var(--mds-space-small) 0 0; color: var(--mds-color-muted); text-wrap: pretty; }
.settings form {
  display: grid;
  gap: var(--mds-space-medium);
  margin-block-start: var(--mds-space-x-large);
  padding: var(--mds-space-large);
  border: 1px solid var(--mds-color-border);
  border-radius: var(--mds-radius-panel);
  background: var(--mds-color-surface);
}
.settings__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--mds-space-small) var(--mds-space-medium);
  padding-block-start: var(--mds-space-medium);
  border-block-start: 1px solid var(--mds-color-border);
}
.settings__actions p { margin: 0; }
.settings__appearance { margin-block-start: var(--mds-space-large); padding-inline: var(--mds-space-large); }
</style>
