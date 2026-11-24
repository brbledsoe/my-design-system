# Plan the multi-framework design system
Label: wayfinder:map

## Destination
An implementable local pilot proving one screen each in Vue 3 and React Native. A second project can install the packages using npm.

## Notes
The owner confirmed both platforms and local distribution first. Use Wayfinder, Improve Codebase Architecture, and primary-source research. The implementation sequence lives in [the pilot plan](spec.md).

## Decisions so far

- [Choose the platform package structure](issues/01-platforms.md) recommends a token module and two installable platform adapters, verified in external consumers.
- [Choose the release and maintenance model](issues/02-releases.md) recommends independent versions, package-specific Git tags and backports on demand.

## Not yet specified
Which real adoption scenarios justify extracting shared behavior or supporting another framework?

## Out of scope
Publishing packages, choosing public visibility, and shipping production screens during planning.
