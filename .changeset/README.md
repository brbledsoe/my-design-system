Run `pnpm changeset` for a package change that consumers should receive.
Choose each affected package and its bump independently. Apply a batch of bumps
with `pnpm version:packages`, update the lockfile, and verify the packed consumers
before tagging the release commit.

The local pilot uses tarballs. See [release and compatibility](../docs/reference/compatibility.md).
