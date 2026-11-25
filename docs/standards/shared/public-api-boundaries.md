# Public API boundaries

**Status** — Approved

**Scope** — Module entry points, exports and private implementation.

## Standard

Consumers import from documented package entry points. A component module with several files can use an explicit index to identify its public component and types. The package entry point then selects which of those are public to consumers. For example, a hypothetical Select module might export just these names:

```ts
export { default as Select } from './Select.vue'
export type { SelectOption } from './Select.types'
```

A private option row, normalizer or composable can change without coordinating a consumer migration. Avoid wildcard re-exports and consumer imports that traverse internal source paths. Inside the module, import neighbors directly to avoid cycles through its own index.

Today a consumer can use `import { Switch } from '@my-design-system/vue'`. A standalone component needs no extra barrel of its own. Check the [package entry point](../../../packages/vue/src/index.ts) and [package exports](../../../packages/vue/package.json) when changing the contract. See [type ownership](../vue/component-types.md).
