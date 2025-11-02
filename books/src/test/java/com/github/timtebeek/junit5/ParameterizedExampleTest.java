package com.github.timtebeek.junit5;

import com.github.timtebeek.books.Book;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Refactor these tests to use @ParameterizedClass to parameterize the entire test class. */
class ParameterizedExampleTest {

  @Test
  void bookIsNotNull() {
    Book book = new Book("Effective Java", "Joshua Bloch", 2001);
    assertNotNull(book);
  }

  @Test
  void bookHasTitle() {
    Book book = new Book("Effective Java", "Joshua Bloch", 2001);
    assertEquals("Effective Java", book.getTitle());
  }

  @Test
  void bookHasAuthor() {
    Book book = new Book("Effective Java", "Joshua Bloch", 2001);
    assertEquals("Joshua Bloch", book.getAuthor());
  }

  @Test
  void bookHasYear() {
    Book book = new Book("Effective Java", "Joshua Bloch", 2001);
    assertEquals(2001, book.getYear());
  }

  @Test
  void bookIsClassic() {
    Book book = new Book("Effective Java", "Joshua Bloch", 2001);
    assertTrue(book.getYear() < 2010, "Books published before 2010 are considered classics");
  }

  @Test
  void bookToStringContainsTitle() {
    Book book = new Book("Effective Java", "Joshua Bloch", 2001);
    assertTrue(book.toString().contains("Effective Java"));
  }
}
