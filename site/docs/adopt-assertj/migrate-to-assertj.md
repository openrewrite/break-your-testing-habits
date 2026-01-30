---
sidebar_position: 5
---

# Migrate to AssertJ

You can easily convert existing assertions to use [AssertJ](https://assertj.github.io/doc/) using OpenRewrite's [AssertJ recipe](https://docs.openrewrite.org/recipes/java/testing/assertj/assertj-best-practices).
This recipe contains many Refaster rules from [Error Prone Support](https://error-prone.picnic.tech/refasterrules/AssertJStringRules/).

:::tip

See the [AssertJ Best Practices](../upgrade-your-projects/assertj-best-practices.md) page for detailed instructions on running the recipe with Moderne CLI, Maven, Gradle, or IntelliJ IDEA.

:::

## Exercise A

Run the AssertJ recipe on the `books` project in this repository, and check the changes made to the test files.

:::note

Notice how nearly all the bad and outdated practices have been replaced with AssertJ's fluent assertions.
Existing use of AssertJ has been improved by for instance chaining assertions and removing redundant calls.

:::

## Exercise B

Run the recipe on your own project, and check the changes made to the test files.

:::info

At this point you can choose whether you want to keep the changes or revert them.
If you'd prefer a smaller set of changes, you can also try out individual recipes from the [AssertJ recipe family](https://docs.openrewrite.org/recipes/java/testing/assertj).

:::
