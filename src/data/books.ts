import type { Book } from 'src/types';
import book1 from 'src/assets/books/book_1.png';
import book2 from 'src/assets/books/book_2.png';
import book3 from 'src/assets/books/book_3.png';
import book4 from 'src/assets/books/book_4.png';

/**
 * Recommended books section data (expanded for testing carousel + statuses).
 */
export const recommendedBooks: Book[] = [
  {
    id: '1',
    title: 'В сталевих грозах',
    author: 'Ернст Юнгер',
    coverUrl: book1,
    status: 'in_stock',
    description:
      'Фронт Першої світової очима офіцера штурмовиків: страх, бойовий азарт і дисципліна під вогнем. Книга, що змінює уявлення про війну назавжди.',
  },
  { id: '2', title: 'Сповідь провокатора', author: 'Олексій Середюк', coverUrl: book2, status: 'in_stock' },
  { id: '3', title: 'Ода вождизму', author: 'Євген Коновалець', coverUrl: book3, status: 'issued' },
  { id: '4', title: 'Власним руслом', author: 'Зиновій Книш', coverUrl: book4, status: 'in_stock' },
  { id: '1b', title: 'Книга для тесту 5', author: 'Автор A', coverUrl: book1, status: 'in_stock' },
  { id: '2b', title: 'Книга для тесту 6', author: 'Автор B', coverUrl: book2, status: 'reserved' },
  { id: '3b', title: 'Книга для тесту 7', author: 'Автор C', coverUrl: book3, status: 'in_stock' },
  { id: '4b', title: 'Книга для тесту 8', author: 'Автор D', coverUrl: book4, status: 'issued' },
];

/**
 * New arrivals section data (expanded for testing).
 */
export const newArrivalsBooks: Book[] = [
  { id: '5', title: 'Нова книга 1', author: 'Автор 1', coverUrl: book1, status: 'in_stock' },
  { id: '6', title: 'Нова книга 2', author: 'Автор 2', coverUrl: book2, status: 'in_stock' },
  { id: '7', title: 'Нова книга 3', author: 'Автор 3', coverUrl: book3, status: 'reserved' },
  { id: '8', title: 'Нова книга 4', author: 'Автор 4', coverUrl: book4, status: 'in_stock' },
  { id: '9n', title: 'Нова книга 5', author: 'Автор 5', coverUrl: book1, status: 'issued' },
  { id: '10n', title: 'Нова книга 6', author: 'Автор 6', coverUrl: book2, status: 'in_stock' },
];

/**
 * Commander recommends section data (expanded for testing).
 */
export const commanderRecommendsBooks: Book[] = [
  { id: '9', title: 'Рекомендація 1', author: 'Автор 1', coverUrl: book1, status: 'in_stock' },
  { id: '10', title: 'Рекомендація 2', author: 'Автор 2', coverUrl: book2, status: 'issued' },
  { id: '11', title: 'Рекомендація 3', author: 'Автор 3', coverUrl: book3, status: 'in_stock' },
  { id: '12', title: 'Рекомендація 4', author: 'Автор 4', coverUrl: book4, status: 'in_stock' },
  { id: '13c', title: 'Рекомендація 5', author: 'Автор 5', coverUrl: book1, status: 'reserved' },
  { id: '14c', title: 'Рекомендація 6', author: 'Автор 6', coverUrl: book2, status: 'in_stock' },
];

const allBooks: Book[] = [
  ...recommendedBooks,
  ...newArrivalsBooks,
  ...commanderRecommendsBooks,
];

/** All books for the catalog page (new arrivals / full catalog). */
export const catalogBooks: Book[] = allBooks;

/**
 * Get a book by id from any section (recommended, new arrivals, commander recommends).
 */
export function getBookById(id: string): Book | undefined {
  return allBooks.find((b) => b.id === id);
}

/**
 * Search books by title or author (case-insensitive).
 */
export function searchBooks(query: string): Book[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  );
}
