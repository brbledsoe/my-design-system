# Design system documentation

Start with the area that answers your question. For implementation, use the standards index to find the shared guidance and the framework-specific pages for the task. Consult architecture, patterns, or reference as needed, then use the repository's [verification instructions](../README.md#verify-a-change).

| Area | What belongs there |
| --- | --- |
| [Standards](standards/README.md) | Implementation requirements and preferences. Start with [shared standards](standards/shared/README.md) or the [Vue task index](standards/vue/README.md). |
| [Architecture](architecture/README.md) | How the system is structured, including package responsibilities, dependencies, and boundaries. |
| [Patterns](patterns/README.md) | Reusable solutions to recurring problems and the behavior implementations should preserve. |
| `guides/` | Task-oriented workflows. Create this directory when the first standalone guide is ready. For now, see [Add a catalog entry](../README.md#add-a-catalog-entry). |
| [Reference](reference/README.md) | Technical facts, public contracts, and compatibility information. |
| [Research](research/README.md) | Evidence, proposals, and experiments for evaluating future changes. |
| `decisions/` | Historical records of significant architectural decisions and their rationale. Create this directory when the first decision is recorded. |

## Authority and discovery

For a Vue change, go directly to [standards by task](standards/vue/README.md#find-a-standard-by-task), the [review checklist](standards/vue/README.md#review-a-component), or the [worked examples](reference/vue-component-examples.md).

Use approved standards for implementation rules and the maintained architecture and pattern pages for existing structure and behavior they document. Use reference pages for facts about the supported system. Research can inform proposals. Implementation guidance takes effect when adopted in its canonical documentation. The [standards index](standards/README.md) explains how to read statuses and resolve conflicts.

Humans and agents use these same pages. [AGENTS.md](../AGENTS.md) routes tasks to the relevant documentation. Skills describe how to carry out repeatable tasks, source code shows the implementation, and automated checks validate it.

## Writing and maintaining docs

- Give each page one coherent subject. Use concise, descriptive kebab-case filenames and `README.md` for directory indexes.
- Keep shared guidance in one canonical page. Link directly to it from framework-specific pages when they explain how to apply it.
- Link to maintained components and runnable examples when they illustrate the guidance. Update the owning page when its guidance changes.
- When moving a page, update links into it and relative links within it. Add a direct link from the nearest index when introducing a page.
