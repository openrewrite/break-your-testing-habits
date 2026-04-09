---
sidebar_position: 5
---
import RunRecipe from '@site/src/components/RunRecipe';

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

## What you'll learn

By completing this exercise, you'll gain hands-on experience with:

- Converting JUnit 4 lifecycle annotations to JUnit 5.
- Modernizing exception testing patterns.
- Improving test readability and maintainability.
- Understanding the benefits of JUnit 5 over JUnit 4.

<details>
<summary>Click to see the migrated test</summary>

```java title="OrderValidatorTest.java"
package com.github.timtebeek.orders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class OrderValidatorTest {

    private OrderValidator validator;
    private Order validOrder;

    @BeforeEach
    void setUp() {
        validator = new OrderValidator();

        OrderItem item = new OrderItem(
                "PROD-001", "Test Product", "Electronics",
                2, new BigDecimal("50.00"), new BigDecimal("100.00"));

        validOrder = new Order(
                "ORD-001", "CUST-001", LocalDate.now(), "PENDING",
                List.of(item),
                new BigDecimal("100.00"), new BigDecimal("8.50"),
                new BigDecimal("9.99"), BigDecimal.ZERO, new BigDecimal("118.49"));
    }

    @Test
    void validOrderHasNoErrors() {
        List<String> errors = validator.validate(validOrder);
        assertThat(errors).isEmpty();
        assertThat(validator.isValid(validOrder)).isTrue();
    }

    @Test
    void nullOrderReturnsError() {
        assertThatCode(() -> {
            List<String> errors = validator.validate(null);
            assertThat(errors)
                    .hasSize(1)
                    .first()
                    .asString()
                    .containsIgnoringCase("null");
        }).doesNotThrowAnyException();
    }

    @Test
    void orderWithEmptyItemsIsInvalid() {
        Order emptyItemsOrder = new Order(
                "ORD-002", "CUST-001", LocalDate.now(), "PENDING",
                Collections.emptyList(),
                BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                BigDecimal.ZERO, BigDecimal.ZERO);

        List<String> errors = validator.validate(emptyItemsOrder);
        assertThat(errors)
                .isNotEmpty()
                .anyMatch(error -> error.toLowerCase().contains("item"));
    }
}
```

**Key changes:**
- `@Before` replaced with `@BeforeEach`, `@Test` now from `org.junit.jupiter.api`
- `public` modifiers removed, `test` prefix removed from method names
- Try-catch-fail replaced with `assertThatCode(...).doesNotThrowAnyException()`
- Manual loop replaced with `anyMatch()` on the assertion
- JUnit assertions replaced with AssertJ fluent assertions

</details>

## Automated migration

### Running the migration recipes

You can also use OpenRewrite to automatically migrate the test:

<RunRecipe
  recipeName="org.openrewrite.java.testing.junit5.JUnit4to5Migration"
  recipeDisplayName="Adopt JUnit Jupiter"
  artifact="org.openrewrite.recipe:rewrite-testing-frameworks"
  intellijWrapperName="com.github.timtebeek.AdoptJUnitJupiter"
  intellijDescription="Adopt JUnit Jupiter and apply best practices to assertions."
/>

See the [Migrate to JUnit 5](../junit-jupiter/migrate-to-junit5.md) page for more migration options.
