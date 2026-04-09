---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Chained and combined assertions

AssertJ's fluent API lets you chain multiple assertions on the same object, and combine checks for multiple elements into a single statement. This makes tests more concise, more readable, and produces better failure messages.

## Chain assertions on the same object

Having many separate `assertThat()` calls on the same object decreases readability. Chain them instead.

<Tabs>
<TabItem value="before" label="Before">

```java title="ChainedAssertJTest.java"
import java.util.List;

class ChainedAssertJTest {

    @Test
    void bundle() {
        List<Book> books = new Bundle().getBooks();

        assertThat(books).isNotNull();
        assertThat(books.size()).isEqualTo(3);
        assertThat(books).contains(new Book("Effective Java", "Joshua Bloch", 2001));
        assertThat(books).contains(new Book("Java Concurrency in Practice", "Brian Goetz", 2006));
        assertThat(books).contains(new Book("Clean Code", "Robert C. Martin", 2008));
        assertThat(books).doesNotContain(new Book("Java 8 in Action", "Raoul-Gabriel Urma", 2014));
    }
}
```

:::warning

The long list of separate assertions makes the test longer and harder to read.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="ChainedAssertJTest.java"
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ChainedAssertJTest {

    @Test
    void bundle() {
        List<Book> books = new Bundle().getBooks();

        assertThat(books)
                .hasSize(3)
                .contains(
                        new Book("Effective Java", "Joshua Bloch", 2001),
                        new Book("Java Concurrency in Practice", "Brian Goetz", 2006),
                        new Book("Clean Code", "Robert C. Martin", 2008))
                .doesNotContain(new Book("Java 8 in Action", "Raoul-Gabriel Urma", 2014));

        // Or even shorter:
        assertThat(books)
                .containsExactly(
                        new Book("Effective Java", "Joshua Bloch", 2001),
                        new Book("Java Concurrency in Practice", "Brian Goetz", 2006),
                        new Book("Clean Code", "Robert C. Martin", 2008));
    }
}
```

:::tip

Using chained assertions makes the test more fluent and easier to read.

:::

</TabItem>
</Tabs>

## Combine checks for multiple elements

When checking for multiple elements, pass them all to a single assertion instead of repeating `assertTrue()`.

<Tabs>
<TabItem value="before" label="Before">

```java title="AssertListContains.java"
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

class AssertListContains {

    List<String> list = List.of("a", "b", "c");

    @Test
    void assertMultipleElements() {
        assertTrue(list.contains("a"));
        assertTrue(list.contains("b"));
        assertTrue(list.contains("c"));
    }
}
```

:::warning

Multiple `assertTrue()` calls are verbose and stop at the first failure, hiding subsequent issues.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="AssertListContains.java"
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class AssertListContains {

    List<String> list = List.of("a", "b", "c");

    @Test
    void assertMultipleElements() {
        assertThat(list).contains("a", "b", "c");
    }
}
```

:::tip

AssertJ allows checking for multiple elements in a single assertion, making the test more concise and showing all missing elements in case of failure.

:::

</TabItem>
</Tabs>
