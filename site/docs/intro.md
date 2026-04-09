---
sidebar_position: 0
---

# Intro

Today, we're going to break your old testing habits and learn some new ones.

This workshop consists of several sections, each focusing on a different aspect of improving your testing practices.

| # | Section | Time | Level |
|---|---------|------|-------|
| 1 | [Bad habits](./category/bad-habits/) - Common but outdated testing patterns, and ways to improve them. | ~30 min | Beginner |
| 2 | [Old habits](./category/old-habits/) - Legacy testing frameworks and libraries that are still in use today. | ~30 min | Beginner |
| 3 | [JUnit Jupiter](./category/junit-jupiter/) - Migrate to JUnit 5 (Jupiter), learn about JUnit 6, and explore features like parameterized and nested tests. | ~45 min | Beginner - Intermediate |
| 4 | [Adopt AssertJ](./category/adopt-assertj/) - Dive into AssertJ for more expressive assertions. | ~45 min | Beginner - Intermediate |
| 5 | [Advanced AssertJ](./category/advanced-assertj/) - Master fluent assertions for cleaner and more maintainable tests. | ~45 min | Intermediate |
| 6 | [Upgrade your projects](./category/upgrade-your-projects) - Apply what we've learned to upgrade testing practices in real-world projects. | ~30 min | Intermediate |
| 7 | [Recipe development](./category/recipe-development/) - Create custom OpenRewrite recipes to automate improvements in your own codebases. | ~60 min | Advanced (optional) |

:::tip

**Short on time?** Sections 1-4 form a self-contained "quick wins" track (~2.5 hours) that covers the most impactful improvements. Sections 5-7 go deeper and can be tackled later.

:::

## Getting Started

### Clone the repository

To get started, clone the workshop repository:

```bash
git clone https://github.com/openrewrite/break-your-testing-habits.git
cd break-your-testing-habits
```

This repository contains example code that you'll use throughout the workshop to explore the topics, write tests, and practice refactoring techniques.

### Workshop structure

We recommend going through the sections in order, but you're welcome to go at your own pace.
There is a lot of material to cover, so feel free to take breaks and revisit sections as needed.

You're also welcome to use your own projects to try out the improvements alongside the provided examples.

### Key concepts

Throughout this workshop, we'll use [OpenRewrite](https://docs.openrewrite.org/) to automate code transformations.
OpenRewrite **recipes** are automated refactoring scripts that can migrate your code between frameworks, apply best practices, and fix common issues -- across an entire codebase in minutes, not weeks.
You don't need to understand how recipes work to _run_ them; the final section covers how to _write_ your own.

### What you'll need

- Java 8+, to run recipes
- Gradle 4.10+, or
- Maven 3+
- Java 21+, to develop recipes (section 7 only)
