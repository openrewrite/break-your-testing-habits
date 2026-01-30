---
sidebar_position: 4
---
import RunRecipe from '@site/src/components/RunRecipe';

# AssertJ Best Practices

To switch to AssertJ and apply all associated best practices, you can [use the OpenRewrite recipe](https://docs.openrewrite.org/recipes/java/testing/assertj/assertj-best-practices) `org.openrewrite.java.testing.assertj.Assertj`.

You can run the migration recipe using one of the following methods.

<RunRecipe
  recipeName="org.openrewrite.java.testing.assertj.Assertj"
  recipeDisplayName="Adopt AssertJ"
  artifact="org.openrewrite.recipe:rewrite-testing-frameworks"
  intellijDescription="Adopt AssertJ and apply best practices to assertions."
/>
