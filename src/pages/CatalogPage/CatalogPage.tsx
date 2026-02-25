import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Book, BookStatus } from 'src/types';
import { Container } from 'src/layout/Container';
import { Button } from 'src/components/ui';
import { BookCard } from 'src/components/BookCard/BookCard';
import { getCatalogBooks, getBooksFilters } from 'src/api';
import type { FilterOption } from 'src/api';
import { cn } from 'src/utils/cn';
import filterIcon from 'src/assets/catalog/filter_icon.svg';
import arrowDown from 'src/assets/catalog/arrow_down.svg';

const BOOKS_PER_PAGE = 12;
const SORT_OPTIONS: { value: 'popularity' | 'title'; label: string }[] = [
  { value: 'popularity', label: 'За популярністю' },
  { value: 'title', label: 'За назвою' },
];

/**
 * Sort dropdown matching Figma: pill-shaped, orange sort icon left, label, arrow down right.
 * Uses filter_icon.svg, arrow_down.svg, 20px Futura PT.
 */
function SortDropdown({
  value,
  onChange,
  options,
}: {
  value: 'popularity' | 'title';
  onChange: (value: 'popularity' | 'title') => void;
  options: { value: 'popularity' | 'title'; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = options.find((o) => o.value === value)?.label ?? options[0].label;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex flex-nowrap items-center justify-between gap-3 rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-figma-20 font-futura leading-none text-black shadow-sm border border-gray-light min-w-[180px] sm:min-w-[200px]"
        aria-label="Сортування"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="sort-listbox"
        id="sort-trigger"
      >
        <span className="inline-flex flex-shrink-0 items-center gap-3">
  <img
            src={filterIcon}
            alt="Іконка сортування"
            className="w-6 h-6 shrink-0 object-center"
            aria-hidden
          />
          <span className="whitespace-nowrap">{currentLabel}</span>
        </span>
        <img
          src={arrowDown}
          alt="Відкрити список сортування"
          className={cn('w-4 h-4 shrink-0 object-center transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          id="sort-listbox"
          role="listbox"
          aria-labelledby="sort-trigger"
          className="absolute right-0 top-full z-10 mt-1 min-w-[200px] rounded-2xl bg-white py-1 shadow-card border border-gray-light"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                'cursor-pointer px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-figma-20 font-futura text-black hover:bg-orange-light',
                value === opt.value && 'bg-orange-light'
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Catalog page (Новинки): breadcrumbs, filters sidebar, book grid, pagination.
 * Matches Figma design with author/status/difficulty filters and sort.
 */
export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const rawSection = searchParams.get('section');
  const section: 'recommended' | 'new' | 'commander' =
    rawSection === 'recommended' || rawSection === 'new' || rawSection === 'commander'
      ? rawSection
      : 'new';

  const SECTION_CONFIG: Record<'recommended' | 'new' | 'commander', { title: string; breadcrumb: string }> =
    {
      recommended: {
        title: 'Рекомендовано до прочитання',
        breadcrumb: 'Рекомендовано до прочитання',
      },
      new: {
        title: 'Новинки',
        breadcrumb: 'Новинки',
      },
      commander: {
        title: 'Командир рекомендує',
        breadcrumb: 'Командир рекомендує',
      },
    };
  const sectionConfig = SECTION_CONFIG[section];

  const [authorOpen, setAuthorOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(true);
  const [difficultyOpen, setDifficultyOpen] = useState(true);

  const [selectedAuthors, setSelectedAuthors] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<BookStatus>>(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<string>>(new Set());

  const [sortBy, setSortBy] = useState<'popularity' | 'title'>('popularity');
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<{
    authors: string[];
    statuses: FilterOption[];
    difficulties: FilterOption[];
  }>({ authors: [], statuses: [], difficulties: [] });
  const [books, setBooks] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusLabelMap = useMemo(() => {
    const m: Record<string, string> = {};
    filters.statuses.forEach((s) => {
      const v = s.value ?? s.id;
      if (v && s.label) m[v] = s.label;
    });
    return m;
  }, [filters.statuses]);

  useEffect(() => {
    setSelectedAuthors(new Set());
    setSelectedStatuses(new Set());
    setSelectedDifficulties(new Set());
    setCurrentPage(1);
  }, [section]);

  useEffect(() => {
    let cancelled = false;
    setLoadingFilters(true);
    getBooksFilters(section)
      .then((data) => {
        if (!cancelled) {
          setFilters({
            authors: data.authors ?? [],
            statuses: data.statuses ?? [],
            difficulties: data.difficulties ?? [],
          });
        }
      })
      .catch(() => {
        if (!cancelled) setFilters({ authors: [], statuses: [], difficulties: [] });
      })
      .finally(() => {
        if (!cancelled) setLoadingFilters(false);
      });
    return () => {
      cancelled = true;
    };
  }, [section]);

  useEffect(() => {
    let cancelled = false;
    setLoadingBooks(true);
    setError(null);
    getCatalogBooks({
      page: currentPage,
      pageSize: BOOKS_PER_PAGE,
      author: selectedAuthors.size ? Array.from(selectedAuthors) : undefined,
      status: selectedStatuses.size ? Array.from(selectedStatuses) : undefined,
      difficulty: selectedDifficulties.size ? Array.from(selectedDifficulties) : undefined,
      sortBy,
      section,
    })
      .then((data) => {
        if (!cancelled) {
          setBooks(data.items ?? []);
          setTotalItems(data.totalItems ?? 0);
          setTotalPages(Math.max(1, data.totalPages ?? 1));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? 'Не вдалося завантажити каталог');
          setBooks([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingBooks(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentPage, selectedAuthors, selectedStatuses, selectedDifficulties, sortBy, section]);

  const difficultyOptions = filters.difficulties;
  const activeFilterTags = useMemo(() => {
    const tags: { key: string; label: string }[] = [];
    selectedAuthors.forEach((a) => tags.push({ key: `author-${a}`, label: a }));
    selectedStatuses.forEach((s) =>
      tags.push({ key: `status-${s}`, label: statusLabelMap[s] ?? s })
    );
    selectedDifficulties.forEach((d) => {
      const opt = difficultyOptions.find((o) => (o.id ?? o.value) === d);
      if (opt) tags.push({ key: `diff-${d}`, label: opt.label });
    });
    return tags;
  }, [selectedAuthors, selectedStatuses, selectedDifficulties, statusLabelMap, difficultyOptions]);

  const removeFilter = (key: string) => {
    if (key.startsWith('author-')) {
      setSelectedAuthors((prev) => {
        const next = new Set(prev);
        next.delete(key.replace('author-', ''));
        return next;
      });
    } else if (key.startsWith('status-')) {
      setSelectedStatuses((prev) => {
        const next = new Set(prev);
        next.delete(key.replace('status-', '') as BookStatus);
        return next;
      });
    } else if (key.startsWith('diff-')) {
      setSelectedDifficulties((prev) => {
        const next = new Set(prev);
        next.delete(key.replace('diff-', ''));
        return next;
      });
    }
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) => {
      const next = new Set(prev);
      if (next.has(author)) next.delete(author);
      else next.add(author);
      return next;
    });
  };

  const toggleStatus = (status: BookStatus) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const toggleDifficulty = (id: string) => {
    setSelectedDifficulties((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const applyFilters = () => {
    setCurrentPage(1);
  };

  return (
    <div className="py-6 md:py-8">
      <Container>
        {/* Breadcrumbs */}
        <nav className="mb-4 md:mb-6 text-sm sm:text-figma-20 text-[#828A8E]" aria-label="Навігація">
          <Link to="/" className="hover:text-black">
            Головна
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">{sectionConfig.breadcrumb}</span>
        </nav>

        <h1 className="text-[20px] sm:text-2xl md:text-[32px] font-sans font-bold text-black mb-2">
          {sectionConfig.title}
        </h1>
        <p className="text-sm sm:text-figma-20 font-futura text-orange mb-4">
          Знайдено {totalItems} книг
        </p>
        {error && (
          <p className="text-red-600 text-sm mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside
            className="catalog-filters lg:w-[280px] shrink-0 border border-gray-light rounded-xl bg-white p-4 h-fit font-futura"
            aria-label="Фільтри каталогу"
          >
            <Collapsible
              title="Автор"
              open={authorOpen}
              onToggle={() => setAuthorOpen(!authorOpen)}
            >
              <ul className="max-h-48 overflow-y-auto space-y-2">
                {(loadingFilters ? [] : filters.authors).map((author) => (
                  <li key={author} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`author-${author}`}
                      checked={selectedAuthors.has(author)}
                      onChange={() => toggleAuthor(author)}
                      className="catalog-filter-checkbox rounded border-gray-dark"
                    />
                    <label
                      htmlFor={`author-${author}`}
                      className="text-sm sm:text-figma-20 font-futura cursor-pointer"
                    >
                      {author}
                    </label>
                  </li>
                ))}
              </ul>
            </Collapsible>

            <Collapsible
              title="Статус книги"
              open={statusOpen}
              onToggle={() => setStatusOpen(!statusOpen)}
            >
              <ul className="space-y-2">
                {(loadingFilters ? [] : filters.statuses).map((opt) => {
                  const status = (opt.value ?? opt.id) as BookStatus;
                  if (!status) return null;
                  return (
                    <li key={status} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`status-${status}`}
                        checked={selectedStatuses.has(status)}
                        onChange={() => toggleStatus(status)}
                        className="catalog-filter-checkbox rounded border-gray-dark"
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="text-sm sm:text-figma-20 font-futura cursor-pointer"
                      >
                        {opt.label ?? status}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Collapsible>

            <Collapsible
              title="Рівень складності"
              open={difficultyOpen}
              onToggle={() => setDifficultyOpen(!difficultyOpen)}
            >
              <ul className="space-y-2">
                {(loadingFilters ? [] : difficultyOptions).map((opt) => {
                  const id = opt.id ?? opt.value ?? '';
                  if (!id) return null;
                  return (
                    <li key={id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`diff-${id}`}
                        checked={selectedDifficulties.has(id)}
                        onChange={() => toggleDifficulty(id)}
                        className="catalog-filter-checkbox rounded border-gray-dark"
                      />
                      <label htmlFor={`diff-${id}`} className="text-sm sm:text-figma-20 font-futura cursor-pointer">
                        {opt.label}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Collapsible>

            <Button variant="primary" className="w-full mt-4 font-futura" onClick={applyFilters}>
              Застосувати
            </Button>
          </aside>

          {/* Main content: filter labels above books, then grid + pagination */}
          <div className="flex-1 min-w-0">
            {/* Filter labels (Figma node 20-1468) above book cards only */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                {activeFilterTags.map(({ key, label }) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 pl-4 pr-2 py-2 rounded-full bg-[#E5E5E5] text-[#333333] text-sm sm:text-figma-20 font-normal font-futura"
                  >
                    {label}
                <button
                      type="button"
                      onClick={() => removeFilter(key)}
                  className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-black/10 text-black transition-colors font-futura"
                      aria-label={`Прибрати фільтр ${label}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="shrink-0">
                <SortDropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center sm:justify-items-stretch">
              {loadingBooks ? (
                <div className="col-span-full py-10 text-center text-gray-dark">
                  Завантаження…
                </div>
              ) : (
                books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    showReserveButton
                    sectionId="catalog"
                    sectionTitle={sectionConfig.title}
                  />
                ))
              )}
            </div>

            {!loadingBooks && books.length === 0 && (
              <p className="text-sm sm:text-figma-20 text-[#828A8E] py-8 text-center">
                За обраними фільтрами книг не знайдено.
              </p>
            )}

            {totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-2 mt-8"
                aria-label="Пагінація"
              >
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-[40px] h-[40px] rounded-full border border-orange bg-white text-orange hover:bg-orange-light transition disabled:opacity-40 disabled:pointer-events-none font-futura"
                  aria-label="Попередня сторінка"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white font-display text-sm sm:text-figma-20 font-medium transition',
                        currentPage === page
                          ? 'text-orange'
                          : 'text-black hover:bg-orange-light'
                      )}
                    >
                      {page}
                    </button>
                  )
                )}
                {totalPages > 4 && (
                  <>
                    <span className="px-1">…</span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className={cn(
                        'flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white font-display text-sm sm:text-figma-20 font-medium transition',
                        currentPage === totalPages
                          ? 'text-orange'
                          : 'text-black hover:bg-orange-light'
                      )}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-[40px] h-[40px] rounded-full border border-orange bg-white text-orange hover:bg-orange-light transition disabled:opacity-40 disabled:pointer-events-none font-futura"
                  aria-label="Наступна сторінка"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                  </svg>
                </button>
              </nav>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

function Collapsible({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-light last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left text-sm sm:text-figma-20 font-medium font-futura py-2"
        aria-expanded={open}
      >
        {title}
        <img
          src={arrowDown}
          alt=""
          className={cn('w-4 h-4 shrink-0 object-center transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}
