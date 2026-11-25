# Component documentation

**Status** — Approved

**Scope** — Keeping source, examples and catalog guidance consistent.

## Standard

Keep the public contract in the component source. Add JSDoc at the declaration for constraints, units, fallback behavior, event timing or scoped-slot data that the type alone cannot express. For example, “Decimal places displayed. The stored value retains full precision” tells a consumer what a precision prop changes. “Whether disabled” adds little to a Boolean named `disabled`.

Use the live pilot to demonstrate a public import, common use, variants, keyboard or touch behavior and relevant edge cases. Link to source for declarations and defaults. Several hand-maintained copies of a props table create competing answers after an API change.

Cite a maintained component for the specific convention it demonstrates. Switch illustrates a required model and an accessible label relationship. For the full preferred reading order, use the [illustrative component examples](../../reference/vue-component-examples.md). Follow the [catalog contract](../../../README.md#add-a-catalog-entry). Possible [metadata tooling](../../research/vue-standards-tooling.md) belongs to a separate adoption decision.
