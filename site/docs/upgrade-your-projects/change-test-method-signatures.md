---
sidebar_position: 1
---
import RunRecipe from '@site/src/components/RunRecipe';

# Change test method signatures

When it comes to adopting better testing practices for your own projects, you'll likely want to clear out some common old conventions first, before applying further changes.
This allows you to have a single focussed set of changes which you can adopt without a need for review, and reduces the chance of conflicts with subsequent changes.

To start, we'll want to change the method signatures of our test methods to follow modern conventions.
This includes:
- Changing test method visibility from `public` to package-private
- Removing `test` prefix from method names
- Changing return type to `void`
- Removing unnecessary or specific `throws` declarations

```yaml title="rewrite.yml"
---
type: specs.openrewrite.org/v1beta/recipe
name: com.github.timtebeek.ChangeTestMethodSignatures
displayName: Change test method signatures
description: Change test method visibility, name and exceptions thrown.
preconditions:
  - org.openrewrite.java.search.IsLikelyTest
recipeList:
  - org.openrewrite.java.testing.cleanup.TestsShouldNotBePublic
  - org.openrewrite.java.testing.cleanup.TestMethodsShouldBeVoid
  - org.openrewrite.java.testing.cleanup.RemoveTestPrefix
  - org.openrewrite.java.testing.cleanup.SimplifyTestThrows
```

You can run OpenRewrite recipes directly from IntelliJ IDEA Ultimate; after adding the file to your repository,
you should see a run icon in the left margin offering to run the recipe.

If you're not using IntelliJ IDEA Ultimate, you can run the above recipe using one of the following methods.

<RunRecipe
  recipeName="com.github.timtebeek.ChangeTestMethodSignatures"
  recipeDisplayName="Change test method signatures"
  artifact="org.openrewrite.recipe:rewrite-testing-frameworks"
  showIntelliJ={false}
  requiresYamlInstall={true}
/>
