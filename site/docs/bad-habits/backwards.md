---
sidebar_position: 5
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Backwards

In both JUnit 4 and JUnit 5, `assertEquals(expected, actual)` expects the expected value first and the actual value second.
However, the optional _message_ parameter moved from the first position in JUnit 4 to the last in JUnit 5.
This subtle change, combined with the common mistake of putting actual before expected, leads to confusing failure messages and even silently passing tests.

## Confusing failure messages
This can lead to confusing error messages when tests fail, as the expected and actual values will be reported incorrectly.

<Tabs>
<TabItem value="before" label="Before">

```java title="ArgumentOrderTest.java"
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ArgumentOrderTest {

    List<String> list = List.of("a", "b", "c");

    @Test
    void confusingFailureMessage() {
        assertEquals(list.size(), 4);
    }
}
```

:::warning

Warning: The arguments to `assertEquals` are in the wrong order. The expected value should be the first argument, and the actual value should be the second argument: `assertEquals(4, list.size())`.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="ArgumentOrderTest.java"
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ArgumentOrderTest {

    List<String> list = List.of("a", "b", "c");

    @Test
    void confusingFailureMessage() {
        assertThat(list).hasSize(4);
    }
}
```

:::tip

Using AssertJ's fluent assertions can help avoid issues with argument order, as the actual value is always the subject of the assertion.

:::

</TabItem>
</Tabs>


## Incorrectly passing tests
Worse still, if the values are of the same type, tests may pass when they should fail, or vice versa.

<Tabs>
<TabItem value="before" label="Before">

```java title="ArgumentOrderTest.java"
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class ArgumentOrderTest {
    @Test
    void incorrectlyPassing() {
        String actual = null;
        assertNotNull("message", actual);
    }
}
```

:::danger

The arguments to `assertNotNull` are in the wrong order. This test will incorrectly pass because the string "message" is not null.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="ArgumentOrderTest.java"
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ArgumentOrderTest {
    @Test
    void incorrectlyPassing() {
        String actual = null;
        assertThat(actual).as("message").isNotNull();
    }
}
```

:::tip

The message is now correctly associated with the assertion, and the test will fail as expected.

:::

</TabItem>
</Tabs>
