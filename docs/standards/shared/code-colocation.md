# Code colocation

**Status** — Approved

**Scope** — Ownership of implementation and supporting files across frameworks.

## Standard

Keep a private dependency close to the component or feature that changes with it. A developer removing a feature should be able to find its implementation, types, helpers and tests in one neighborhood.

For example, keep `Select/SelectOption`, `Select/Select.types.ts` and `Select/Select.utils.ts` together when Select owns them. Scattering these across package-wide `components/`, `types/` and `utils/` directories adds a search step to every change.

Start inline. Extract a neighbor when a distinct responsibility becomes easier to read, test or modify independently. File length alone tells you little about that boundary. Promote a helper when another feature actually shares its behavior, or a domain or package has clear ownership. A shared design-token contract, for example, belongs with the tokens.

See [component folder structure](../vue/component-folder-structure.md) and [naming conventions](naming-conventions.md).
