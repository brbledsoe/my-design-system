# Tooling options for Vue standards

**Status** — Research

The workspace already builds declarations with `vue-tsc`, type-checks pilot consumers and verifies packed exports. Use those checks for technical contracts and the [review checklist](../standards/vue/README.md#review-a-component) for design judgment. A type check can detect a bad event payload. It cannot tell whether callers need the event.

| Candidate | What to evaluate before adoption |
| --- | --- |
| [vue/define-macros-order](https://eslint.vuejs.org/rules/define-macros-order.html) | Configure the order to match the public declarations. Test it on imports, local types and late instance exposure. |
| [vue/define-props-declaration](https://eslint.vuejs.org/rules/define-props-declaration.html) | Type-based and runtime modes exist. Try a real component with a runtime validator before choosing an enforcement scope. |
| [vue/define-props-destructuring](https://eslint.vuejs.org/rules/define-props-destructuring.html) | The rule offers always, never and assignment-based modes. Each needs a way to allow deliberate whole-object use. |
| [vue-component-meta with Storybook](https://storybook.js.org/docs/get-started/frameworks/vue3-vite) | Compare extracted props, defaults, models, events, slot payloads and JSDoc with source and consumer inference, especially for generics. |

The active workspace lockfile has no eslint-plugin-vue, vue-component-meta or Storybook installation. Choosing compatible ESLint, Vue parser and plugin versions would be part of any lint adoption. A future architecture check could detect cross-module private imports. Focused component tests could exercise model synchronization or slot fallback behavior, and a link checker could catch stale documentation paths. Adopt a check when there is a recurring failure it can detect.
