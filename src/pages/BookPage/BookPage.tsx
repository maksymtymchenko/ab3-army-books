import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import type { BookStatus, Book } from 'src/types';
import type { ReservationBookInfo } from 'src/api';
import { Container } from 'src/layout/Container';
import { Button } from 'src/components/ui';
import { ReserveBookModal } from 'src/components/ReserveBookModal';
import { getBook, ApiError } from 'src/api';
import { cn } from 'src/utils/cn';

const statusConfig: Record<BookStatus, { label: string; className: string }> = {
  in_stock: { label: 'В наявності', className: 'bg-green' },
  reserved: { label: 'Заброньована', className: 'bg-yellow' },
  issued: { label: 'Видано', className: 'bg-[#828A8E]' },
};

/** Default breadcrumb when user opens book page directly (no navigation state). */
const DEFAULT_SECTION = { sectionId: 'new', sectionTitle: 'Новинки' };

export interface BookPageState {
  sectionId?: string;
  sectionTitle?: string;
}

/**
 * Book detail page: breadcrumbs, cover, availability, title, author, description, reserve CTA.
 * Breadcrumb middle segment reflects the section the user came from (Рекомендовано, Новинки, Командир рекомендує).
 */
export function BookPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as BookPageState | null | undefined;
  const section =
    state?.sectionId != null && state?.sectionTitle != null
      ? { sectionId: state.sectionId, sectionTitle: state.sectionTitle }
      : DEFAULT_SECTION;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);

  const handleReservationSuccess = (updatedBook: ReservationBookInfo) => {
    setBook((prev) => {
      if (!prev || prev.id !== updatedBook.id) return prev;
      return { ...prev, status: updatedBook.status };
    });
  };

  useEffect(() => {
    if (!id) {
      setBook(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getBook(id)
      .then((data) => {
        if (!cancelled) setBook(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setBook(null);
          setError(err instanceof ApiError && err.status === 404 ? 'Книгу не знайдено.' : err?.message ?? 'Помилка завантаження');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <div className="py-18 bg-white">
        <Container>
          <p className="text-sm sm:text-figma-20 text-gray-dark">Книгу не знайдено.</p>
          <Link to="/" className="text-orange underline mt-4 inline-block">
            На головну
          </Link>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-18 bg-white">
        <Container>
          <p className="text-sm sm:text-figma-20 text-gray-dark">Завантаження…</p>
        </Container>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="py-18 bg-white">
        <Container>
          <p className="text-sm sm:text-figma-20 text-gray-dark">{error ?? 'Книгу не знайдено.'}</p>
          <Link to="/" className="text-orange underline mt-4 inline-block">
            На головну
          </Link>
        </Container>
      </div>
    );
  }

  const status = statusConfig[book.status];
  const isInStock = book.status === 'in_stock';

  return (
    <div className="py-4 sm:py-6 pb-8 sm:pb-10 bg-white min-h-[60vh]">
      <Container>
        {/* Breadcrumbs */}
        <nav aria-label="Хлібні крихти" className="mb-4 sm:mb-6">
          <ol className="list-none m-0 p-0 flex flex-wrap items-center gap-1 text-sm sm:text-figma-20 font-futura">
            <li>
              <Link
                to="/"
                className="text-gray-dark no-underline hover:text-black transition-colors"
              >
                Головна
              </Link>
            </li>
            <li className="text-gray-dark" aria-hidden>
              /
            </li>
            <li>
              <Link
                to={{ pathname: '/', hash: section.sectionId }}
                className="text-gray-dark no-underline hover:text-black transition-colors"
              >
                {section.sectionTitle}
              </Link>
            </li>
            <li className="text-gray-dark" aria-hidden>
              /
            </li>
            <li className="text-black font-medium" aria-current="page">
              {book.title}
            </li>
          </ol>
        </nav>

        {/* Two columns: cover | details */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Left: book cover */}
          <div className="w-full md:w-auto flex justify-center md:justify-start shrink-0 md:mr-6">
            <div className="w-[220px] sm:w-[280px] rounded-md overflow-hidden bg-gray-light shadow-card">
              <img
                src={book.coverUrl}
                alt={`Обкладинка книги ${book.title}`}
                className="w-full h-auto object-cover aspect-[152/250] max-h-[400px] object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Right: details */}
          <div className="w-full flex-1 min-w-0 flex flex-col gap-4">
            <span
              className={cn(
                'inline-flex items-center justify-center px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-figma-16 font-semibold text-white w-fit font-futura',
                status.className
              )}
            >
              {status.label}
            </span>
            <h1 className="m-0 text-[20px] sm:text-2xl md:text-figma-32 font-bold text-black font-display leading-tight">
              {book.title}
            </h1>
            <p className="m-0 text-sm sm:text-figma-20 text-gray-dark font-futura">{book.author}</p>
            {book.description && (
              <p className="m-0 text-sm sm:text-figma-20 text-black leading-relaxed max-w-[600px]">
                {book.description}
              </p>
            )}
            <Button
              variant="primary"
              onClick={() => setReserveModalOpen(true)}
              className="mt-2 w-full min-w-0 md:w-auto md:min-w-0 md:self-start"
              disabled={!isInStock}
            >
              Забронювати
            </Button>
          </div>
        </div>
      </Container>
      <ReserveBookModal
        book={book}
        open={reserveModalOpen}
        onClose={() => setReserveModalOpen(false)}
        onSuccess={handleReservationSuccess}
      />
    </div>
  );
}
