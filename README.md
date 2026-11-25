# My Design System

The consuming app chooses its package explicitly. A Vue site uses `@my-design-system/vue` on desktop and phones. A React Native app uses `@my-design-system/react-native`. Both draw from `@my-design-system/tokens`.

## Run the pilot

Use Node 24 and the pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter vue-pilot dev
pnpm --filter native-pilot start
```

Run the two app commands in separate terminals. The native app uses Expo SDK 56 and can be opened with a compatible Expo Go client or development build.

The Vue server serves the [catalog](apps/vue-pilot/index.html) at `/`, with a [Box reference](apps/vue-pilot/box.html) and the [Notification preferences example](apps/vue-pilot/notification-preferences.html).

## Add a catalog entry

Start with the closest maintained example. [Box](packages/vue/src/primitives/Box.vue) shows a layout primitive with token-backed styles. [Button](packages/vue/src/Button.vue) and [Switch](packages/vue/src/Switch.vue) show interactive controls. The [Notification preferences pattern](docs/patterns/notification-preferences.md) describes the behavior the Vue and native examples share.

Decide the public props, relevant states, and accessibility behavior before visual polish. Put framework-specific code in its own package and use shared tokens for values both platforms should share.

Keep the catalog homepage plain HTML. Add the name under Foundations, Components, Utilities, or Patterns and link it when a working example exists. Give each finished entry one reference with a live example, a copyable public import where applicable, and the behavior another implementation should preserve. Update that reference when the public behavior changes.

## Verify a change

- For package source changes, run `pnpm build` and `pnpm check`.
- For token changes, run `pnpm verify:tokens` after building.
- For Vue catalog routes or examples, run `pnpm --filter vue-pilot build` and open the affected page.
- For changes to public exports, shipped styles, or public behavior, run `pnpm verify:packed` after building. See [Install in another project](#install-in-another-project) for browser setup.

## Install in another project

Build and verify the archives once from the monorepo. The verifier uses isolated projects, npm, and a browser. Install Playwright's Chromium once with `pnpm exec playwright install chromium`, or set `PLAYWRIGHT_CHANNEL` to an installed Chromium browser channel such as `msedge`.

```sh
pnpm build
pnpm verify:tokens
pnpm verify:packed
```

Copy the matching archives from `artifacts/` to the consuming project's `vendor/` directory. In a Vue 3 app, run:

```sh
npm install ./vendor/my-design-system-tokens-0.1.0.tgz ./vendor/my-design-system-vue-0.1.0.tgz
```

```ts
import { Button, Switch } from '@my-design-system/vue'
import '@my-design-system/vue/styles.css'
```

In a React Native app with compatible React and React Native versions, run:

```sh
npm install ./vendor/my-design-system-tokens-0.1.0.tgz ./vendor/my-design-system-react-native-0.1.0.tgz
```

```ts
import { Button, Switch } from '@my-design-system/react-native'
```

See the [interaction pattern](docs/patterns/notification-preferences.md), [compatibility and release guide](docs/compatibility.md), and [architecture plan](.scratch/design-system/spec.md).
