# Component types

**Status** — Approved

**Scope** — Type ownership, inference and deliberate public exports.

## Standard

Build a visible local props interface out of meaningful concepts. Keep a component-exclusive union such as `'start' | 'end'` where it is read. Extract `SelectOption` into `Select.types.ts` when the component, its option row and consumers share the same shape. `type IsDisabled = boolean` adds a jump without expressing a constraint.

```ts
import type { SelectOption } from './Select.types'

interface Props {
  options: readonly SelectOption[]
  disabled?: boolean
}
```

Private types belong beside their use. Publish a type explicitly when consumers need to name it. Promote it to a shared domain only when ownership expands.

For an ordinary constructible SFC, `InstanceType<typeof Select>['$props']` describes consumer-facing props and can include Vue attributes and listeners. Where available, `ComponentProps<typeof Select>` from `vue-component-type-helpers` is another inference option. This helper is outside the current package dependencies. If consumers need the exact authored shape, a named interface exported from a normal TypeScript script block in the same SFC can also serve `defineProps` in script setup. Re-export it deliberately at the package boundary.

Vue's compiler derives runtime declarations from syntax. Imported building blocks work, but conditional types requiring analysis of the entire props object can fail even when TypeScript accepts the type. Check both SFC compilation and consumer inference. See [public API boundaries](../shared/public-api-boundaries.md), [generic components](generic-components.md) and [Vue type declarations](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props).
