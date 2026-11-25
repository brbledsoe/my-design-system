# Turning a README-only repository into an npm design-system package

_Research date: 2026-11-24. Sources are limited to first-party npm, Node.js, TypeScript, and GitHub documentation._

## Recommendation in one sentence

Start by installing the three packages from local archives. The examples below describe a possible later public release. [Multi-framework pilot plan](../../.scratch/design-system/spec.md)

## What is actually required

An npm package must contain a `package.json` to be published. For a published package, `name` and `version` are required; the version must be parseable by npm's semver implementation. [`private: true` makes npm refuse publication](https://docs.npmjs.com/cli/configuring-npm/package-json/). In practical terms, the smallest useful library also needs a license, README, built entry point, and—if it promises TypeScript support—a declaration entry point. npm always includes `package.json`, README variants, and license variants in a package even if ignore rules would otherwise exclude them ([npm package author guide](https://docs.npmjs.com/cli/using-npm/developers/)).

Recommended initial files:

```text
.
├─ src/
│  ├─ index.ts              # public JavaScript/TypeScript API
│  └─ styles.css            # tokens/components, if applicable
├─ dist/                    # generated, consumer-ready output
│  ├─ index.js
│  ├─ index.d.ts
│  └─ styles.css
├─ package.json
├─ tsconfig.json            # if TypeScript is used
├─ README.md
├─ LICENSE
└─ .github/workflows/publish.yml
```

`dist/` is a recommendation, not an npm requirement. The important contract is that every path named by `main`, `types`, or `exports` exists in the packed artifact. TypeScript can emit `.d.ts` files describing a module's external API and can place emitted `.js`, `.d.ts`, and map files under `outDir` ([TypeScript TSConfig reference](https://www.typescriptlang.org/tsconfig/)).

## A minimal recommended `package.json`

```json
{
  "name": "@your-scope/design-system",
  "version": "1.0.0",
  "description": "Reusable design-system tokens, styles, and components",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc",
    "test": "your-test-command"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/OWNER/REPOSITORY.git"
  },
  "license": "MIT",
  "devDependencies": {
    "typescript": "<chosen-version-range>"
  }
}
```

Replace the placeholder scope, repository, license, commands, and version ranges before publishing. npm documents `publishConfig` as a way to pin publish-time settings such as registry and access, and documents `name` plus `version` as the required published-package identifier ([npm `package.json` reference](https://docs.npmjs.com/cli/configuring-npm/package-json/)).

### Entry points, modules, and types

Node recommends `exports` for new packages. It can define the main entry, subpath entry points, and conditional resolution, while preventing imports of undeclared package subpaths; when both `exports` and `main` exist, supported Node versions use `exports` ([Node.js package entry-point documentation](https://nodejs.org/api/packages.html#package-entry-points)). Keeping `main` alongside `exports` is a compatibility measure for older tools, while `exports` is the authoritative public API.

The `type` field controls how Node interprets `.js` files: with `"type": "module"`, `.js` files are ES modules; `.mjs` is always ESM and `.cjs` is always CommonJS regardless of that field ([Node.js `type` documentation](https://nodejs.org/api/packages.html#type)). If consumers must use `require`, produce and expose a real CommonJS build (for example `dist/index.cjs`) through a `require` condition rather than pointing both conditions at an ESM file; Node documents conditional `import`/`require` exports as distinct entry points ([Node.js conditional exports](https://nodejs.org/api/packages.html#conditional-exports)).

For TypeScript consumers, bundle declarations and point `types` at the main `.d.ts` file; this is the official TypeScript publishing pattern ([TypeScript declaration publishing guide](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)). TypeScript's `declaration` option generates `.d.ts` files, and `emitDeclarationOnly` is available when another tool emits JavaScript ([TypeScript `emitDeclarationOnly`](https://www.typescriptlang.org/tsconfig/emitDeclarationOnly.html)).

### Build output

The sample tsc script needs an additional step to produce the exported stylesheet. For Vue SFCs, use the Vue plugin with Vite library mode and generate declarations with vue-tsc. Verify each exported file in the archive. [Vite library mode](https://vite.dev/guide/build#library-mode) · [Vue TypeScript tooling](https://vuejs.org/guide/typescript/overview)

Do not publish a package whose entry points exist only after a consumer runs a local toolchain. npm's `prepare` script can run before publication and lets consumers use compiled functionality without compiling it themselves, but it also runs during local `npm install`; use it deliberately rather than hiding a large or environment-sensitive build in installation ([npm `package.json` scripts guidance](https://docs.npmjs.com/files/package.json/#devdependencies)). A simpler release pipeline is explicit: install, test, build, pack-inspect, then publish.

## Dependency placement

- Put packages needed at consumer runtime in `dependencies`; npm defines these as packages required in production. Put compilers, bundlers, linters, test runners, and documentation tools used only to develop or build the library in `devDependencies` ([npm dependency guidance](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file/)).
- Put a host framework that the consuming application should supply—commonly React, Vue, or another plugin host—in `peerDependencies`. npm defines peers as a compatibility contract with a host and recommends keeping the compatible range as broad as is genuinely supported; npm 7 and later install peers by default ([npm `peerDependencies` reference](https://docs.npmjs.com/cli/configuring-npm/package-json/#peerdependencies)).
- If declarations exposed by the public API refer to another declaration package, that declaration dependency must be available to consumers rather than existing only in `devDependencies` ([TypeScript declaration dependency guidance](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#dependencies)).

A framework can appear in both `peerDependencies` (the consumer compatibility contract) and `devDependencies` (so this repository can build and test against it). Avoid bundling a peer framework into the library output unless that duplication is an intentional part of the product.

## Controlling package contents

Prefer the `files` allow-list for a small library: npm defines it as the files/directories included when the package is installed, and its default is effectively all files ([npm `files` reference](https://docs.npmjs.com/cli/configuring-npm/package-json/#files)). With `"files": ["dist"]`, npm still includes package metadata, README, and license files ([npm package author guide](https://docs.npmjs.com/cli/using-npm/developers/#keeping-files-out-of-your-package)).

Use `.npmignore` only when an allow-list is impractical. If the package root has no `.npmignore`, npm uses `.gitignore`; an empty `.npmignore` overrides that fallback. npm also always excludes some repository metadata and ignores `node_modules` except bundled dependencies ([npm package author guide](https://docs.npmjs.com/cli/using-npm/developers/#keeping-files-out-of-your-package)).

Before every first or changed release payload, run:

```sh
npm run build
npm pack --dry-run
npm pack
```

`npm pack` creates the same kind of tarball used for publication and reports its filenames; `--dry-run` reports what would happen without writing the tarball ([npm `pack` command](https://docs.npmjs.com/cli/v12/commands/npm-pack/)). Inspect the list, then install the generated `.tgz` into a separate minimal consumer project (for example `npm install ../path/to/your-scope-design-system-1.0.0.tgz`) and verify JavaScript imports, CSS imports, TypeScript resolution, and peer warnings. npm explicitly supports local tarball specs ([npm package-spec documentation](https://docs.npmjs.com/cli/v9/using-npm/package-spec/#tarballs)).

## Scope, public access, and release identity

The npm CLI v12 publish reference lists public access for new packages, while the v11 scope guide describes restricted access for scoped packages. Choose visibility explicitly before publication. [npm v12 access](https://docs.npmjs.com/cli/v12/commands/npm-publish/#access) · [npm v11 scope guide](https://docs.npmjs.com/cli/v11/using-npm/scope/#publishing-public-scoped-packages-to-the-primary-npm-registry)

Each release needs a new version. npm recommends semantic versioning starting at `1.0.0`: increment patch for backward-compatible fixes, minor for backward-compatible functionality, and major for breaking changes ([npm semantic-versioning guide](https://docs.npmjs.com/about-semantic-versioning/)). npm will not allow a previously published `name@version` combination to be reused, even after unpublishing ([npm `publish` documentation](https://docs.npmjs.com/cli/v12/commands/npm-publish/)).

## Authentication, 2FA, trusted publishing, and provenance

For a manual first publication, create or join the npm scope, enable 2FA, authenticate with `npm login`, confirm the payload, and run `npm publish --access public`. npm requires package publication to use account 2FA or an appropriately configured granular token, and recommends trusted publishing for CI/CD ([npm 2FA publishing requirements](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/)). The browser/security-key CLI login flow is documented under [`npm login` with 2FA](https://docs.npmjs.com/accessing-npm-using-2fa/).

For ongoing automation, prefer npm trusted publishing. It establishes an OIDC trust relationship with an authorized GitHub Actions, GitLab CI/CD, or CircleCI workflow, removes the need for a long-lived npm write token, and requires `id-token: write` in GitHub Actions ([npm trusted-publisher documentation](https://docs.npmjs.com/trusted-publishers/)). Configure the exact GitHub owner, repository, and workflow filename in the package's npm settings, use a GitHub-hosted runner, and grant only `contents: read` plus `id-token: write` to the publish job.

Trusted publishing automatically creates npm provenance for qualifying public packages built from public repositories on supported providers. Provenance links the published package to source and build instructions; it is evidence of origin, not a guarantee that the code is safe ([npm provenance documentation](https://docs.npmjs.com/generating-provenance-statements/)). A token-authenticated GitHub Actions fallback can request the same attestation with `npm publish --provenance`, provided npm's documented provenance prerequisites are satisfied ([npm provenance workflow](https://docs.npmjs.com/generating-provenance-statements/#publishing-packages-with-provenance-via-github-actions)).

As of this research date, npm states that long-lived direct-publish granular tokens are being deprecated and recommends trusted publishing for CI/CD; stage-only tokens are the documented fallback when OIDC is unavailable ([npm access-token documentation](https://docs.npmjs.com/about-access-tokens/)). Never commit an npm token or generated authentication line to the repository.

## GitHub direct installs versus registry publication

npm accepts full Git URLs, GitHub shorthand, tags, branches, and commit refs as dependency specs, for example `OWNER/REPOSITORY#v1.0.0` or a full `git+ssh` URL ([npm package-spec documentation](https://docs.npmjs.com/cli/v9/using-npm/package-spec/#git-urls)). This is useful for short-lived evaluation, private development with appropriate Git credentials, or testing a commit before registry release.

For normal consumers, publish to a registry. A registry package is addressed by `name@version` and distributed as a tarball, whereas a Git dependency makes the repository itself the install source ([npm package formats](https://docs.npmjs.com/about-packages-and-modules/#about-package-formats)). Registry publication therefore gives this design system an explicit package payload, semver release history, access controls, provenance support, and a conventional install command. GitHub Packages is a separate registry option; it requires scope-to-registry configuration and authentication as documented by GitHub ([GitHub npm registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry)). It is not the same as installing directly from a Git repository.

## CI publishing options

Illustrative single-package workflow for a later public release. Supply a committed npm lockfile, implement the consumer check below, and verify the Node/npm versions meet trusted publishing requirements. The pnpm pilot has a separate build sequence.

```yaml
name: Publish package
on:
  release:
    types: [published]

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          registry-url: https://registry.npmjs.org
          package-manager-cache: false
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm pack --pack-destination "$RUNNER_TEMP"
      - run: npm run verify:consumer -- "$RUNNER_TEMP"/*.tgz
      - run: npm publish "$RUNNER_TEMP"/*.tgz --access public
```

The exact action and Node versions should be pinned or updated according to the repository's maintenance policy. GitHub documents publishing to npm after CI with `actions/setup-node`, and npm documents the OIDC permission and hosted-runner requirements for trusted publishing ([GitHub Node package publishing](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages), [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)).

Available release modes, in preference order:

1. **GitHub Actions plus npm trusted publishing:** no stored npm write token; best default for a public GitHub repository supported by npm OIDC ([npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)).
2. **Manual `npm publish` with 2FA:** suitable for the first package setup or deliberately human-controlled releases ([npm 2FA requirements](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/)).
3. **Token-authenticated CI:** use only when trusted publishing is unavailable, scope the token narrowly, and follow npm's current staged-publishing guidance ([npm access tokens](https://docs.npmjs.com/about-access-tokens/)). GitHub's documented workflow passes a registry token through `NODE_AUTH_TOKEN` rather than writing it into source ([GitHub Node package publishing](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages#publishing-packages-to-the-npm-registry)).
4. **GitHub Packages:** choose this only when consumers are prepared to configure and authenticate to `npm.pkg.github.com` ([GitHub npm registry documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry)).

## Minimal implementation and release sequence

1. Choose the public API and package name; reserve or confirm control of the npm user/organization scope.
2. Add `LICENSE`, `package.json`, source entry points, and—if applicable—`tsconfig.json`.
3. Implement a deterministic `build` that creates all paths named by `exports`, `main`, and `types` under `dist/`.
4. Classify runtime, host, and tooling packages into `dependencies`, `peerDependencies`, and `devDependencies` respectively.
5. Add the `files` allow-list and explicit public npm `publishConfig`.
6. Run tests and the build, then inspect `npm pack --dry-run` and install the real `.tgz` in a clean consumer fixture.
7. Publish `1.0.0` manually with 2FA if package creation requires an interactive first release.
8. Configure the package's npm trusted publisher for the exact GitHub Actions workflow, then release subsequent semver versions only after CI passes.
9. Confirm the npm package page shows the intended files, README, license, repository link, and provenance; install `@your-scope/design-system@<released-version>` in a clean project as the final smoke test.
