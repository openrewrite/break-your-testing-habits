---
sidebar_position: 4
---
import RunRecipe from '@site/src/components/RunRecipe';

# AssertJ Best Practices

To switch to AssertJ and apply all associated best practices, you can [use the OpenRewrite recipe](https://docs.openrewrite.org/recipes/java/testing/assertj/assertj-best-practices) `org.openrewrite.java.testing.assertj.Assertj`.

This recipe applies a comprehensive set of changes:

- **Converts JUnit assertions** -- `assertEquals`, `assertTrue`, `assertFalse`, `assertNull`, `assertNotNull` all become fluent `assertThat(...)` calls
- **Converts Hamcrest assertions** -- `assertThat(value, is(...))` and other matchers become AssertJ equivalents
- **Improves existing AssertJ** -- chains separate assertions, replaces `assertThat(x.size()).isEqualTo(n)` with `assertThat(x).hasSize(n)`, removes redundant `isNotNull()` checks
- **Adds AssertJ dependency** if not already present, and removes unused Hamcrest dependencies

:::tip

This is a great recipe to run on the `books` module first to see the changes before applying it to your own projects.

:::

You can run the migration recipe using one of the following methods.

<RunRecipe
  recipeName="org.openrewrite.java.testing.assertj.Assertj"
  recipeDisplayName="Adopt AssertJ"
  artifact="org.openrewrite.recipe:rewrite-testing-frameworks"
  intellijDescription="Adopt AssertJ and apply best practices to assertions."
/>
