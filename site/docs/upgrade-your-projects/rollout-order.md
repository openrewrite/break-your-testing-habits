---
sidebar_position: 0
---

# Recommended rollout order

When upgrading testing practices across multiple projects, the order matters. Each step produces a focused, reviewable set of changes. Run them one at a time, review the diff, and merge before proceeding to the next step.

## Step-by-step sequence

| Step | Recipe / Action | Why this order? |
|------|----------------|-----------------|
| 1 | [Change test method signatures](./change-test-method-signatures.md) | Small, safe changes (remove `public`, remove `test` prefix). Easy to review and merge. Reduces noise in subsequent diffs. |
| 2 | Migrate JUnit 4 to JUnit 5 | Updates annotations and imports. Best done after signature cleanup so the diff is focused on the framework migration. |
| 3 | [Adopt AssertJ](./assertj-best-practices.md) | Converts JUnit/Hamcrest assertions to AssertJ. This is the largest diff -- keeping it separate from the JUnit migration makes review manageable. |
| 4 | [Upgrade to JUnit 6](./junit6-best-practices.md) | Requires Java 17+. Only run this once your project is already on JUnit 5. |
| 5 | [Upgrade test code to Java 21](./java-21-for-tests.md) | Adopts text blocks, `SequencedCollection`, etc. in test code only. A safe way to start using modern Java before upgrading production code. |

:::tip

For a large portfolio (50+ repos), steps 1-3 deliver the highest impact. Steps 4-5 can wait until the team is comfortable with the new patterns.

Each step takes roughly 5-15 minutes per repository: run the recipe, review the diff, run the tests, and merge.

:::

## Tips for large-scale rollout

- **Start with a pilot project** -- pick a small, well-tested repo to validate each recipe before rolling out broadly.
- **One recipe per PR** -- keep each step in its own pull request for clean history and easy reverts.
- **Run tests before and after** -- recipes are well-tested, but always verify that your tests still pass.
- **Use CI to enforce new patterns** -- see the [Encourage usage](../adopt-assertj/encourage-usage.md) page for GitHub Actions examples that prevent regression to old patterns.
