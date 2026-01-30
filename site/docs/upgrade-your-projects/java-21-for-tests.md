---
sidebar_position: 2
---
import RunRecipe from '@site/src/components/RunRecipe';

# Java 21 for tests

The OpenRewrite [UpgradeToJava21](https://docs.openrewrite.org/recipes/java/migrate/upgradetojava21) recipe can automatically convert string concatenation to text blocks in your Java code, as well as upgrade other parts of your application to align with Java 21 best practices, like using `getFirst()` and `getLast()` on sequenced collections.

In this case we're going to look at upgrading just the tests to Java 21; not yet upgrading the main source code.
This split in the Java version used for `src/main` and `src/test` is possible with both Maven and Gradle.
With Maven, you can set the `maven.compiler.testRelease` property to 21 in the `maven-compiler-plugin` configuration.

We find starting out with newer Java versions in tests only is often a good way to start adoption.
Developers can write new tests and update existing tests to use newer Java features,
while the main application code can be upgraded at a more leisurely pace as it continues to target the version you're on.
You'll be able to adapt your build pipelines already, and prove to management that the newer Java version work well for your team.

We will first create a custom recipe file in the root of your project, that applies the `UpgradeToJava21` recipe only to test code,
by using a dedicated precondition that matches test code only.

```yaml title="rewrite.yml"
---
type: specs.openrewrite.org/v1beta/recipe
name: com.github.timtebeek.Java21ForTests
displayName: Adopt Java 21 for tests
description: Upgrade your tests to Java 21.
preconditions:
  - org.openrewrite.java.search.IsLikelyTest
recipeList:
  - org.openrewrite.java.migrate.UpgradeToJava21
```

You can run OpenRewrite recipes directly from IntelliJ IDEA Ultimate; after adding the file to your repository,
you should see a run icon in the left margin offering to run the recipe.

If you're not using IntelliJ IDEA Ultimate, you can run the above recipe using one of the following methods.

<RunRecipe
  recipeName="com.github.timtebeek.Java21ForTests"
  recipeDisplayName="Java 21 for tests"
  artifact="org.openrewrite.recipe:rewrite-migrate-java"
  requiresYamlInstall={true}
/>
