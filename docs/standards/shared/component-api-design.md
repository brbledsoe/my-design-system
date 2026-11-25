# Component API design

**Status** — Approved

**Scope** — Designing the contract a component presents to consumers.

## Standard

Design the common call site first. Give a component responsibility for the complexity it can resolve from the consumer's intent. A numeric field that knows its data type can choose formatting, ordering and alignment together. An illustrative call is `<NumberField field="temperature" />`. Requiring a formatter, numeric-sort flag and right-alignment flag on every use makes callers reconstruct those semantics and permits contradictory combinations.

Before exposing a setting, identify a real use case the default cannot cover. Check whether existing inputs already determine the answer. Prefer a prop for a simple choice and composition for replacing meaningful content. A two-value size prop can be easier to use than a tree of customization components. An opinionated wrapper should expose the underlying library's options individually only where consumers need them.

## The F12 test

Use Go to Definition from a typical call site. Within about 30 seconds, can a new developer find the inputs, required values, defaults, two-way bindings, events and content extension points? This is a review heuristic. Following a domain type for its details is reasonable. Reading private interaction logic to discover the public contract signals a design problem.

See [public API boundaries](public-api-boundaries.md) and [Vue declaration order](../vue/component-file-structure.md).
