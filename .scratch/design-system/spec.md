# One design system for Vue 3 and React Native

## Pilot decision

Keep the design system in one pnpm workspace. Give consumers three installable packages: tokens, Vue, and React Native. Give maintainers two private example apps. The owner confirmed a local pilot with one screen per platform. Package names below are placeholders. Expo is the recommended native example host, subject to the first consuming app's actual setup.

## Proposed repository

```text
package.json                  private root, pinned package manager, shared commands
pnpm-workspace.yaml           packages/* and apps/*
pnpm-lock.yaml                one reproducible development install
packages/
  tokens/                     authored values, themes, platform transforms, emitted CSS/JS/types
  vue/                        Vue 3 single-file components, web styles, declarations
  react-native/               native controls, styles, accessibility and declarations
apps/
  vue-pilot/                  private Vite app using the public Vue imports
  native-pilot/               private Expo app using the public native imports
docs/
  patterns/                   usage, interaction states and platform differences
  compatibility.md            exact framework/toolchain versions actually exercised
.changeset/                   per-package release intent and changelogs
```

Each UI package depends on tokens. Neither UI package imports the other. Apps depend on their own UI package and declare tokens directly if they import tokens themselves. Build tokens first. Keep transform code beside its inputs and examples private. Plain workspace scripts suffice for this graph. Add a build orchestrator when repeatable CI measurements identify a bottleneck. pnpm enforces local sibling resolution with the workspace protocol and rewrites it to consumer-compatible versions during packing. Consumers can still install with npm. [pnpm workspace mechanics](https://pnpm.io/workspaces)

## What is shared

Start with the semantic decisions a screen uses, such as action background, text on that background, control padding, and disabled appearance. Store the values and aliases in one typed token source. Produce CSS custom properties for web and typed JS values for native. Document the meaning, theme coverage and accepted types of each public token. Keep raw palette entries internal unless a consumer needs a stable contract for them. A token named for its purpose lets a theme change without renaming every caller. GitHub's Primer uses this translation pattern in production. [DTCG format](https://www.designtokens.org/tr/2025.10/format/) · [Style Dictionary transforms](https://styledictionary.com/reference/hooks/transforms/predefined/) · [Primer Primitives](https://github.com/primer/primitives)

Start by compiling one color alias and one dimension. For a 16 px spacing token, expect `16px` in CSS and the number `16` in native JS. Style Dictionary documents partial support for DTCG 2025.10, so verify the subset used before expanding the catalog. Shadows, font families and focus treatments can have platform-owned values. Fail the build for unresolved aliases, cycles, missing theme roles and unsupported conversions. [Style Dictionary compatibility](https://styledictionary.com/info/dtcg/) · [React Native dimensions](https://reactnative.dev/docs/height-and-width)

Share the *meaning and acceptance criteria* of an interaction. For example, a disabled Save action announces its state and never submits. Vue can implement that with a native HTML button and form handling. React Native can use Pressable, Text, an accessibility role and state, and platform press handling. Each platform owns focus, input events, layout and accessibility implementation. This makes it possible to add a React web package later by reusing the CSS and interaction criteria. Extract framework-neutral state logic only when two implementations demonstrate the same rules and transitions. [React Native accessibility](https://reactnative.dev/docs/accessibility)

## Packaging decisions

| Package | Build and install contract | Verification |
| --- | --- | --- |
| Tokens | Explicit CSS and native JS entry points, declarations for the native values. Keep transformation tooling in development dependencies. | Both themes expose the promised names. Importing native values traverses no CSS or Node-only tooling. |
| Vue | Compile single-file components with Vite library mode and its Vue plugin. Generate declarations with vue-tsc. Export the stylesheet explicitly and document the app's stylesheet import. Externalize Vue and declare it as a peer. | The example type-checks and renders from an installed archive, CSS included. |
| React Native | Start with JS/TS and native primitives. Supply Metro-resolvable built JS and matching declarations. Keep React and React Native as host peers and external to the bundle. Export exact existing paths. | Metro bundles for each claimed OS, the screen runs on a device or emulator, and the app resolves one compatible host runtime. |

Use explicit package entries and file allow-lists. Treat unpacked workspace imports as development conveniences. Vite documents library-mode CSS emission, Vue documents declaration generation, and Metro gives exports precedence over legacy main fields. [Vite library mode](https://vite.dev/guide/build#library-mode) · [Vue TypeScript tooling](https://vuejs.org/guide/typescript/overview) · [Metro package resolution](https://metrobundler.dev/docs/package-exports/) · [Expo monorepos](https://docs.expo.dev/guides/monorepos/)

## How versions work

Use a short feature branch and merge the change and its changeset to main. A release step chooses the affected versions, updates manifests, internal dependency ranges, the lockfile and changelogs, and records the release commit. Tag each released package at that commit, for example `@scope/vue@1.3.2`. The npm registry stores its versioned tarball when publication is enabled. A consumer on the older compatible range can keep using its locked version. [Changesets](https://github.com/changesets/changesets) · [npm publishing](https://docs.npmjs.com/cli/v12/commands/npm-publish/)

Start with independent package versions. A Vue keyboard fix can move Vue from 1.3.1 to 1.3.2 while native stays at 1.1.0. For a token rename, introduce an alias and migration advice first. Removing the documented old token after 1.0 is a breaking token release. Rebuild and test both adapters, update dependency ranges, and assess each adapter's public contract separately. Use a fixed release group only if adoption shows customers must upgrade those packages as a single kit. [Changesets version groups](https://github.com/changesets/changesets/blob/main/docs/config-file-options.md?plain=1) · [Semantic Versioning](https://semver.org/)

Three kinds of version have different jobs. A **design-system version** identifies what a consumer installs. A **framework version** belongs in the supported peer range and test matrix. A **theme or brand** selects design values at runtime. Keep one directory per maintained package. If a team needs a 1.x fix after 2.x ships, branch from its 1.x release tag, backport the fix, test and tag the patch, and use a separate npm channel such as `legacy` to preserve `latest` for 2.x. Move the fix to main if still applicable. Record who gets backports and for how long once there is a real support commitment. [npm distribution tags](https://docs.npmjs.com/cli/commands/npm-dist-tag/)

## Implementation sequence and exit criteria

1. **Select the pilot.** Suggested screen: notification preferences with a labeled toggle and a Save action. Record supported host versions, OS/browser targets, saved and unsaved states, two themes, expected keyboard and screen-reader interactions. Use an actual adopter's screen if available. Exit when both apps can run the same short acceptance script.
2. **Create the workspace and walking skeleton.** Pin Node and pnpm, commit the lockfile, create the three manifests and two private apps. Give each app one visible value from its adapter backed by tokens. Exit when editing one semantic value reaches both apps after a clean build.
3. **Implement the screen vertically.** Build only the tokens and controls the screen exercises. Implement light/dark, enabled/disabled, and save confirmation on each platform. Document differences alongside the shared acceptance script. Exit when a keyboard user on web and a touch/screen-reader user on native can finish the task and understand the outcome.
4. **Prove distribution outside the workspace.** Build with a frozen lockfile. Use pnpm pack in each package to rewrite workspace dependencies. Inspect the three tarballs and their manifests. Instantiate each pilot in an ordinary temporary directory outside the workspace, removing workspace references and source aliases. In one npm install per consumer, supply the local tokens archive and the matching local adapter archive with the real host dependencies. Check that both design-system packages resolve from the local tarballs. Type-check and production-build Vue, bundle native for the claimed OS targets and run the installed screen. Save a short compatibility record. Exit when a clean consumer reproduces each result. [pnpm workspace packing](https://pnpm.io/workspaces) · [npm install](https://docs.npmjs.com/cli/commands/npm-install/)
5. **Rehearse an upgrade.** Make a small Vue-only change, apply a patch changeset, pack and upgrade the Vue pilot. Verify the native version stays put. Then change a shared token and verify both installed consumers, the intended dependency ranges, and migration notes. Save these checks as CI gates with no registry credentials.
6. **Decide publication after the pilot.** Settle scope ownership, license, visibility, release approvers, compatibility promise and support window. If using npm, explicitly set access and configure trusted publishing for the chosen workflow. Release the same tested archives in dependency order. Verify a new install by version. [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)

## When to revisit the shape

A single package with framework subpaths is workable when all consumers share one release cadence. Here it couples distinct framework peers and upgrades immediately. Separate repos buy ownership isolation at the cost of coordinating token and adapter changes across pull requests. Three packages in one workspace preserve both a single review for a shared change and an independent install for each host. Add another adapter when a named consumer and a testable screen exist. Add an icons, behavior, or tooling package when two consumers would otherwise duplicate a substantial implementation.
