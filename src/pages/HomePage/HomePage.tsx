import { Hero } from 'src/components/Hero/Hero';
import { Categories } from 'src/components/Categories/Categories';
import { BookSection } from 'src/components/BookSection/BookSection';
import {
  recommendedBooks,
  newArrivalsBooks,
  commanderRecommendsBooks,
} from 'src/data/books';

/**
 * Home page: hero, categories grid, three book carousels.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <BookSection
        id="recommended"
        title="Рекомендовано до прочитання"
        seeAllHref="#recommended"
        books={recommendedBooks}
        showReserveButton
      />
      <BookSection
        id="new"
        title="Новинки"
        seeAllHref="#new"
        books={newArrivalsBooks}
        showReserveButton
      />
      <BookSection
        id="commander"
        title="Командир рекомендує"
        seeAllHref="#commander"
        books={commanderRecommendsBooks}
        showReserveButton
      />
    </>
  );
}
