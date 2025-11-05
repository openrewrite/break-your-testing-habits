---
sidebar_position: 5
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Practice: Migrate to JUnit 5

Ready to practice migrating from JUnit 4 to JUnit 5? We've prepared a test class with common JUnit 4 patterns that you can improve.

## Exercise: OrderValidatorTest

The [`OrderValidatorTest`](https://github.com/timtebeek/break-your-testing-habits/blob/main/orders/src/test/java/com/github/timtebeek/orders/OrderValidatorTest.java) class in the `orders` module demonstrates several JUnit 4 patterns that need migration:

### What you'll find

- ❌ **JUnit 4 annotations**: `@Before`, `@Test` from `org.junit`.
- ❌ **Try-catch-fail pattern**: Awkward exception testing with try-catch blocks.
- ❌ **Verbose assertions**: Manual loops and checks.
- ❌ **Old assertion style**: JUnit 4's `assertTrue`, `assertEquals`, `assertFalse`.

### Your task

Migrate this test to JUnit 5 and improve the test patterns.

**Hints:**
- Look at the [Migrate to JUnit 5](migrate-to-junit5.md) page for guidance on package and annotation changes.
- JUnit 5 uses different package names (`org.junit.jupiter.api.*` instead of `org.junit.*`).
- Lifecycle annotations have new names that better express their purpose.
- Exception testing can be done more elegantly without try-catch blocks.
- JUnit 5 relaxes visibility requirements for test classes and methods.

### Running the test

You can run the test in your IDE or use the following commands:

```bash
# Run the test
mvn test -pl orders -Dtest=OrderValidatorTest

# Or run all tests in the orders module
mvn test -pl orders
```

## Automated migration

By completing this exercise, you'll gain hands-on experience with:

- Converting JUnit 4 lifecycle annotations to JUnit 5.
- Modernizing exception testing patterns.
- Improving test readability and maintainability.
- Understanding the benefits of JUnit 5 over JUnit 4.

### Running the migration recipes

You can also use OpenRewrite to automatically migrate the test:

<Tabs groupId="projectType">
<TabItem value="moderne-cli" label="Moderne CLI">

The Moderne CLI allows you to run OpenRewrite recipes on your project without needing to modify your build files,
against serialized Lossless Semantic Tree (LST) of your project for a considerable performance boost & across projects.

You will need to have configured the [Moderne CLI](https://docs.moderne.io/user-documentation/moderne-cli/getting-started/cli-intro) on your machine before you can run the following command.

1. If project serialized Lossless Semantic Tree is not yet available locally, then build the LST.
   This is only needed the first time, or after extensive changes:
```bash title="shell"
mod build ~/workspace/
```

2. If the recipe is not available locally yet, then you can install it once using:
```shell title="shell"
mod config recipes jar install org.openrewrite.recipe:rewrite-testing-frameworks:LATEST
```

3. Run the recipe.
```shell title="shell"
mod run ~/workspace/ --recipe org.openrewrite.java.testing.junit5.JUnit4to5Migration
```

</TabItem>
<TabItem value="maven-command-line" label="Maven Command Line">

You will need to have [Maven](https://maven.apache.org/download.cgi) installed on your machine before you can run the following command.

```shell title="shell"
mvn -U org.openrewrite.maven:rewrite-maven-plugin:run -Drewrite.recipeArtifactCoordinates=org.openrewrite.recipe:rewrite-testing-frameworks:RELEASE -Drewrite.activeRecipes=org.openrewrite.java.testing.junit5.JUnit4to5Migration -Drewrite.exportDatatables=true
```

</TabItem>
<TabItem value="maven" label="Maven POM">

You may add the plugin to your `pom.xml` file, so that it is available for all developers and CI/CD pipelines.

1. Add the following to your `pom.xml` file:

```xml title="pom.xml"
<project>
  <build>
    <plugins>
      <plugin>
        <groupId>org.openrewrite.maven</groupId>
        <artifactId>rewrite-maven-plugin</artifactId>
        <version>LATEST</version>
        <configuration>
          <exportDatatables>true</exportDatatables>
          <activeRecipes>
            <recipe>org.openrewrite.java.testing.junit5.JUnit4to5Migration</recipe>
          </activeRecipes>
        </configuration>
        <dependencies>
          <dependency>
            <groupId>org.openrewrite.recipe</groupId>
            <artifactId>rewrite-testing-frameworks</artifactId>
            <version>LATEST</version>
          </dependency>
        </dependencies>
      </plugin>
    </plugins>
  </build>
</project>
```

2. Run the recipe.
```shell title="shell"
mvn rewrite:run
```

</TabItem>
<TabItem value="gradle-init-script" label="Gradle init script">

Gradle init scripts are a good way to try out a recipe without modifying your `build.gradle` file.

1. Create a file named `init.gradle` in the root of your project.

```groovy title="init.gradle"
initscript {
    repositories {
        maven { url "https://plugins.gradle.org/m2" }
    }
    dependencies { classpath("org.openrewrite:plugin:latest.release") }
}
rootProject {
    plugins.apply(org.openrewrite.gradle.RewritePlugin)
    dependencies {
        rewrite("org.openrewrite.recipe:rewrite-testing-frameworks:latest.release")
    }
    rewrite {
        activeRecipe("org.openrewrite.java.testing.junit5.JUnit4to5Migration")
        setExportDatatables(true)
    }
    afterEvaluate {
        if (repositories.isEmpty()) {
            repositories {
                mavenCentral()
            }
        }
    }
}
```

2. Run the recipe.

```shell title="shell"
gradle --init-script init.gradle rewriteRun
```

</TabItem>
<TabItem value="gradle" label="Gradle">

You can add the plugin to your `build.gradle` file, so that it is available for all developers and CI/CD pipelines.

1. Add the following to your `build.gradle` file:

```groovy title="build.gradle"
plugins {
    id("org.openrewrite.rewrite") version("latest.release")
}

rewrite {
    activeRecipe("org.openrewrite.java.testing.junit5.JUnit4to5Migration")
    setExportDatatables(true)
}

repositories {
    mavenCentral()
}

dependencies {
    rewrite("org.openrewrite.recipe:rewrite-testing-frameworks:latest.release")
}
```

2. Run `gradle rewriteRun` to run the recipe.

</TabItem>
<TabItem value="intelliJ" label="IntelliJ IDEA Ultimate">

You can run OpenRewrite recipes directly from IntelliJ IDEA Ultimate, by adding a `rewrite.yml` file to your project.

```yaml title="rewrite.yml"
---
type: specs.openrewrite.org/v1beta/recipe
name: com.github.timtebeek.AdoptJUnitJupiter
displayName: Adopt JUnit Jupiter
description: Adopt JUnit Jupiter and apply best practices to assertions.
recipeList:
  - org.openrewrite.java.testing.junit5.JUnit4to5Migration
```

After adding the file, you should see a run icon in the left margin offering to run the recipe.

</TabItem>
</Tabs>

See the [Migrate to JUnit 5](../junit-jupiter/migrate-to-junit5.md) page for more migration options.
