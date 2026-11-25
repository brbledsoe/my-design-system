# Pilot compatibility and releases

## Consumer targets

| Package | Pilot host | Check |
| --- | --- | --- |
| Vue | Vue 3.5.46, Vite 7.3.8, Chromium (Edge) | Type-check and production-build from the installed archives. Check keyboard focus, switching, save feedback and theme colors at a phone-width viewport. |
| React Native | Expo 56.0.24, React 19.2.3, React Native 0.85.3 | Type-check from the installed archives and export production Android and iOS bundles. Check touch and screen-reader behavior on each supported OS before a release. |
| Tokens | CSS custom properties and ESM | Test that the CSS and JS expose the same semantic roles and that dimensions are CSS lengths on web and numbers on native. |

The peer ranges describe the initial compatibility target. `pnpm-lock.yaml` records the workspace toolchain. The installed-consumer checks resolve dependencies using npm in projects outside the workspace.

The `0.1.0` pilot passed clean npm archive installs and type checks for both consumers on Windows with Node 24.13.0 and npm 11.6.2. The Vue production build passed the browser interaction check. Expo produced Android and iOS Hermes bundles from the installed native package. Touch and screen-reader checks still require a device or emulator.

## Vue feature compatibility

The library declares Vue `^3.5.0` as a consumer peer. The lockfile resolves Vue and its SFC compiler to 3.5.46, Vite to 7.3.8, the Vue plugin to 6.0.11, and both vue-tsc and Vue language-core to 3.3.14 with TypeScript 5.9.3 for the Vue package and pilot. See the [library manifest](../../packages/vue/package.json), [pilot manifest](../../apps/vue-pilot/package.json) and [lockfile](../../pnpm-lock.yaml).

| Vue minimum for the documented feature | Features available to the library |
| --- | --- |
| [3.3](https://blog.vuejs.org/posts/vue-3-3) | Imported prop types within compiler limits, named tuple emits, typed slots, component options, generic SFCs and `toValue` |
| [3.4](https://blog.vuejs.org/posts/vue-3-4) | Stable `defineModel` and same-name `v-bind` shorthand |
| [3.5](https://blog.vuejs.org/posts/vue-3-5) | Reactive props destructuring by default, `useTemplateRef` and `useId` |

Vite compiles the SFCs ahead of distribution and leaves Vue external. Consumers import built ESM, CSS and declarations. Compiler macros and template shorthand are compiled in the library build. Emitted helpers and imported functions such as `useId` still require a compatible consumer runtime. Editor inference and template type checking depend on Vue language tooling. Generic field inference should be checked from a consuming SFC. The feature minimums above describe Vue capabilities. The package support floor is 3.5.0 and the recorded pilot exercised 3.5.46. See the [build configuration](../../packages/vue/vite.config.ts) and [declaration settings](../../packages/vue/tsconfig.json).

## Try the notification preferences screen

1. Start with Weekly digest turned off. Save preferences is disabled.
2. Turn Weekly digest on. Save preferences becomes available.
3. Save. The screen shows “Preferences saved.” and disables Save again.
4. Enable Dark appearance, then change Weekly digest again. The controls remain usable and Save is available.
5. On web, repeat using Tab, Space, and Enter. On native, repeat using touch and VoiceOver or TalkBack. Check that the switch is announced with its name and state, the button exposes its disabled state, and save feedback is announced.

The pilot keeps preferences in memory for the current session. The app owns persistence, networking, and screen composition.

## Version and test locally

1. Add a changeset with `pnpm changeset` and select the packages consumers need to upgrade. Review semantic token names and values, exported files, peer ranges, and interaction behavior for breaking changes.
2. Apply pending changesets with `pnpm version:packages`. Run `pnpm install --lockfile-only` and review the manifest, lockfile, and changelog changes.
3. Run `pnpm build`, `pnpm verify:tokens`, and `pnpm verify:packed`. The verifier inspects the archives and installs the relevant pair into each consumer. The archives are under `artifacts/`.
4. Use `pnpm verify:releases` to exercise a Vue-only patch followed by a compatible shared token patch in a disposable copy. The consumer projects upgrade from their initial installs.
5. When a release is approved, tag the release commit by package and version, such as `@my-design-system/vue@0.1.1`. Record the compatible host versions and migration notes alongside the version.

Create a maintenance branch from a released tag when a consumer needs a backport. Keep the existing package name and use a legacy distribution tag for that older line once a registry is configured. Choose registry visibility, package ownership, and a license before the first published release. [Changesets versioning](https://changesets.dev/guide/versioning-and-publishing) · [npm distribution tags](https://docs.npmjs.com/cli/commands/npm-dist-tag/)
