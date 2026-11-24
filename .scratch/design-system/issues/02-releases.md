# Choose the release and maintenance model
Type: research
Label: wayfinder:research
Status: resolved
Assignee: Codex

## Question
How should local installation, independent releases, backports and future registry publication work?

## Answer

Version the tokens, Vue 3 and React Native packages independently. Configure Changesets with empty `fixed` and `linked` arrays. A Vue-only fix gets a Vue patch changeset. For a shared-token change, review each renderer’s declared range and observable behavior, then record any renderer releases the change requires. Run `changeset version` locally and review the resulting manifests and changelogs. A fixed group releases every member together. A linked group coordinates the version numbers of members due for release. Neither grouping is necessary for the pilot. [Versioning and publishing](https://changesets.dev/guide/versioning-and-publishing) · [Fixed groups](https://changesets.dev/guide/fixed-packages) · [Linked groups](https://changesets.dev/guide/linked-packages)

### Local delivery

1. With npm workspaces, use a compatible ordinary semver range for each internal runtime dependency. Build the packages first. Pack each distributable workspace into an existing artifact directory with `npm pack --workspace=<package> --pack-destination=<directory> --json`. Inspect each archived manifest and verify that the advertised entry points, type declarations and platform assets exist. If the producer uses pnpm's `workspace:^` syntax, use `pnpm pack` so that the shipped dependency range becomes ordinary semver. [npm workspace resolution](https://github.com/npm/rfcs/blob/main/implemented/0026-workspaces.md) · [npm pack](https://docs.npmjs.com/cli/v12/commands/npm-pack/) · [pnpm workspace packing](https://pnpm.io/workspaces#publishing-workspace-packages)
2. In a separate Vue consumer with the supported framework installed, copy its required archives into `vendor/` and install them in one command. For example, `npm install ./vendor/tokens-0.1.0.tgz ./vendor/vue-0.1.0.tgz`, substituting the actual filenames reported by the packer. Repeat in the React Native consumer with its renderer and compatible runtime peers. Supply an archive for every unpublished internal dependency the renderer needs, including transitive ones, at a version satisfying its packed ranges. npm accepts multiple local archive arguments and otherwise resolves named dependencies normally. [npm install](https://docs.npmjs.com/cli/v12/commands/npm-install/)
3. Keep the archives at their recorded relative paths. From a clean consumer checkout run `npm ci`, inspect `npm ls` and the lockfile, and build and run each screen using only installed package entry points. The acceptance evidence is a successful browser render and native render with the intended archives, without the producer workspace on the consumer’s resolution path. This is a proposed test for implementation. [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/) · [npm install](https://docs.npmjs.com/cli/v12/commands/npm-install/)

### Maintenance and a future registry

Open a maintenance line when an adopter needs a supported older major. Start from the affected package’s last release tag or its recorded pilot commit, set the branch’s Changesets `baseBranch`, apply the compatible fix with a patch changeset, and run the older consumer against newly packed artifacts. Record the supported package, major and end-of-support decision. For example, Vue 1.4.2 can receive 1.4.3 while Vue 2 continues independently. [Changesets backport guide](https://changesets.dev/guide/backporting-changes)

Once a registry and visibility are chosen, publish the verified package versions and record per-package Git tags. npm accepts the tested archive as a publish input. Keep `latest` for the current stable line. An older line can publish with `--tag legacy-1`, and a preview can use `--tag next`. A consumer may request a precise version or an explicit tag. [npm publish](https://docs.npmjs.com/cli/v11/commands/npm-publish/) · [npm distribution tags](https://docs.npmjs.com/cli/v11/commands/npm-dist-tag/) · [Changesets release tags](https://changesets.dev/guide/versioning-and-publishing)
