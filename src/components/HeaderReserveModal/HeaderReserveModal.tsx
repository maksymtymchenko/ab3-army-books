import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from 'src/types';
import { Button, Input } from 'src/components/ui';
import { searchBooks } from 'src/data/books';
import { cn } from 'src/utils/cn';

/** Orange magnifying glass icon for the search field. */
function SearchIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0 text-orange"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

export interface BookResultItemProps {
  book: Book;
  onClose: () => void;
}

/** Single book row in search results: cover, title, author. */
function BookResultItem({ book, onClose }: BookResultItemProps) {
  return (
    <Link
      to={`/book/${book.id}`}
      onClick={onClose}
      className="flex items-center gap-3 py-3 no-underline text-black hover:bg-orange-light/30 transition-colors"
    >
      <div className="w-12 h-[79px] shrink-0 rounded-md overflow-hidden bg-gray-light">
        <img
          src={book.coverUrl}
          alt={`Обкладинка: ${book.title}`}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm sm:text-figma-16 font-bold text-black leading-tight truncate">
          {book.title}
        </p>
        <p className="m-0 mt-0.5 text-sm sm:text-figma-16 text-gray-dark leading-tight truncate">
          {book.author}
        </p>
      </div>
    </Link>
  );
}

export interface HeaderReserveModalProps {
  /** Whether the modal is open. */
  open: boolean;
  /** Called when the modal should close (X, overlay, Escape). */
  onClose: () => void;
  /** Called when user clicks Забронювати with results; pass the book to open reserve form for. */
  onReserveBook?: (book: Book) => void;
  /** Initial search query when opened from header search (e.g. user pressed Enter in header). */
  initialSearchQuery?: string;
}

/**
 * Modal shown when user clicks "Забронювати" in the header.
 * Title, description, search input, and CTA. Matches Figma (Книга, що чекає саме на вас).
 */
export function HeaderReserveModal({
  open,
  onClose,
  onReserveBook,
  initialSearchQuery = '',
}: HeaderReserveModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    if (open) setSearchQuery(initialSearchQuery);
  }, [open, initialSearchQuery]);

  const searchResults = useMemo(
    () => searchBooks(searchQuery),
    [searchQuery]
  );
  const hasResults = searchResults.length > 0;

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
      previousActiveRef.current?.focus?.();
    };
  }, [open, handleEscape]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasResults && searchResults[0]) {
      onReserveBook?.(searchResults[0]);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="header-reserve-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'w-full max-w-md rounded-figma overflow-hidden bg-white shadow-card-hover',
          'p-4 md:p-6 pb-6'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-1">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full text-orange hover:bg-orange-light transition-colors"
            aria-label="Закрити"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="w-full text-center">
          <h2
            id="header-reserve-modal-title"
            className="m-0 mb-2 text-[20px] md:text-figma-26 font-bold text-black font-['UAF_Sans',sans-serif]"
          >
            Книга, що чекає саме на вас
          </h2>
          <p className="m-0 mb-5 text-sm sm:text-figma-16 text-black leading-relaxed">
            Оберіть книгу та залиште заявку — ми подбаємо, щоб вона була готова для вас
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-[50px]">
          <Input
            type="search"
            placeholder="Пошук"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<SearchIcon />}
            className="border-0 p-0"
            wrapperClassName="flex items-center gap-3 flex-1 h-[52px] px-5 py-3 bg-white border border-gray-dark rounded-[30px] text-gray-dark mb-2"
            aria-label="Пошук книг"
          />
          {hasResults && (
            <ul className="list-none m-0 p-0 mt-1 flex flex-col border-t border-gray-light max-h-[240px] overflow-y-auto">
              {searchResults.map((book) => (
                <li key={book.id} className="border-b border-gray-light last:border-b-0">
                  <BookResultItem book={book} onClose={onClose} />
                </li>
              ))}
            </ul>
          )}
          <div className="w-full flex justify-center">
            <Button
              type="submit"
              variant="primary"
              disabled={!hasResults}
              className={cn(
                'w-full min-w-0 md:w-auto shrink-0',
                !hasResults && 'disabled:bg-gray-dark disabled:opacity-100'
              )}
            >
              Забронювати
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
