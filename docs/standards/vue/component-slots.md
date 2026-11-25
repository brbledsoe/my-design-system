# Component slots

**Status** — Approved

**Scope** — Content extension points and scoped payloads.

## Standard

Declare the slots the template actually renders using `defineSlots` near the public contract. Choose a name that describes the replaceable region and type any data passed to the consumer.

```ts
defineSlots<{
  item?(props: { label: string }): any
  empty?(): any
}>()
```

For example, `<slot name="item" :label="item.label">{{ item.label }}</slot>` gives callers a useful rendering even when they omit the slot. Mark optional slots with `?`. Require a slot only if the component genuinely needs the caller's content. A slot for each nested DOM element makes markup changes expensive.

The macro uses the function argument to type slot props. Vue currently ignores the return type, which is why the example uses `any` in that position. See [API design](../shared/component-api-design.md) and [Vue slot declarations](https://vuejs.org/api/sfc-script-setup.html#defineslots).
