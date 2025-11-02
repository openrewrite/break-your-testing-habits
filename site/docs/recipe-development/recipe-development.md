---
sidebar_position: 1
---

# Refaster rules

Automated code migrations are implemented using a combination of **Error Prone Refaster** rules and **OpenRewrite** recipes.
This hybrid approach provides both the expressiveness of pattern matching and the powerful refactoring capabilities of OpenRewrite.

## Architecture

The migration framework consists of three main components:

1. **Refaster Rules** - Define before/after code patterns using Google's Error Prone Refaster.
2. **OpenRewrite Recipes** - Auto-generated from Refaster templates to perform actual transformations.
3. **Recipe Tests** - Verify transformations work correctly on real code examples.

## Project Structure

The recipes are developed in the `recipes/` module:

```
recipes/
├── pom.xml                                   # Maven configuration
├── src/main/java/
│   └── com/github/timtebeek/recipes/
│       └── AssertToAssertThat.java           # Refaster templates
├── src/main/resources/META-INF/rewrite/
│   ├── rewrite.yml                           # Recipe composition
│   └── classpath.tsv.gz                      # Type information
└── src/test/java/
    └── com/github/timtebeek/recipes/
        └── AssertToAssertThatTest.java       # Recipe tests
```

## How Refaster Rules Work

Refaster rules define code transformations using a simple before/after pattern:

```java
@RecipeDescriptor(
    name = "Convert assert to AssertJ",
    description = "Convert `assert` statements to AssertJ assertions."
)
static class AssertThatIsNull {
    @BeforeTemplate
    void before(Object actual) {
        assert actual == null;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual) {
        assertThat(actual).isNull();
    }
}
```

### Key Annotations

- **`@RecipeDescriptor`** - Provides recipe name and description for documentation.
- **`@BeforeTemplate`** - Defines the pattern to match in existing code.
- **`@AfterTemplate`** - Defines the replacement code.
- **`@UseImportPolicy`** - Controls how imports are added (`STATIC_IMPORT_ALWAYS`, `IMPORT_CLASS_DIRECTLY`, etc.).

### Template Compilation

When you compile the project from the `recipes` directory, the `rewrite-templating` annotation processor automatically generates OpenRewrite recipes from your Refaster rules:

```bash
mvn clean compile
# Generates: recipes/target/generated-sources/annotations/com/github/timtebeek/recipes/AssertToAssertThatRecipes.java
```

The generated class contains one `Recipe` for each Refaster rule.

## Writing Refaster Rules

### Basic Pattern Matching

Refaster templates can match various code patterns:

```java
static class AssertThatIsNullWithMessage {
    @BeforeTemplate
    void before(Object actual, String message) {
        assert actual == null : message;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, String message) {
        assertThat(actual).as(message).isNull();
    }
}
```

### Type Constraints

You can constrain templates to match only specific types:

```java
static class AssertThatStringIsEmpty {
    @BeforeTemplate
    void before(String str) {
        assert str.isEmpty();
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(String str) {
        assertThat(str).isEmpty();
    }
}
```

### Multiple Overloads

Create separate templates to match different method signatures:

```java
// Without message
static class AssertThatIsNotNull {
    @BeforeTemplate
    void before(Object actual) {
        assert actual != null;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual) {
        assertThat(actual).isNotNull();
    }
}

// With message
static class AssertThatIsNotNullWithMessage {
    @BeforeTemplate
    void before(Object actual, String message) {
        assert actual != null : message;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, String message) {
        assertThat(actual).as(message).isNotNull();
    }
}
```

## Writing Recipe Tests

Let's write tests using OpenRewrite's testing framework to verify the transformations we defined:

```java
class AssertToAssertThatTest implements RewriteTest {

    @Override
    public void defaults(RecipeSpec spec) {
        spec.recipe(new AssertToAssertThatRecipes());
    }

    @DocumentExample  // Shows this test in recipe documentation.
    @Test
    void assertNull() {
        rewriteRun(
          java(
            """
            class Test {
                void test(Object obj) {
                    assert obj == null;
                }
            }
            """,
            """
            import org.assertj.core.api.Assertions;

            class Test {
                void test(Object obj) {
                    Assertions.assertThat(obj).isNull();
                }
            }
            """
          )
        );
    }
}
```

### Test Structure

1. **Before code** - First string argument shows the original code.
2. **After code** - Second string argument shows the expected result.
3. **Imports** - OpenRewrite automatically adds necessary imports.
4. **Formatting** - Indentation and whitespace are preserved.

### Best Practices for Tests

- Include one test per template to verify it works.
- Use `@DocumentExample` on the most representative test.
- Test edge cases (null messages, complex expressions, etc.).
- Verify imports are added correctly.
- Test that the transformation doesn't break valid code.

## Recipe Composition

The `rewrite.yml` file allows you to compose recipes and add preconditions:

```yaml
---
type: specs.openrewrite.org/v1beta/recipe
name: com.github.timtebeek.AssertToAssertThatRecipesForTests
displayName: Convert `assert` to `assertThat` in tests.
description: Convert `assert` to `assertThat` in test methods only.
preconditions:
  - org.openrewrite.java.search.IsLikelyTest
recipeList:
  - com.github.timtebeek.recipes.AssertToAssertThatRecipes
```

### Preconditions

Preconditions ensure recipes only run in appropriate contexts:

- `org.openrewrite.java.search.IsLikelyTest` - Only transform test files.
- `org.openrewrite.java.search.FindMethods` - Only transform specific methods.
- Custom preconditions - Create your own filters.

## Development Workflow

### 1. Generate Type Table

When starting a new recipe project, generate type information for dependencies:

```bash
mvn generate-resources -Ptypetable
```

This creates `META-INF/rewrite/classpath.tsv.gz` with type information for libraries like AssertJ.

### 2. Write Refaster Rules

Add templates to your Java file:

```java
@RecipeDescriptor(
    name = "Your Recipe Name",
    description = "What this recipe does"
)
static class YourRecipeName {
    @BeforeTemplate
    void before(/* parameters */) {
        // Pattern to match
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(/* same parameters */) {
        // Replacement code
    }
}
```

### 3. Compile to Generate Recipes

```bash
mvn clean compile
```

The annotation processor generates OpenRewrite recipes in `target/generated-sources/annotations/`.

### 4. Write Tests

Add tests to verify your transformations:

```java
@Test
void yourRecipeTest() {
    rewriteRun(
      java(
        """
        // Before code
        """,
        """
        // After code
        """
      )
    );
}
```

### 5. Run Tests

```bash
mvn test
```

### 6. Apply Recipes

Use the OpenRewrite Maven plugin to apply recipes to a codebase:

```bash
cd /path/to/target/codebase
mvn org.openrewrite.maven:rewrite-maven-plugin:run \
  -Drewrite.recipeArtifactCoordinates=com.github.timtebeek:recipes:1.0-SNAPSHOT \
  -Drewrite.activeRecipes=com.github.timtebeek.AssertToAssertThatRecipesForTests
```

## Debugging Tips

### View Generated Recipes

Check the generated recipe code:

```bash
cat target/generated-sources/annotations/com/github/timtebeek/recipes/AssertToAssertThatRecipes.java
```

### Test Individual Templates

Create focused tests for specific transformations:

```java
@Test
void specificCase() {
    rewriteRun(
      spec -> spec.recipe(new AssertToAssertThatRecipes.AssertThatIsNullRecipe()),
      java(
        "assert obj == null;",
        "assertThat(obj).isNull();"
      )
    );
}
```

## Resources

- [OpenRewrite Documentation](https://docs.openrewrite.org/).
- [Refaster User Guide](https://errorprone.info/docs/refaster).
- [OpenRewrite Recipe Development](https://docs.openrewrite.org/authoring-recipes).
- [AssertJ Documentation](https://assertj.github.io/doc/).
