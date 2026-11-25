# Component file structure

**Status** — Approved

**Scope** — Reading order within a Vue single-file component.

## Standard

Prefer `<script setup lang="ts">`, followed by the template and any component-owned styles. Within the script, a reader should encounter the public contract in one pass.

1. Imports and any necessary component options.
2. Local `Props` interface, then `defineProps` and its defaults.
3. Models, emits and slots that the component supports.
4. Private implementation, grouped by behavior.
5. Explicit instance exposure, when needed, after the exposed bindings are defined and before any top-level await.

Keep a keyboard-navigation watcher beside the state and handlers it coordinates. Sorting every watcher, computed value and handler into separate blocks can scatter that behavior. Whitespace usually provides enough separation. Omit unused sections and decorative banners.

A normal script block can own module-level exports or other work that requires module scope. Use it when the need is concrete. See the [complete and standalone examples](../../reference/vue-component-examples.md), [props standard](component-props.md) and [Vue script setup reference](https://vuejs.org/api/sfc-script-setup.html).
