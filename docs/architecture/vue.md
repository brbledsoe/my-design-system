# Vue architecture

For component contracts and SFC organization, use the [Vue standards by task](../standards/vue/README.md). The controls below demonstrate package placement and existing behavior. Button, Box and Switch keep their local `Props` interfaces and defaults beside the public declarations. Button and Box also declare their default slots. The [props](../standards/vue/component-props.md), [defaults](../standards/vue/component-defaults.md) and [slots](../standards/vue/component-slots.md) standards explain these conventions.

## Source and exports

- Keep layout primitives in `packages/vue/src/primitives/`. Follow [Box](../../packages/vue/src/primitives/Box.vue) for a layout primitive and [Button](../../packages/vue/src/Button.vue) or [Switch](../../packages/vue/src/Switch.vue) for an interactive control.
- Export public components from the [Vue package entry point](../../packages/vue/src/index.ts). Import them from `@my-design-system/vue` in the [Vue pilot](../../apps/vue-pilot/), just as an app using the package would.

## Styles and tokens

- Keep styles for a new component in its `.vue` file when they only apply to that component. Put shared Vue rules in the [package stylesheet](../../packages/vue/src/styles.css), available to consumers as `@my-design-system/vue/styles.css`.
- Use the existing `--mds-*` CSS variables from the [shared tokens](../../packages/tokens/src/) for values the system already defines.

## Public behavior

- Use native HTML elements for interactive controls when they provide the needed semantics and keyboard behavior. Follow the existing controls for accessible names, focus, and disabled state.
- Preserve public props, events, slots, and accessibility behavior when editing a component unless the change explicitly updates its API or behavior.
