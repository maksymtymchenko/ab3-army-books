import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from 'src/types';
import { BookCard } from 'src/components/BookCard';
import { Container } from 'src/layout/Container';

export interface BookSectionProps {
  title: string;
  seeAllHref: string;
  books: Book[];
  /** Section id for "View all" anchor. */
  id?: string;
  /** Show reserve button on cards (e.g. only in "Recommended"). */
  showReserveButton?: boolean;
}

/**
 * Horizontal book carousel with title, "View all" link and nav arrows.
 */
export function BookSection({
  title,
  seeAllHref,
  books,
  id,
  showReserveButton = false,
}: BookSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, books.length]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>('article');
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const styles = window.getComputedStyle(el);
    const gap =
      parseFloat(styles.columnGap || styles.gap || '0') || 0;

    const step = cardWidth + gap;

    el.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id={id}
      className="py-8 sm:py-10 bg-bg"
      aria-labelledby={`section-${id ?? title}`}
    >
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
          <h2
            id={`section-${id ?? title}`}
            className="m-0 text-[20px] sm:text-2xl md:text-figma-32 font-bold text-black font-display"
          >
            {title}
          </h2>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to={seeAllHref}
              className="inline-block text-sm sm:text-figma-16 md:text-figma-20 text-black no-underline border-b border-transparent hover:border-black transition-colors font-futura"
            >
              Дивитись всі
            </Link>
            <div className="flex gap-[10px] sm:gap-[15px]" role="group" aria-label="Навігація каруселі">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="flex items-center justify-center w-[40px] h-[40px] rounded-full border border-orange bg-white text-orange hover:bg-orange-light transition disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Назад"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="flex items-center justify-center w-[40px] h-[40px] rounded-full border border-orange bg-white text-orange hover:bg-orange-light transition disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Вперед"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="min-w-0 flex gap-4 sm:gap-5 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              showReserveButton={showReserveButton}
              sectionId={id}
              sectionTitle={title}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
