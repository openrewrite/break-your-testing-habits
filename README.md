# [Break your testing habits](https://openrewrite.github.io/break-your-testing-habits/docs/intro.html)

> [!NOTE]
> This repository is archived and no longer maintained.
> The workshop was presented at conferences, but is unlikely to be presented again.
> Feel free to browse the material or work through it on your own; just expect dependency versions to drift out of date.

A hands-on workshop on adopting better testing practices in Java, using [OpenRewrite](https://docs.openrewrite.org/) to automate the migrations.

## Contents

The [workshop site](https://openrewrite.github.io/break-your-testing-habits/docs/intro.html) walks through seven sections:

1. **Bad habits**: common but outdated testing patterns, and ways to improve them.
2. **Old habits**: legacy frameworks such as JUnit 3 & 4, Hamcrest and older Spring MockMvc usage.
3. **JUnit Jupiter**: migrating to JUnit 5 and 6, with parameterized and nested tests.
4. **Adopt AssertJ**: more expressive, type-specific assertions.
5. **Advanced AssertJ**: soft assertions, recursive comparison, extracting and custom assertions.
6. **Upgrade your projects**: applying best practices and rolling out upgrades in real-world projects.
7. **Recipe development**: writing your own OpenRewrite recipe.

The repository layout:

- [`site/`](site): the Docusaurus source for the workshop site.
- [`books/`](books): example tests showing each habit, from plain `assert` and JUnit 3 through to AssertJ.
- [`orders/`](orders): a small order domain whose tests serve as hands-on exercises for the JUnit and AssertJ sections.
- [`recipes/`](recipes): the custom recipe built in the recipe development section.
- [`rewrite.yml`](rewrite.yml): declarative recipes composed during the workshop, to adopt AssertJ and Java 21 in tests.
