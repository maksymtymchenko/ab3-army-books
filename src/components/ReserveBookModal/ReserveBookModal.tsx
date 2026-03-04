import { useEffect, useRef, useCallback, useState } from 'react';
import type { Book } from 'src/types';
import type { ReservationBookInfo } from 'src/api';
import { Button, Input } from 'src/components/ui';
import { createReservation, ApiError } from 'src/api';
import { cn } from 'src/utils/cn';

export interface ReserveBookModalProps {
  /** Book to reserve. */
  book: Book;
  /** Whether the modal is open. */
  open: boolean;
  /** Called when the modal should close (X, overlay, Escape). */
  onClose: () => void;
  /** Called when reservation was created successfully (optional). Receives updated book status. */
  onSuccess?: (updatedBook: ReservationBookInfo) => void;
  /** Optional custom submit handler; if not provided, uses API createReservation. */
  onSubmit?: (data: ReserveFormData) => void;
}

export interface ReserveFormData {
  fullName: string;
  phone: string;
  subdivision: string;
  comment: string;
}

/**
 * Modal for reserving a book: left panel with book info, right panel with form.
 * Matches Figma design (Трохи часу для себе, form fields, Забронювати).
 */
export function ReserveBookModal({
  book,
  open,
  onClose,
  onSuccess,
  onSubmit,
}: ReserveBookModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data: ReserveFormData = {
      fullName: (form.elements.namedItem('fullName') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      subdivision: (form.elements.namedItem('subdivision') as HTMLInputElement).value,
      comment: (form.elements.namedItem('comment') as HTMLTextAreaElement).value,
    };
    if (onSubmit) {
      onSubmit(data);
      onClose();
      return;
    }
    setSubmitting(true);
    try {
      const response = await createReservation({
        bookId: book.id,
        fullName: data.fullName,
        phone: data.phone,
        subdivision: data.subdivision,
        comment: data.comment || undefined,
      });
      onSuccess?.(response.book);
      onClose();
    } catch (err) {
      const msg =
        err instanceof ApiError && err.body?.fields
          ? Object.entries(err.body.fields)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ')
          : err instanceof ApiError
            ? err.body?.message ?? err.message
            : (err as Error)?.message ?? 'Помилка бронювання';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reserve-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'relative flex flex-col md:flex-row w-full max-w-2xl rounded-figma overflow-hidden bg-white shadow-card-hover',
          'max-h-[90vh] md:max-h-[85vh]'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close: absolute so always visible on mobile */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 flex items-center justify-center w-10 h-10 rounded-full text-orange hover:bg-orange-light transition-colors bg-white/90 sm:bg-transparent font-futura"
          aria-label="Закрити"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Left: book info on beige — horizontal on mobile, vertical on md+ */}
        <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-5 bg-orange-light shrink-0 md:w-[220px] lg:w-[260px]">
          <div className="w-[72px] h-[118px] sm:w-[100px] sm:h-[164px] md:w-[120px] md:h-auto rounded-md overflow-hidden bg-gray-light shadow-card shrink-0">
            <img
              src={book.coverUrl}
              alt={`Обкладинка книги ${book.title}`}
              className="w-full h-full md:h-auto md:aspect-[152/250] object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="text-center min-w-0 flex-1 md:flex-none">
            <h2 className="m-0 text-sm sm:text-figma-20 font-bold text-black leading-tight line-clamp-3">
              {book.title}
            </h2>
            <p className="m-0 mt-1 text-sm sm:text-figma-16 text-gray-dark truncate">
              {book.author}
            </p>
          </div>
        </div>

        {/* Right: form — scrollable when content overflows */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0 p-4 md:p-5 pb-6 pt-2 overflow-y-auto">
          <h3
            id="reserve-modal-title"
            className="m-0 mb-1 text-[20px] md:text-figma-26 font-bold text-black font-display"
          >
            Трохи часу для себе
          </h3>
          <p className="m-0 mb-4 text-sm sm:text-figma-16 text-gray-dark">
            Заповніть форму, щоб забронювати книгу
          </p>
          {error && (
            <p className="m-0 mb-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              name="fullName"
              placeholder="ПІБ (Псевдо)"
              required
              className="rounded-[30px] border border-gray-dark py-3 px-6 placeholder:text-gray-dark"
              autoComplete="name"
            />
            <Input
              name="phone"
              type="tel"
              placeholder="Телефон (на якому є What's up/Signal)"
              required
              className="rounded-[30px] border border-gray-dark py-3 px-6 placeholder:text-gray-dark"
              autoComplete="tel"
            />
            <Input
              name="subdivision"
              placeholder="Підрозділ"
              required
              className="rounded-[30px] border border-gray-dark py-3 px-6 placeholder:text-gray-dark"
            />
            <textarea
              name="comment"
              placeholder="Коментар (не обов'язково до заповнення)"
              rows={3}
              className="w-full rounded-[30px] border border-gray-dark py-3 px-6 text-sm sm:text-figma-20 text-black placeholder:text-gray-dark outline-none resize-none min-h-[80px]"
              autoComplete="off"
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-1"
              disabled={submitting}
            >
              {submitting ? 'Відправка…' : 'Забронювати'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
