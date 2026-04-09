---
sidebar_position: 4
---

# Migrate to AssertJ

You can easily convert existing assertions to use [AssertJ](https://assertj.github.io/doc/) using OpenRewrite's [AssertJ recipe](https://docs.openrewrite.org/recipes/java/testing/assertj/assertj-best-practices).
This recipe contains many Refaster rules from [Error Prone Support](https://error-prone.picnic.tech/refasterrules/AssertJStringRules/).

:::tip

See the [AssertJ Best Practices](../upgrade-your-projects/assertj-best-practices.md) page for detailed instructions on running the recipe with Moderne CLI, Maven, Gradle, or IntelliJ IDEA.

:::

## What to expect

The recipe will automatically convert JUnit and Hamcrest assertions to their AssertJ equivalents. Typical changes include:

- `assertEquals(expected, actual)` becomes `assertThat(actual).isEqualTo(expected)`
- `assertTrue(list.contains(x))` becomes `assertThat(list).contains(x)`
- `assertNotNull(value)` followed by `assertEquals(...)` becomes a single chained assertion
- Hamcrest `assertThat(value, is(...))` becomes `assertThat(value).isEqualTo(...)`
- Existing AssertJ assertions are also improved, e.g. by chaining separate assertions and removing redundant null checks

Most transformations are safe to merge without manual review. However, you should check:
- **Custom Hamcrest matchers** -- these won't be converted automatically
- **Assertion messages** -- the recipe preserves them via `.as(...)`, but phrasing may read differently in the fluent style
- **BigDecimal comparisons** -- `assertEquals` with BigDecimal uses `.equals()` (scale-sensitive), while AssertJ's `isEqualTo` does the same; use `isEqualByComparingTo` if you want scale-insensitive comparison

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
