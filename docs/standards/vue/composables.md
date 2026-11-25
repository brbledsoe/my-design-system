# Composables

**Status** — Approved

**Scope** — Extracting cohesive reactive behavior and preserving tracking.

## Standard

Keep short reactive behavior in the component. Extract a composable when a named responsibility such as keyboard navigation is substantial, independently testable or shared. A Select-specific composable belongs beside Select. Prefer `useSelectKeyboard` to a catch-all `useCommon`. A pure calculation such as `formatNumber(value, precision)` can stay a regular function.

```ts
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export function useNormalizedQuery(source: MaybeRefOrGetter<string>) {
  const query = computed(() => toValue(source).trim())
  return { query }
}
```

This accepts a literal, a ref or a getter such as `() => search`. Read the source inside a computed or effect so subsequent changes are tracked. Resolving it once at setup captures a snapshot. A plain object of refs lets consumers destructure several results while retaining their reactivity.

Give resources a clear lifetime. For example, attach a window listener on mount and remove the same handler on unmount. Document when a composable must run within component setup. See [colocation](../shared/code-colocation.md), [reactive prop access](component-defaults.md) and [Vue composables](https://vuejs.org/guide/reusability/composables.html).
