# Choose the platform package structure
Type: research
Label: wayfinder:research
Status: resolved
Assignee: Codex

## Question
Which source belongs in each workspace, how should the two runtimes load it, and which consumer tests establish compatibility?

## Answer

Use three packages for the pilot. Share the visual decisions and implement the screen interactions using each platform's controls. Keep the two real screen compositions, their data, routing and submit handlers in the consuming apps. Extract shared behavior later if both screens demonstrate the same rule and can express it independently of either renderer.

| Workspace | Owns | Consumer entry |
| --- | --- | --- |
| `packages/tokens` | Typed DTCG JSON, primitive values, semantic aliases, build transforms | A CSS subpath such as `./web.css` and a CSS-free `./native` JavaScript module with TypeScript declarations |
| `packages/vue` | Vue 3 SFCs, DOM semantics, keyboard and focus behavior, component styles | Compiled ESM, declarations, and an exported stylesheet that includes or imports the token CSS |
| `packages/react-native` | Native components, accessibility props, touch behavior and native styles | Compiled JavaScript and declarations with an explicit public root export and a dependency on the token package's native entry |

**Why this boundary.** Adobe Spectrum uses semantic tokens as the normal consumer interface and reserves component-specific tokens for requirements unique to a component. Brave's Leo generates web CSS and platform-native assets from shared token sources. For this pilot, use a semantic role such as `color.text.default` in both implementations and keep a platform-specific behavior such as web focus indication in its adapter. These are architectural precedents, not evidence that the proposed packages already work together. [Adobe Spectrum tokens](https://spectrum.adobe.com/page/design-tokens/) · [Brave Leo implementation](https://github.com/brave/leo/blob/main/AGENTS.md)

**Token generation.** Use the stable DTCG 2025.10 syntax for types, dimensions, sRGB colors and whole-token aliases. Pin Style Dictionary in the workspace. Its docs explicitly report partial support for 2025.10. Start with a representative color alias and spacing alias, assert the exact generated CSS and JavaScript values, and only adopt additional token features after testing them. For an authored spacing of 16 px, choose a web output of `16px` and a native output of the number `16` in density-independent units. A formatter or transform may be needed to deliver that native API. Validate actual output before adopting a transform group. [DTCG format](https://www.designtokens.org/tr/2025.10/format/) · [Style Dictionary support](https://styledictionary.com/info/dtcg/) · [Transform groups](https://styledictionary.com/reference/hooks/transform-groups/predefined/) · [Built-in formats](https://styledictionary.com/reference/hooks/formats/predefined/) · [React Native dimensions](https://reactnative.dev/docs/height-and-width)

**Loading and dependencies.** Use pnpm workspaces and local `workspace:*` package dependencies during development. Set Vue as a peer and externalize it in Vite library mode. Emit SFC declarations with `vue-tsc`. Set React and React Native as peers of the native package and keep their versions aligned with the host Expo SDK. Point package exports at exact built filenames. Metro prioritizes matched exports and skips platform-extension probing at that boundary. Expo configures workspace resolution through `expo/metro-config` on SDK 52 and later. Isolated installs are supported from SDK 54, with some library-specific exceptions. Use the actual pilot app versions as the initial compatibility baseline. [pnpm workspaces and packing](https://pnpm.io/workspaces) · [Vite library mode](https://vite.dev/guide/build.html#library-mode) · [Vue TypeScript tooling](https://vuejs.org/guide/typescript/overview.html) · [Metro exports](https://metrobundler.dev/docs/package-exports/) · [Expo monorepos](https://docs.expo.dev/guides/monorepos/)

**Local acceptance checks for implementation.**

1. Build the packages in dependency order, pack all three locally with pnpm and inspect the archives. Verify every advertised export exists and each internal manifest dependency became a concrete version. Install the matching token and adapter tarballs together with npm in each independent consumer outside the workspace. This exercises the distribution a second project will receive. [pnpm packing behavior](https://pnpm.io/workspaces#publishing-workspace-packages)
2. Type-check the Vue consumer and build it in production mode. Open that build, check a computed semantic color and spacing value, and complete the real screen's primary interaction using only the keyboard. This catches missing declarations, omitted CSS and broken focus behavior. [Vue tooling](https://vuejs.org/guide/typescript/overview.html) · [Vite library mode and CSS](https://vite.dev/guide/build.html#library-mode)
3. Type-check the native consumer and run a production Metro export for each claimed target. Open the screen on an available device or emulator, complete the primary action and inspect its accessibility name and state. Record the platform and runtime versions actually exercised. A JavaScript bundle verifies resolution, while runtime interaction establishes the native behavior. [Expo CLI](https://docs.expo.dev/more/expo-cli/) · [React Native testing](https://reactnative.dev/docs/testing-overview)

These checks are proposed pilot gates. The project currently contains planning material and has no consumer results to report.
