---
sidebar_position: 7
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Return actual object

When writing helper methods that perform assertions and return the asserted value, AssertJ provides a convenient way to combine both operations.
The `actual()` method returns the object under test, allowing you to chain assertions and return the value in a single statement.

## From separate assertion and return

Helper methods often assert a condition and then return the same value. This can be simplified using `actual()`.

<Tabs>
<TabItem value="before" label="Before">

```java title="AssertJTest.java"
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AssertJTest {

    @Test
    void returnActualObject() {
        Book hardcover = new Book("Effective Java", "Joshua Bloch", 2001);

        // Sometimes helper methods will do some assertions and return a value
        Book notNull = checkNotNull(hardcover);
    }

    private Book checkNotNull(Book book) {
        // Anti-pattern: a separate assertion before a return of the same object
        assertThat(book).isNotNull();
        return book;
    }
}
```

:::warning

Separate assertion and return statements are verbose and require repeating the variable name.

:::

</TabItem>
<TabItem value="after" label="After">

```java title="AssertJTest.java"
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AssertJTest {

    @Test
    void returnActualObject() {
        Book hardcover = new Book("Effective Java", "Joshua Bloch", 2001);

        // Sometimes helper methods will do some assertions and return a value
        Book notNull = checkNotNull(hardcover);
    }

    private Book checkNotNull(Book book) {
        // Use actual() to return the object after assertion in a single statement
        return assertThat(book).isNotNull().actual();
    }
}
```

:::tip

Using `actual()` combines the assertion and return into a single fluent statement, reducing duplication and improving readability.

:::

</TabItem>
</Tabs>

## When to use actual()

The `actual()` method is particularly useful in:

- **Test helper methods** that validate and return objects
- **Factory methods** in tests that create and verify objects
- **Setup methods** that ensure preconditions are met before returning values

```java title="HelperMethods.java"
private User createValidUser(String name) {
    User user = userService.create(name);
    return assertThat(user)
            .isNotNull()
            .hasFieldOrPropertyWithValue("name", name)
            .actual();
}
```

:::tip

The `actual()` method works with any AssertJ assertion chain, allowing you to perform multiple validations before returning the original object.

:::
