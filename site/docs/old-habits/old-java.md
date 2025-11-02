---
sidebar_position: 5
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Old Java versions

Java 13 introduced text blocks (multi-line strings) as a preview feature, finalized in Java 15.
They make working with multi-line strings much more readable, but traditional string concatenation is still commonly found in older tests.

## String concatenation

Traditional string concatenation with `+` operators for multi-line strings is hard to read and maintain.
Each line needs explicit `\n` newline characters and quote escaping.

<Tabs>
<TabItem value="before" label="Before">

```java title="TextBlockTest.java"
import com.github.timtebeek.books.Bundle;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TextBlockTest {
    @Test
    void summary() {
        String summary = new Bundle().summary();
        assertEquals("Books:\n" +
                        "Effective Java by Joshua Bloch (2001)\n" +
                        "Java Concurrency in Practice by Brian Goetz (2006)\n" +
                        "Clean Code by Robert C. Martin (2008)\n" +
                        "Authors:\n" +
                        "Joshua Bloch\n" +
                        "Brian Goetz\n" +
                        "Robert C. Martin\n" +
                        "Total books: 3\n" +
                        "Total authors: 3\n",
                summary);
    }
}
```

:::warning

String concatenation with `+` is verbose and error-prone. Missing newlines, extra spaces, and quote escaping make it hard to see the actual content.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="TextBlockTest.java"
import com.github.timtebeek.books.Bundle;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TextBlockTest {
    @Test
    void summary() {
        String summary = new Bundle().summary();
        assertEquals("""
                Books:
                Effective Java by Joshua Bloch (2001)
                Java Concurrency in Practice by Brian Goetz (2006)
                Clean Code by Robert C. Martin (2008)
                Authors:
                Joshua Bloch
                Brian Goetz
                Robert C. Martin
                Total books: 3
                Total authors: 3
                """,
                summary);
    }
}
```

:::tip

Text blocks make multi-line strings much more readable. The content is exactly as it appears, without escape sequences or concatenation operators.

:::

</TabItem>
</Tabs>

## Even better with AssertJ

While text blocks improve readability, AssertJ can make multi-line string comparisons even clearer with better diff output.

<Tabs>
<TabItem value="before" label="Before">

```java title="TextBlockTest.java"
import com.github.timtebeek.books.Bundle;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TextBlockTest {
    @Test
    void summary() {
        String summary = new Bundle().summary();
        assertEquals("""
                Books:
                Effective Java by Joshua Bloch (2001)
                Java Concurrency in Practice by Brian Goetz (2006)
                Clean Code by Robert C. Martin (2008)
                Authors:
                Joshua Bloch
                Brian Goetz
                Robert C. Martin
                Total books: 3
                Total authors: 3
                """,
                summary);
    }
}
```

:::info

JUnit's `assertEquals()` works with text blocks, but the diff output for multi-line strings can be hard to read when tests fail.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="TextBlockTest.java"
import com.github.timtebeek.books.Bundle;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TextBlockTest {
    @Test
    void summary() {
        String summary = new Bundle().summary();
        assertThat(summary).isEqualToIgnoringWhitespace("""
                Books:
                Effective Java by Joshua Bloch (2001)
                Java Concurrency in Practice by Brian Goetz (2006)
                Clean Code by Robert C. Martin (2008)
                Authors:
                Joshua Bloch
                Brian Goetz
                Robert C. Martin
                Total books: 3
                Total authors: 3
                """);
    }
}
```

:::tip

AssertJ provides better diff output for multi-line strings and offers flexible comparison methods like `isEqualToIgnoringWhitespace()` for when exact whitespace doesn't matter.

:::

</TabItem>
</Tabs>

## SequencedCollection

Java 21 introduced `SequencedCollection`, `SequencedSet`, and `SequencedMap` interfaces that provide uniform access to first and last elements.
Before Java 21, accessing the last element required verbose index calculations. AssertJ 3.25.0+ provides dedicated assertions for these collections.

<Tabs>
<TabItem value="before" label="Before">

```java title="SequencedCollectionTest.java"
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SequencedCollectionTest {
    @Test
    void lastElement() {
        List<String> authors = List.of(
                "Joshua Bloch",
                "Brian Goetz",
                "Robert C. Martin"
        );
        assertThat(authors.get(authors.size() - 1)).isEqualTo("Robert C. Martin");
    }
}
```

:::warning

Accessing the last element with `get(size() - 1)` is verbose and requires mental overhead to understand the intent. It's also prone to off-by-one errors.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="SequencedCollectionTest.java"
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SequencedCollectionTest {
    @Test
    void lastElement() {
        List<String> authors = List.of(
                "Joshua Bloch",
                "Brian Goetz",
                "Robert C. Martin"
        );
        assertThat(authors).last().isEqualTo("Robert C. Martin");
    }
}
```

:::tip

AssertJ's `last()` method is clear and expressive. It works with any `SequencedCollection` (including `List`, `Deque`, `LinkedHashSet`) and provides better failure messages. There's also a `first()` method for accessing the first element.

:::

</TabItem>
</Tabs>

## Adopting Java 21+ features in your tests

You can use OpenRewrite to automatically migrate your tests to use Java 21 features like text blocks and `SequencedCollection` assertions.
See [Java 21 for tests](../upgrade-your-projects/java-21-for-tests.md) guide for detailed instructions on setting this up in your project.
