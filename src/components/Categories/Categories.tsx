import type { Category } from 'src/types';
import { Container } from 'src/layout/Container';
import { useReserveModal } from 'src/layout/MainLayout/MainLayout';
import { categories } from 'src/data/categories';

/**
 * Categories list section using pill-like cards from Figma.
 * Clicking a category opens the reserve modal with that category name as the initial search.
 */
export function Categories() {
  const openReserveModal = useReserveModal();
  const firstRow = categories.slice(0, 4);
  const secondRow = categories.slice(4);

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, cat: Category) => {
    e.preventDefault();
    openReserveModal(cat.name);
  };

  const renderCategoryCard = (cat: Category) => (
    <li key={cat.id} className="w-full md:flex-1">
      <a
        href={cat.href ?? '#'}
        className="block no-underline text-black cursor-pointer"
        onClick={(e) => handleCategoryClick(e, cat)}
        aria-label={`Забронювати книги: ${cat.name}`}
      >
        <div className="flex h-[100px] items-center gap-4 px-5 bg-orange-light border border-orange rounded-lg">
          <img
            src={cat.icon}
            alt={`Іконка категорії ${cat.name}`}
            className="h-10 w-10 object-contain"
            loading="lazy"
            decoding="async"
          />
          <span className="flex-1 text-black text-sm sm:text-figma-20 font-medium leading-snug">
            {cat.name}
          </span>
        </div>
      </a>
    </li>
  );

  return (
    <section className="py-8 sm:py-10 bg-bg" aria-labelledby="categories-heading">
      <Container>
        <h2 id="categories-heading" className="sr-only">
          Категорії книг
        </h2>
        {/* First row: 4 items */}
        <ul className="flex flex-col md:flex-row md:flex-nowrap gap-4 sm:gap-5 list-none m-0 p-0 mb-4">
          {firstRow.map(renderCategoryCard)}
        </ul>

        {/* Second row: 3 items, therefore naturally a bit wider */}
        <ul className="flex flex-col md:flex-row md:flex-nowrap gap-4 sm:gap-5 list-none m-0 p-0">
          {secondRow.map(renderCategoryCard)}
        </ul>
      </Container>
    </section>
  );
}
