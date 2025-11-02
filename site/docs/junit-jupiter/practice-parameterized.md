---
sidebar_position: 6
---

# Practice: Parameterized Class

Ready to practice using JUnit 6's `@ParameterizedClass` to parameterize entire test classes? We've prepared a test class
that demonstrates when this powerful feature is useful.

## Exercise: ParameterizedExampleTest

Navigate to `books/src/test/java/com/github/timtebeek/junit5/ParameterizedExampleTest.java`.

This test class demonstrates a scenario where you have multiple test methods that all operate on the same object
instance. Currently, the `Book` instance is created repeatedly in every test method with the same values.

### What you'll find

- ❌ **Repeated object creation**: Every test method creates the same `Book("Effective Java", "Joshua Bloch", 2001)`
- ❌ **Hard to test multiple scenarios**: To test different books, you'd need to duplicate the entire test class
- ❌ **Lack of reusability**: The test logic is good, but tied to a single book instance

### Your task

Refactor the test class to use `@ParameterizedClass` to parameterize the entire class, allowing all test methods to run
against multiple `Book` instances.

**Hints:**

- `@ParameterizedClass` is a JUnit 6 feature that parameterizes an entire test class, not just individual methods
- You can inject parameters via constructor injection or field injection using `@Parameter`
- Use `@CsvSource` or `@MethodSource` at the class level to provide the parameter sets
- All `@Test` methods in the class will run once for each parameter set
- This is perfect when you have a suite of tests that should run against multiple instances of the same type

### Running the test

You can run the test in your IDE or use the following commands:

```bash
# Run the test
mvn test -pl books -Dtest=ParameterizedExampleTest

# Or run all tests in the books module
mvn test -pl books
```

## Solution

<details>
<summary>Click to see the refactored tests</summary>

### Using Constructor Injection

```java title="ParameterizedExampleTest.java"
package com.github.timtebeek.junit5;

import com.github.timtebeek.books.Book;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedClass;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class demonstrating JUnit 6's @ParameterizedClass with constructor injection.
 * The entire test class is parameterized, and all test methods run for each parameter set.
 */
@ParameterizedClass
@CsvSource({
        "Effective Java, Joshua Bloch, 2001",
        "Java Concurrency in Practice, Brian Goetz, 2006",
        "Clean Code, Robert C. Martin, 2008"
})
class ParameterizedExampleTest {

    private final Book book;

    // Constructor injection: parameters are injected via the constructor
    ParameterizedExampleTest(String title, String author, int year) {
        this.book = new Book(title, author, year);
    }

    @Test
    void bookIsNotNull() {
        assertThat(book).isNotNull();
    }

    @Test
    void bookHasTitle() {
        assertThat(book.getTitle()).isNotBlank();
    }

    @Test
    void bookHasAuthor() {
        assertThat(book.getAuthor()).isNotBlank();
    }

    @Test
    void bookHasYear() {
        assertThat(book.getYear()).isPositive();
    }

    @Test
    void bookIsClassic() {
        assertThat(book.getYear())
                .as("Books published before 2010 are considered classics")
                .isLessThan(2010);
    }

    @Test
    void bookToStringContainsTitle() {
        assertThat(book.toString()).contains(book.getTitle());
    }
}
```

### Alternative: Using Field Injection

```java title="ParameterizedExampleTest.java"
package com.github.timtebeek.junit5;

import com.github.timtebeek.books.Book;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.Parameter;
import org.junit.jupiter.params.ParameterizedClass;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class demonstrating JUnit 6's @ParameterizedClass with field injection.
 * Parameters are injected directly into fields annotated with @Parameter.
 */
@ParameterizedClass
@CsvSource({
        "Effective Java, Joshua Bloch, 2001",
        "Java Concurrency in Practice, Brian Goetz, 2006",
        "Clean Code, Robert C. Martin, 2008"
})
class ParameterizedExampleTest {

    @Parameter(0)
    private String title;

    @Parameter(1)
    private String author;

    @Parameter(2)
    private int year;

    @Test
    void bookIsNotNull() {
        Book book = new Book(title, author, year);
        assertThat(book).isNotNull();
    }

    @Test
    void bookHasTitle() {
        Book book = new Book(title, author, year);
        assertThat(book.getTitle()).isEqualTo(title);
    }

    @Test
    void bookHasAuthor() {
        Book book = new Book(title, author, year);
        assertThat(book.getAuthor()).isEqualTo(author);
    }

    @Test
    void bookHasYear() {
        Book book = new Book(title, author, year);
        assertThat(book.getYear()).isEqualTo(year);
    }

    @Test
    void bookIsClassic() {
        Book book = new Book(title, author, year);
        assertThat(year)
                .as("Books published before 2010 are considered classics")
                .isLessThan(2010);
    }

    @Test
    void bookToStringContainsTitle() {
        Book book = new Book(title, author, year);
        assertThat(book.toString()).contains(title);
    }
}
```

### Using @MethodSource for Complex Objects

```java title="ParameterizedExampleTest.java"
package com.github.timtebeek.junit5;

import com.github.timtebeek.books.Book;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedClass;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.argumentSet;

/**
 * Test class demonstrating JUnit 6's @ParameterizedClass with @MethodSource.
 * This allows you to pass complex objects directly to the test class.
 */
@ParameterizedClass
@MethodSource("books")
class ParameterizedExampleTest {

    private final Book book;

    // Constructor injection with a Book object
    ParameterizedExampleTest(Book book) {
        this.book = book;
    }

    static Stream<Arguments> books() {
        return Stream.of(
                argumentSet("Effective Java", new Book("Effective Java", "Joshua Bloch", 2001)),
                argumentSet("Java Concurrency", new Book("Java Concurrency in Practice", "Brian Goetz", 2006)),
                argumentSet("Clean Code", new Book("Clean Code", "Robert C. Martin", 2008))
        );
    }

    @Test
    void bookIsNotNull() {
        assertThat(book).isNotNull();
    }

    @Test
    void bookHasTitle() {
        assertThat(book.getTitle()).isNotBlank();
    }

    @Test
    void bookHasAuthor() {
        assertThat(book.getAuthor()).isNotBlank();
    }

    @Test
    void bookHasYear() {
        assertThat(book.getYear()).isPositive();
    }

    @Test
    void bookIsClassic() {
        assertThat(book.getYear())
                .as("Books published before 2010 are considered classics")
                .isLessThan(2010);
    }

    @Test
    void bookToStringContainsTitle() {
        assertThat(book.toString()).contains(book.getTitle());
    }
}
```

</details>

### Benefits of @ParameterizedClass

After refactoring to use `@ParameterizedClass`, you'll notice:

- **No duplication**: The same `Book` instance is used across all test methods
- **Scalable testing**: All 6 test methods run for each of the 3 books = 18 test executions total
- **Easy to extend**: Adding a new book to test is just adding one line to the `@CsvSource` or `@MethodSource`
- **Better organization**: Related tests stay together in one class
- **Clear test output**: Each invocation is clearly labeled with the parameter values
