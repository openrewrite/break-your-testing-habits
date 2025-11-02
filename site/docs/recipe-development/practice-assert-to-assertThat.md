---
sidebar_position: 2
---

# Practice: `assert` to `assertThat`

Now it's your turn! Complete the following exercises to practice writing Refaster templates.

## Exercise 1: Assert Not Null

Complete the `AssertThatIsNotNull` template in `AssertToAssertThat.java`:

**Goal:** Convert `assert actual != null;` to `assertThat(actual).isNotNull();`

**Steps:**
1. Add the `@BeforeTemplate` annotation and method.
2. Add the `@AfterTemplate` annotation and method.
3. Add appropriate import policy.
4. Write a test in `AssertToAssertThatTest.java`.

<details>
<summary>Solution</summary>

```java
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
```

Test:
```java
@Test
void assertNotNull() {
    rewriteRun(
      java(
        """
        class Test {
            void test(Object obj) {
                assert obj != null;
            }
        }
        """,
        """
        import org.assertj.core.api.Assertions;

        class Test {
            void test(Object obj) {
                Assertions.assertThat(obj).isNotNull();
            }
        }
        """
      )
    );
}
```
</details>

## Exercise 2: Assert Not Null with Message

Complete the `AssertThatIsNotNullWithMessage` rule:

**Goal:** Convert `assert actual != null : "message";` to `assertThat(actual).as("message").isNotNull();`

<details>
<summary>Solution</summary>

```java
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
</details>

## Exercise 3: Assert Equals

Complete the `AssertThatIsEqualTo` rule:

**Goal:** Convert `assert actual.equals(expected);` to `assertThat(actual).isEqualTo(expected);`

**Hint:** You need two parameters in the template methods.

<details>
<summary>Solution</summary>

```java
static class AssertThatIsEqualTo {
    @BeforeTemplate
    void before(Object actual, Object expected) {
        assert actual.equals(expected);
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, Object expected) {
        assertThat(actual).isEqualTo(expected);
    }
}
```
</details>

## Exercise 4: Assert Equals with Message

Complete the `AssertThatIsEqualToWithMessage` rule:

**Goal:** Convert `assert actual.equals(expected) : "message";` to `assertThat(actual).as("message").isEqualTo(expected);`

<details>
<summary>Solution</summary>

```java
static class AssertThatIsEqualToWithMessage {
    @BeforeTemplate
    void before(Object actual, Object expected, String message) {
        assert actual.equals(expected) : message;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, Object expected, String message) {
        assertThat(actual).as(message).isEqualTo(expected);
    }
}
```
</details>

## Exercise 5: Assert Not Equals

Complete the `AssertThatIsNotEqualTo` and `AssertThatIsNotEqualToWithMessage` rules:

**Goal:**
- Convert `assert !actual.equals(expected);` to `assertThat(actual).isNotEqualTo(expected);`
- Convert `assert !actual.equals(expected) : "message";` to `assertThat(actual).as("message").isNotEqualTo(expected);`

<details>
<summary>Solution</summary>

```java
static class AssertThatIsNotEqualTo {
    @BeforeTemplate
    void before(Object actual, Object expected) {
        assert !actual.equals(expected);
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, Object expected) {
        assertThat(actual).isNotEqualTo(expected);
    }
}

static class AssertThatIsNotEqualToWithMessage {
    @BeforeTemplate
    void before(Object actual, Object expected, String message) {
        assert !actual.equals(expected) : message;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, Object expected, String message) {
        assertThat(actual).as(message).isNotEqualTo(expected);
    }
}
```
</details>

## Exercise 6: Assert Same As

Complete the remaining rules for reference equality:

**Goal:**
- Convert `assert actual == expected;` (reference equality) to `assertThat(actual).isSameAs(expected);`
- Convert `assert actual != expected;` (reference inequality) to `assertThat(actual).isNotSameAs(expected);`
- Include versions with messages

**Note:** In Java, `==` checks reference equality for objects. For this exercise, assume the context where reference equality is intended.

<details>
<summary>Solution</summary>

```java
static class AssertThatIsSameAs {
    @BeforeTemplate
    void before(Object actual, Object expected) {
        assert actual == expected;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, Object expected) {
        assertThat(actual).isSameAs(expected);
    }
}

static class AssertThatIsSameAsWithMessage {
    @BeforeTemplate
    void before(Object actual, Object expected, String message) {
        assert actual == expected : message;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, Object expected, String message) {
        assertThat(actual).as(message).isSameAs(expected);
    }
}

static class AssertThatIsNotSameAs {
    @BeforeTemplate
    void before(Object actual, Object expected) {
        assert actual != expected;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, Object expected) {
        assertThat(actual).isNotSameAs(expected);
    }
}

static class AssertThatIsNotSameAsWithMessage {
    @BeforeTemplate
    void before(Object actual, Object expected, String message) {
        assert actual != expected : message;
    }

    @AfterTemplate
    @UseImportPolicy(ImportPolicy.STATIC_IMPORT_ALWAYS)
    void after(Object actual, Object expected, String message) {
        assertThat(actual).as(message).isNotSameAs(expected);
    }
}
```
</details>

### Bonus Exercise: Complex Conditions

**Challenge:** Create a template to convert complex assertions:

Convert:
```java
assertTrue(str != null && str.equals("Foo"))
```

To:
```java
assertThat(str).isNotNull().isEqualTo("Foo")
```

**Hint:** This is more challenging because you need to match compound boolean expressions. Consider starting with simpler patterns first.

## Resources

- [OpenRewrite Documentation](https://docs.openrewrite.org/).
- [Refaster User Guide](https://errorprone.info/docs/refaster).
- [OpenRewrite Recipe Development](https://docs.openrewrite.org/authoring-recipes).
- [AssertJ Documentation](https://assertj.github.io/doc/).

## Next Steps

After completing the exercises:

1. Run `mvn clean compile` to generate recipes.
2. Run `mvn test` to verify all tests pass.
3. Try applying your recipes to the `books` module.
4. Experiment with more complex transformation patterns.
5. Share your recipes with the community!
