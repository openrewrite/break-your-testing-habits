---
sidebar_position: 3
---
import RunRecipe from '@site/src/components/RunRecipe';

# JUnit 6 Best Practices

To upgrade to JUnit 6 and apply all associated best practices, you can [use the OpenRewrite recipe](https://docs.openrewrite.org/recipes/java/testing/junit/junit6bestpractices) `org.openrewrite.java.testing.junit.JUnit6BestPractices`.

This recipe applies the following changes:

- **JUnit 5 to 6 migration** -- updates dependencies and removes APIs dropped in JUnit 6
- **Removes `@EnabledOnJre`/`@DisabledOnJre` conditions** for Java versions below 17, since JUnit 6 requires Java 17+
- **Applies JUnit Jupiter best practices** -- removes `public` modifiers, removes `test` prefixes, simplifies `throws` declarations
- **Updates assertions** to use the latest recommended patterns

:::tip

Before running this recipe, ensure your project already compiles with Java 17+. The recipe migrates your test code but does not change your Java version.

:::

You can run the migration recipe using one of the following methods.

<RunRecipe
  recipeName="org.openrewrite.java.testing.junit.JUnit6BestPractices"
  recipeDisplayName="JUnit 6 Best Practices"
  artifact="org.openrewrite.recipe:rewrite-testing-frameworks"
/>
