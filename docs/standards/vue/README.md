# Vue standards

## Foundations for a new component

Start from the consumer's call site and decide what the component owns. Read [API design](../shared/component-api-design.md), [colocation](../shared/code-colocation.md), [folder structure](component-folder-structure.md) and [file reading order](component-file-structure.md). Design inputs using [props](component-props.md), [defaults](component-defaults.md) and [types](component-types.md).

For package placement and live controls, see [Vue architecture](../../architecture/vue.md). For a complete illustrative SFC and a small standalone one, see [component examples](../../reference/vue-component-examples.md). The [catalog workflow](../../../README.md#add-a-catalog-entry) covers the consuming example.

## Find a standard by task

| When the change involves | Read |
| --- | --- |
| Adding a prop | [API design](../shared/component-api-design.md), [props](component-props.md), [defaults](component-defaults.md), [types](component-types.md) |
| Changing an omitted value | [Defaults and reactive destructuring](component-defaults.md) |
| Two-way binding | [Models](component-models.md) |
| Reporting an action | [Emits](component-emits.md) |
| Replacing content or passing slot data | [Slots](component-slots.md) |
| Forwarding attributes or exposing a method | [Options and exposure](component-options-and-exposure.md), [public boundaries](../shared/public-api-boundaries.md) |
| Extracting behavior | [Colocation](../shared/code-colocation.md), [folder structure](component-folder-structure.md), [composables](composables.md), [filenames](../shared/naming-conventions.md) |
| Typing a data-driven component | [Generics](generic-components.md), [types](component-types.md) |
| Editing template bindings | [Template conventions](template-conventions.md) |
| Referencing elements, child instances or accessible IDs | [Template refs and IDs](template-refs-and-ids.md) |
| Changing exports | [Public API boundaries](../shared/public-api-boundaries.md) |
| Documenting behavior | [Component documentation](component-documentation.md) |
| Checking feature availability | [Vue feature compatibility](../../reference/compatibility.md#vue-feature-compatibility) |

## Review a component

Use the items that apply to the change.

- [ ] Try the common call and the F12 test. Can a caller find justified props, useful defaults, models, events and slots without tracing private code?
- [ ] Do the local props contract and defaults appear together before the behavior that uses them?
- [ ] Does each extracted type express a meaningful concept? Is the contract authored once and each public export deliberate?
- [ ] Does the folder fit the complexity? Are private files colocated, named for their purpose and reachable through a clear public boundary?
- [ ] Do prop reads stay reactive across function calls? Do initial model values agree? Do declared events and slots match what the template and handlers deliver?
- [ ] Can refs be null safely? Are labels and descriptions connected to the right elements? Do the compiler, consumer runtime and language tools support the chosen features?
- [ ] Do examples and JSDoc explain non-obvious behavior? Can any departure from a preferred convention be explained by the component's requirements?
