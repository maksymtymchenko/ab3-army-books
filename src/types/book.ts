/**
 * Book entity as used across the app (cards, sections, API).
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  status: BookStatus;
  /** Optional description for the book detail page. */
  description?: string;
}

/**
 * Book availability/loan status for badges.
 */
export type BookStatus = 'in_stock' | 'reserved' | 'issued';
