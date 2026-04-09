---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# JUnit 4

JUnit 4 introduced annotations and removed the need to extend `TestCase`, which was a major improvement over JUnit 3.
However, it still has limitations compared to modern frameworks like JUnit 5 and AssertJ.
Tests and classes must still be public, the assertion library is basic, and exception testing is awkward.

## Public visibility required

JUnit 4 requires both test classes and test methods to be public, which adds unnecessary boilerplate.
This restriction was removed in JUnit 5, where package-private visibility is sufficient.

<Tabs>
<TabItem value="before" label="Before">

```java title="JUnitFourTest.java"
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class JUnitFourTest {

    @Test
    public void greeting() {
        String greeting = new Greeter().greet("World");
        assertEquals("Hello, World!", greeting);
    }
}
```

:::warning

JUnit 4 requires test classes and methods to be public, adding unnecessary boilerplate.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="JUnitFourTest.java"
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JUnitFourTest {

    @Test
    void greeting() {
        String greeting = new Greeter().greet("World");
        assertThat(greeting).isEqualTo("Hello, World!");
    }
}
```

:::tip

JUnit 5 allows package-private test classes and methods, reducing boilerplate.

:::

</TabItem>
</Tabs>

For a full comparison of JUnit assertion expressiveness before and after migrating to AssertJ, see [JUnit 3 - Limited expressiveness](junit3.md#limited-expressiveness).

## Backwards argument order

JUnit 4's argument order conventions are inconsistent and error-prone.
For example, `assertNotNull` takes the value first and message second, while `assertEquals` takes message first, then expected, then actual.
This inconsistency carries over when upgrading to JUnit 5 without fixing argument order.

For detailed examples of how backwards argument order leads to confusing failures and silently passing tests, see [Backwards](../bad-habits/backwards.md).

## ExpectedException rule

JUnit 4 introduced the `@Rule ExpectedException` to test for exceptions, which was an improvement over try/catch blocks.
However, it's disconnected from the code that throws the exception and can lead to confusing test logic.
For the even older try/catch with `fail()` pattern, see [Try/Catch fail](../bad-habits/try-catch.md).

<Tabs>
<TabItem value="before" label="Before">

```java title="JUnitFourTest.java"
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class JUnitFourTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void expectException() throws IllegalArgumentException {
        int i = 1 + 2;
        assertEquals(i, 3);
        thrown.expect(IllegalArgumentException.class);
        thrown.expectMessage("boom!");
        boom();
    }

    private void boom() {
        throw new IllegalArgumentException("boom!");
    }
}
```

:::warning

The `ExpectedException` rule is declared at the top but configured in the middle of the test, making it hard to follow.
Any code after the `thrown.expect()` call must throw the exception, or the test will fail in a confusing way.
Any code before the `thrown.expect()` call could throw the expected exception and cause the test to incorrectly pass.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="JUnitFourTest.java"
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JUnitFourTest {

    @Test
    void expectException() {
        int i = 1 + 2;
        assertThat(i).isEqualTo(3);

        assertThatThrownBy(() -> boom())
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("boom!");
    }

    private void boom() {
        throw new IllegalArgumentException("boom!");
    }
}
```

:::tip

AssertJ's `assertThatThrownBy` makes it clear exactly which code is expected to throw an exception, making tests more readable and less error-prone.

:::

</TabItem>
</Tabs>
