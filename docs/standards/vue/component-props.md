# Component props

**Status** — Approved

**Scope** — Making explicitly declared component inputs discoverable.

## Standard

Declare a local interface named `Props` near the top of the SFC. List the explicit input names, required fields and optional fields there. Reserve imported types for concepts a reader may want to explore separately.

```ts
interface Props {
  field: string
  /** Decimal places shown in the UI. The stored value retains its precision. */
  precision?: number
  disabled?: boolean
}
const { field, precision = 2, disabled } = defineProps<Props>()
```

Group larger contracts by intent, such as data, presentation, interaction and feedback. An imported whole-component interface or a chain of `Pick`, `Partial` and intersections can force several jumps just to list the inputs. An exact shared primitive contract, generated component, runtime validator or interoperability requirement can justify another declaration form.

Explicit props cover only one part of the API. Models have their own declarations. HTML attributes and listeners may fall through or be forwarded to an element. Document their destination when wrapper behavior matters.

See [API design](../shared/component-api-design.md), [defaults](component-defaults.md), [types](component-types.md) and [attribute forwarding](component-options-and-exposure.md).
