# Template conventions

**Status** — Approved

**Scope** — Bindings and readable expressions in SFC templates.

## Standard

Prefer Vue's same-name shorthand when the bound expression has the same meaningful name as the attribute. In `<button :disabled>`, Vue reads the current value of `disabled`. In `<button disabled>`, the HTML Boolean attribute disables the button unconditionally. For a Boolean component prop, the bare form normally passes true.

Use `<Results :items="machines" />` when the local name describes the actual data. Renaming `machines` to `items` solely to save characters loses information. With a whole props object, `:disabled="props.disabled"` makes the source explicit. Keep one readable access style within a component.

Leave a short condition such as `v-if="items.length"` inline. Give repeated branching with product meaning a name such as `canEditSelection` and implement it in a computed value. Name handlers after their intent.

See [defaults and prop access](component-defaults.md) and [Vue attribute bindings](https://vuejs.org/guide/essentials/template-syntax.html#attribute-bindings).
