# Implementation standards

A standard owns a focused implementation rule or preference. [Shared standards](shared/README.md) describe principles that apply across frameworks. Framework standards explain how to apply those principles in a particular framework and link back to the shared page. Use the [Vue task index](vue/README.md) for Vue work. Add a framework index when that framework has standards to develop or publish.

## Status

| Status | Meaning |
| --- | --- |
| Draft | Under development. Use current project guidance while the draft is open. |
| Approved | Established project guidance. |
| Experimental | Under evaluation within the scope stated on the page. |
| Superseded | Historical guidance. Follow the linked replacement. |

Approved standards establish project guidance. Read the recommendation strength and exceptions on the page. The [documentation map](../README.md#authority-and-discovery) identifies other sources of authority.

## Applying standards

Start with the relevant shared principle, then read the framework page for its application. Use documented exceptions within their stated scope. If approved documents conflict, existing code contradicts a standard, or a standard requires an unsupported framework version, flag the affected guidance and its impact on the task. Keep unrelated legacy changes outside the task.

Apply these preferences to new work. For an existing component, check whether the difference reflects an older convention, an intentional exception, a compatibility limit or outdated documentation. Preserve consumer behavior and weigh adoption against the scope of the change.

| Keyword | Meaning |
| --- | --- |
| MUST | Required. |
| MUST NOT | Prohibited. |
| SHOULD | Preferred unless there is a good reason to deviate. |
| SHOULD NOT | Generally discouraged. |
| MAY | Acceptable when appropriate. |

## Writing a standard

Put the title, status, and scope at the top. A draft can start with a short scope statement. When authoring the guidance, lead with **Standard**, then add **Preferred example**, **Avoid**, **Rationale**, **Exceptions**, and **Related documentation** where each section helps. Link to maintained source or a runnable example when one illustrates the rule. When superseding a standard, link to its replacement.
