---
sidebar_position: 7
---

# Practice: Improve Test Expressiveness

Ready to practice improving test expressiveness with AssertJ? We've prepared a test class with verbose JUnit assertions that you can refactor.

## Exercise: DiscountCalculatorTest

The [`DiscountCalculatorTest`](https://github.com/timtebeek/break-your-testing-habits/blob/main/orders/src/test/java/com/github/timtebeek/orders/DiscountCalculatorTest.java) class in the `orders` module demonstrates common assertion anti-patterns:

### What you'll find

- ❌ **Verbose JUnit assertions**: `assertEquals`, `assertTrue`, `assertNotNull`
- ❌ **Manual BigDecimal comparisons**: Using `compareTo()` in assertions

### Your task

Refactor the tests to use AssertJ for better expressiveness.

**Hints:**
- AssertJ uses a fluent API that starts with `assertThat(actualValue)`.
- Look at the [Poor expressiveness](../bad-habits/poor-expressiveness.md) examples for patterns.
- BigDecimal comparisons have special assertion methods that are more readable than `compareTo()`.
- Multiple assertions on the same object can be chained together.
- The `.as()` method can add descriptive messages to your assertions.
- Check the reference table below for common patterns.

### Running the test

You can run the test in your IDE or use the following commands: 

```bash
# Run the test
mvn test -pl orders -Dtest=DiscountCalculatorTest

# Or run all tests in the orders module
mvn test -pl orders
```

### Automated refactoring

You can use OpenRewrite to automatically migrate JUnit assertions to AssertJ.
See the [AssertJ Best Practices](../upgrade-your-projects/assertj-best-practices.md) page for detailed instructions on running the recipe.

## What you'll learn

By completing this exercise, you'll gain hands-on experience with:

- Converting verbose JUnit assertions to expressive AssertJ assertions.
- Using AssertJ's fluent API for better readability.
- Handling BigDecimal comparisons elegantly.
- Writing assertions that clearly convey test intent.
- Creating better failure messages.

<details>
<summary>Click to see the refactored test</summary>

```java title="DiscountCalculatorTest.java"
package com.github.timtebeek.orders;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DiscountCalculatorTest {

    private DiscountCalculator calculator;
    private Customer silverCustomer;
    private Customer goldCustomer;

    @BeforeEach
    void setUp() {
        calculator = new DiscountCalculator();

        Address address = new Address("123 Main St", "Springfield", "IL", "62701", "USA");

        silverCustomer = new Customer("C002", "silver@example.com", "Silver User", address, "SILVER");
        goldCustomer = new Customer("C003", "gold@example.com", "Gold User", address, "GOLD");
    }

    @Test
    void goldCustomerDiscount() {
        BigDecimal subtotal = new BigDecimal("300.00");
        BigDecimal discount = calculator.calculateLoyaltyDiscount(goldCustomer, subtotal);

        assertThat(discount)
                .isEqualByComparingTo(new BigDecimal("45.00"))
                .isGreaterThan(new BigDecimal("20.00"))
                .isLessThan(new BigDecimal("50.00"));
    }

    @Test
    void totalDiscountCombinesLoyaltyAndBulk() {
        BigDecimal subtotal = new BigDecimal("600.00");
        BigDecimal totalDiscount = calculator.calculateTotalDiscount(goldCustomer, subtotal);

        // Gold customer gets 15% = 90.00
        // Bulk discount gets 5% = 30.00
        // Total should be 120.00
        assertThat(totalDiscount)
                .isEqualByComparingTo(new BigDecimal("120.00"))
                .isBetween(new BigDecimal("100.00"), new BigDecimal("150.00"));
    }

    @Test
    void discountScaleIsCorrect() {
        BigDecimal subtotal = new BigDecimal("123.45");
        BigDecimal discount = calculator.calculateLoyaltyDiscount(silverCustomer, subtotal);

        assertThat(discount)
                .hasScaleOf(2)
                .hasToString(discount.toPlainString());
    }
}
```

**Key changes:**
- `assertNotNull` + `assertEquals(0, x.compareTo(y))` replaced with `assertThat(x).isEqualByComparingTo(y)` (scale-insensitive BigDecimal comparison)
- `assertTrue(x.compareTo(y) > 0)` replaced with `assertThat(x).isGreaterThan(y)`
- Range checks combined using `isBetween()`
- Multiple assertions on the same value chained into a single fluent statement
- Redundant `assertNotNull` calls removed (AssertJ fails clearly on null)

</details>
