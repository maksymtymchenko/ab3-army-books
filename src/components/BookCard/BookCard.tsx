import { Link } from 'react-router-dom';
import type { Book, BookStatus } from 'src/types';
import { Button } from 'src/components/ui';
import { cn } from 'src/utils/cn';

const statusConfig: Record<
  BookStatus,
  { label: string; className: string }
> = {
  in_stock: { label: 'В наявності', className: 'bg-green' },
  reserved: { label: 'Заброньована', className: 'bg-yellow' },
  issued: { label: 'Видано', className: 'bg-[#828A8E]' },
};

export interface BookCardProps {
  book: Book;
  /** Show reserve button (e.g. only when in_stock). */
  showReserveButton?: boolean;
  /** Section id for breadcrumb back link (e.g. "recommended", "new"). */
  sectionId?: string;
  /** Section title for breadcrumb (e.g. "Новинки", "Рекомендовано до прочитання"). */
  sectionTitle?: string;
}

/**
 * Single book card: cover, status badge, title, author, optional reserve button.
 */
export function BookCard({
  book,
  showReserveButton,
  sectionId,
  sectionTitle,
}: BookCardProps) {
  const status = statusConfig[book.status];
  const isInStock = book.status === 'in_stock';
  const hasReserveButton = showReserveButton && isInStock;
  const linkState =
    sectionId != null && sectionTitle != null
      ? { sectionId, sectionTitle }
      : undefined;

  return (
    <article
      className={cn(
        'flex flex-col items-center justify-start flex-shrink-0 w-full sm:w-[260px] rounded-t-[16px] bg-white shadow-card transition-[box-shadow] duration-200 snap-start',
        isInStock && 'group hover:shadow-card-hover'
      )}
    >
      <Link
        to={`/book/${book.id}`}
        state={linkState}
        className="contents"
        aria-label={`Перейти до книги ${book.title}`}
      >
        <div className="flex w-full justify-start px-4 pt-4 pb-3">
        <span
          className={cn(
            'inline-flex items-center justify-center px-3 py-0.5 sm:px-4 sm:py-1 rounded-full text-xs sm:text-figma-16 font-semibold text-white',
            status.className
          )}
        >
          {status.label}
        </span>
      </div>

      <div className={cn('flex justify-center mb-4', isInStock && 'transition-all duration-200 ease-out')}>
        <div
          className={cn(
            'h-[250px] w-[152px] rounded-md overflow-hidden bg-gray-light',
            isInStock && 'transition-[width,height] duration-200 ease-out group-hover:h-[230px] group-hover:w-[142px]'
          )}
        >
          <img
            src={book.coverUrl}
            alt={`Обкладинка книги ${book.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div
        className={cn(
          'w-full px-6 transition-all duration-200',
          hasReserveButton ? 'pb-6' : 'pb-0'
        )}
      >
        <h3 className="m-0 mb-1 text-base sm:text-figma-20 font-bold text-[#001527] leading-snug line-clamp-2">
          {book.title}
        </h3>
        <p
          className={cn(
            'm-0 text-sm sm:text-figma-20 text-[#828A8E] leading-snug',
            hasReserveButton ? 'mb-2' : 'mb-0'
          )}
        >
          {book.author}
        </p>
        {hasReserveButton && (
          <Button
            variant="primary"
            fullWidth
            className={cn(
              'mt-4 w-full transition-opacity duration-200',
              // Visible by default on touch devices (no hover). On hover-capable devices, show only on card hover.
              'opacity-100 pointer-events-auto',
              '[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:pointer-events-none',
              '[@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:pointer-events-auto'
            )}
          >
            Забронювати
          </Button>
        )}
      </div>
      </Link>
    </article>
  );
}
