---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Parameterized tests

Instead of writing multiple similar test methods that differ only in input values and expected results, use `@ParameterizedTest` to run the same test logic with different parameters. This reduces code duplication and makes it easier to add more test cases.

## Avoid duplicate test methods

When testing the same logic with different inputs, writing separate test methods creates unnecessary duplication and makes maintenance harder.

<Tabs>
<TabItem value="before" label="Before">

```java title="StringUtilsTest.java"
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

class StringUtilsTest {

    @Test
    void emptyStringIsBlank() {
        assertTrue(StringUtils.isBlank(""));
    }

    @Test
    void whitespaceStringIsBlank() {
        assertTrue(StringUtils.isBlank("  "));
    }

    @Test
    void tabStringIsBlank() {
        assertTrue(StringUtils.isBlank("\t"));
    }

    @Test
    void nullStringIsBlank() {
        assertTrue(StringUtils.isBlank(null));
    }

    @Test
    void nonBlankStringIsNotBlank() {
        assertFalse(StringUtils.isBlank("hello"));
    }

    @Test
    void stringWithTextIsNotBlank() {
        assertFalse(StringUtils.isBlank("  hello  "));
    }
}
```

:::warning

Multiple test methods with similar logic create unnecessary duplication and make maintenance harder. Adding a new test case requires copying an entire method.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="StringUtilsTest.java"
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class StringUtilsTest {

    @ParameterizedTest
    @NullAndEmptySource // Adds `null` and `""`.
    @ValueSource(strings = {"  ", "\t", "\n"})
    void blankStrings(String input) {
        assertThat(StringUtils.isBlank(input)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"hello", "  hello  ", "test"})
    void nonBlankStrings(String input) {
        assertThat(StringUtils.isBlank(input)).isFalse();
    }
}
```

:::tip

Parameterized tests offer several benefits:
- **Less duplication**: Test logic is written once and reused with different inputs.
- **Easier maintenance**: Changes to test logic only need to be made in one place.
- **Better readability**: All test cases for similar scenarios are grouped together.
- **Simple to extend**: Adding new test cases is as easy as adding a value to the source.

:::

</TabItem>
</Tabs>

## Multiple parameter sources

JUnit 5 and 6 provide various parameter sources for different use cases.

<Tabs>
<TabItem value="valueSource" label="@ValueSource">

```java title="MathUtilsTest.java"
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class MathUtilsTest {

    @ParameterizedTest
    @ValueSource(ints = {2, 4, 6, 8, 10})
    void evenNumbers(int number) {
        assertThat(number % 2).isEqualTo(0);
    }

    @ParameterizedTest
    @ValueSource(strings = {"radar", "level", "noon"})
    void palindromes(String word) {
        assertThat(isPalindrome(word)).isTrue();
    }
}
```

:::info

`@ValueSource` is the simplest parameter source, supporting primitive types and strings.

:::

</TabItem>
<TabItem value="csvSource" label="@CsvSource">

```java title="CalculatorTest.java"
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class CalculatorTest {

    @ParameterizedTest
    @CsvSource({
        "2, 3, 5",
        "5, 7, 12",
        "10, 20, 30",
        "100, 200, 300"
    })
    void addition(int a, int b, int expected) {
        assertThat(a + b).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource({
        "apple, APPLE",
        "hello, HELLO",
        "test, TEST"
    })
    void uppercase(String input, String expected) {
        assertThat(input.toUpperCase()).isEqualTo(expected);
    }
}
```

:::info

`@CsvSource` allows you to provide multiple parameters per test case using CSV format.

:::

</TabItem>
<TabItem value="methodSource" label="@MethodSource">

```java title="UserValidatorTest.java"
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;

class UserValidatorTest {

    @ParameterizedTest
    @MethodSource("invalidEmails")
    void rejectsInvalidEmails(String email) {
        assertThat(UserValidator.isValidEmail(email)).isFalse();
    }

    static Stream<String> invalidEmails() {
        return Stream.of(
            "not-an-email",
            "@example.com",
            "user@",
            "user name@example.com"
        );
    }

    @ParameterizedTest
    @MethodSource("userTestCases")
    void validatesUsers(String name, int age, boolean valid) {
        User user = new User(name, age);
        assertThat(UserValidator.isValid(user)).isEqualTo(valid);
    }

    static Stream<Arguments> userTestCases() {
        return Stream.of(
            arguments("John", 25, true),
            arguments("", 25, false),
            arguments("Jane", -1, false),
            arguments("Bob", 150, false)
        );
    }
}
```

:::info

`@MethodSource` provides the most flexibility, allowing complex objects and reusable parameter sets.

:::

</TabItem>
<TabItem value="enumSource" label="@EnumSource">

```java title="DayTest.java"
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.time.DayOfWeek;

import static org.assertj.core.api.Assertions.assertThat;

class DayTest {

    @ParameterizedTest
    @EnumSource(DayOfWeek.class)
    void allDaysHaveNames(DayOfWeek day) {
        assertThat(day.name()).isNotBlank();
    }

    @ParameterizedTest
    @EnumSource(value = DayOfWeek.class, names = {"SATURDAY", "SUNDAY"})
    void weekendDays(DayOfWeek day) {
        assertThat(isWeekend(day)).isTrue();
    }

    @ParameterizedTest
    @EnumSource(value = DayOfWeek.class, mode = EnumSource.Mode.EXCLUDE,
                names = {"SATURDAY", "SUNDAY"})
    void weekDays(DayOfWeek day) {
        assertThat(isWeekend(day)).isFalse();
    }
}
```

:::info

`@EnumSource` is perfect for testing all values of an enum or a filtered subset.

:::

</TabItem>
</Tabs>

## Custom display names

You can customize how each parameterized test is displayed in test reports.

<Tabs>
<TabItem value="default" label="Default">

```java title="StringTest.java"
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class StringTest {

    @ParameterizedTest
    @ValueSource(strings = {"", "  ", "\t"})
    void blankStrings(String input) {
        assertThat(input.isBlank()).isTrue();
    }
}
```

:::info

By default, test names include the parameter index: `blankStrings(String) [1]`, `blankStrings(String) [2]`, etc.

:::

</TabItem>
<TabItem value="custom" label="Custom Names">

```java title="StringTest.java"
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class StringTest {

    @ParameterizedTest(name = "input=''{0}'' should be blank")
    @ValueSource(strings = {"", "  ", "\t"})
    void blankStrings(String input) {
        assertThat(input.isBlank()).isTrue();
    }

    @ParameterizedTest(name = "[{index}] {0} + {1} = {2}")
    @CsvSource({"1, 2, 3", "5, 10, 15", "100, 200, 300"})
    void addition(int a, int b, int expected) {
        assertThat(a + b).isEqualTo(expected);
    }
}
```

:::tip

Custom display names make test reports more readable:
- `{0}`, `{1}`, etc. refer to parameter values.
- `{index}` refers to the invocation index.
- Use `''` to escape single quotes in the display name.

:::

</TabItem>
<TabItem value="argumentsSource" label="Named ArgumentSets">

```java title="CalculatorTest.java"
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.argumentSet;

class CalculatorTest {

    @ParameterizedTest
    @MethodSource("additionTestCases")
    void addition(int a, int b, int expected) {
        assertThat(a + b).isEqualTo(expected);
    }

    static Stream<Arguments> additionTestCases() {
        return Stream.of(
            argumentSet("small numbers", 2, 3, 5),
            argumentSet("medium numbers", 10, 20, 30),
            argumentSet("large numbers", 100, 200, 300),
            argumentSet("negative numbers", -5, -3, -8)
        );
    }
}
```

:::tip

Using `argumentSet(name, ...)` instead of `arguments(...)` provides named test cases:
- Each test displays with its descriptive name: `addition(int, int, int) [small numbers]`.
- Makes it immediately clear which scenario failed without looking at parameter values.
- Especially useful for complex test scenarios with multiple parameters.
- Available in JUnit Jupiter 5.8+.

:::

</TabItem>
</Tabs>

## Parameterized Classes (JUnit 6)

When you have multiple test methods that all need to operate on the same object instance with different configurations, duplicating test logic becomes tedious. While `@ParameterizedTest` is great for testing a single method with different inputs, `@ParameterizedClass` takes parameterization to the class level, running all test methods for each parameter set.

### Understanding the use case

Imagine you're testing various aspects of a `ShoppingCart` object—checking if it calculates totals correctly, applies discounts properly, handles taxes, etc. Each test method currently creates the same cart configuration. To test with different cart scenarios, you face two unappealing options:
1. Duplicate the entire test class for each cart scenario you want to test
2. Convert every test method to use `@ParameterizedTest`, adding complexity to each method

`@ParameterizedClass` solves this by parameterizing the entire class: you write your test suite once, and it automatically runs against multiple object instances. Think of it as "`@ParameterizedTest` for an entire class."

### How it works

With `@ParameterizedClass`:
- The parameterization annotations are placed on the test **class** (not individual methods)
- All `@Test` methods run once for each parameter set provided
- Parameters can be injected via constructor or fields annotated with `@Parameter`
- Each parameter set gets its own fresh test class instance
- Perfect for testing the same object behavior with different configurations

<Tabs>
<TabItem value="problem" label="Without @ParameterizedClass">

```java title="ShoppingCartTest.java"
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class ShoppingCartTest {

    @Test
    void cartIsNotNull() {
        ShoppingCart cart = new ShoppingCart(new BigDecimal("100.00"), new BigDecimal("0.10"));
        assertThat(cart).isNotNull();
    }

    @Test
    void cartCalculatesSubtotal() {
        ShoppingCart cart = new ShoppingCart(new BigDecimal("100.00"), new BigDecimal("0.10"));
        assertThat(cart.getSubtotal()).isEqualByComparingTo(new BigDecimal("100.00"));
    }

    @Test
    void cartAppliesDiscount() {
        ShoppingCart cart = new ShoppingCart(new BigDecimal("100.00"), new BigDecimal("0.10"));
        assertThat(cart.getDiscount()).isEqualByComparingTo(new BigDecimal("10.00"));
    }

    @Test
    void cartCalculatesTotal() {
        ShoppingCart cart = new ShoppingCart(new BigDecimal("100.00"), new BigDecimal("0.10"));
        assertThat(cart.getTotal()).isEqualByComparingTo(new BigDecimal("90.00"));
    }
}
```

:::warning

Every test method creates the same `ShoppingCart` instance. To test multiple cart scenarios, you'd need to duplicate the entire test class or use `@ParameterizedTest` on each method individually.

:::

</TabItem>
<TabItem value="solution" label="With @ParameterizedClass">

```java title="ShoppingCartTest.java"
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedClass;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@ParameterizedClass
@CsvSource({
    "100.00, 0.10, 10.00, 90.00",   // 10% discount
    "250.00, 0.20, 50.00, 200.00",  // 20% discount
    "50.00, 0.00, 0.00, 50.00"      // No discount
})
class ShoppingCartTest {

    private final ShoppingCart cart;
    private final BigDecimal expectedDiscount;
    private final BigDecimal expectedTotal;

    // Constructor injection: parameters are injected via the constructor
    ShoppingCartTest(BigDecimal subtotal, BigDecimal discountRate, 
                     BigDecimal expectedDiscount, BigDecimal expectedTotal) {
        this.cart = new ShoppingCart(subtotal, discountRate);
        this.expectedDiscount = expectedDiscount;
        this.expectedTotal = expectedTotal;
    }

    @Test
    void cartIsNotNull() {
        assertThat(cart).isNotNull();
    }

    @Test
    void cartCalculatesSubtotal() {
        assertThat(cart.getSubtotal()).isPositive();
    }

    @Test
    void cartAppliesDiscount() {
        assertThat(cart.getDiscount()).isEqualByComparingTo(expectedDiscount);
    }

    @Test
    void cartCalculatesTotal() {
        assertThat(cart.getTotal()).isEqualByComparingTo(expectedTotal);
    }
}
```

:::tip

With `@ParameterizedClass`:
- All 4 test methods run for each of the 3 cart scenarios = 12 test executions total
- No duplication of the `ShoppingCart` instance creation
- Easy to add more scenarios by adding a line to `@CsvSource`
- All tests stay organized in one class

:::

</TabItem>
</Tabs>

### Constructor vs Field Injection

`@ParameterizedClass` supports two injection styles:

<Tabs>
<TabItem value="constructor" label="Constructor Injection">

```java title="CalculatorTest.java"
@ParameterizedClass
@CsvSource({
    "5, 3, 8, 2",
    "10, 4, 14, 6",
    "100, 25, 125, 75"
})
class CalculatorTest {

    private final Calculator calculator;
    private final int expectedSum;
    private final int expectedDifference;

    // Parameters injected via constructor
    CalculatorTest(int a, int b, int expectedSum, int expectedDifference) {
        this.calculator = new Calculator(a, b);
        this.expectedSum = expectedSum;
        this.expectedDifference = expectedDifference;
    }

    @Test
    void testAddition() {
        assertThat(calculator.add()).isEqualTo(expectedSum);
    }

    @Test
    void testSubtraction() {
        assertThat(calculator.subtract()).isEqualTo(expectedDifference);
    }
}
```

:::info

Constructor injection is preferred when you want to initialize objects or perform setup with the parameters.

:::

</TabItem>
<TabItem value="field" label="Field Injection">

```java title="CalculatorTest.java"
import org.junit.jupiter.params.Parameter;

@ParameterizedClass
@CsvSource({
    "5, 3, 8, 2",
    "10, 4, 14, 6",
    "100, 25, 125, 75"
})
class CalculatorTest {

    @Parameter(0)
    private int a;

    @Parameter(1)
    private int b;

    @Parameter(2)
    private int expectedSum;

    @Parameter(3)
    private int expectedDifference;

    @Test
    void testAddition() {
        Calculator calculator = new Calculator(a, b);
        assertThat(calculator.add()).isEqualTo(expectedSum);
    }

    @Test
    void testSubtraction() {
        Calculator calculator = new Calculator(a, b);
        assertThat(calculator.subtract()).isEqualTo(expectedDifference);
    }
}
```

:::info

Field injection with `@Parameter` is useful when you want direct access to individual parameter values in your test methods.

:::

</TabItem>
</Tabs>

### Using @MethodSource with Complex Objects

You can also use `@MethodSource` to provide complex objects directly:

```java title="UserValidatorTest.java"
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.junit.jupiter.params.provider.Arguments.argumentSet;

@ParameterizedClass
@MethodSource("users")
class UserValidatorTest {

    private final User user;
    private final boolean expectedValid;

    UserValidatorTest(User user, boolean expectedValid) {
        this.user = user;
        this.expectedValid = expectedValid;
    }

    static Stream<Arguments> users() {
        return Stream.of(
            argumentSet("valid user", new User("john@example.com", 25), true),
            argumentSet("invalid email", new User("not-an-email", 25), false),
            argumentSet("too young", new User("jane@example.com", 15), false)
        );
    }

    @Test
    void testUserValidation() {
        assertThat(UserValidator.isValid(user)).isEqualTo(expectedValid);
    }

    @Test
    void testUserIsNotNull() {
        assertThat(user).isNotNull();
    }
}
```

:::tip

Use `@MethodSource` when:
- You need to pass complex objects to the test class
- You want to reuse the same parameter provider across multiple test classes
- You need to perform complex setup logic for your test data

:::

### When to use @ParameterizedClass vs @ParameterizedTest

| Feature | @ParameterizedClass | @ParameterizedTest |
|---------|--------------------|--------------------|
| **Scope** | Entire test class | Individual test method |
| **Use case** | Multiple tests on the same object | Single test with different inputs |
| **Test count** | All methods × parameters | 1 method × parameters |
| **Setup** | Once per parameter set | N/A |
| **Best for** | Testing object behavior comprehensively | Testing method logic with various inputs |

:::info

**Choose `@ParameterizedClass` when:**
- You have a suite of related tests that should all run against multiple instances
- You want to test the same object from different angles
- You need to share setup logic across multiple test methods

**Choose `@ParameterizedTest` when:**
- You're testing a single method with different inputs
- Each test is independent and doesn't share state
- You want to parameterize only specific test methods

:::
