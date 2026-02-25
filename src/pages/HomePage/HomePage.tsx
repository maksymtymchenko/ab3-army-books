import { useEffect, useState } from 'react';
import { Hero } from 'src/components/Hero/Hero';
import { Categories } from 'src/components/Categories/Categories';
import { BookSection } from 'src/components/BookSection/BookSection';
import { getHomeBooks } from 'src/api';
import type { Book } from 'src/types';

/**
 * Home page: hero, categories grid, three book carousels.
 */
export function HomePage() {
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [commanderRecommends, setCommanderRecommends] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getHomeBooks()
      .then((data) => {
        if (!cancelled) {
          setRecommended(data.recommended ?? []);
          setNewArrivals(data.newArrivals ?? []);
          setCommanderRecommends(data.commanderRecommends ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Не вдалося завантажити дані');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="py-10 text-center text-gray-dark">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <Categories />
      {loading ? (
        <div className="py-10 text-center text-gray-dark">Завантаження…</div>
      ) : (
        <>
          <BookSection
            id="recommended"
            title="Рекомендовано до прочитання"
            seeAllHref="/catalog?section=recommended"
            books={recommended}
            showReserveButton
          />
          <BookSection
            id="new"
            title="Новинки"
            seeAllHref="/catalog?section=new"
            books={newArrivals}
            showReserveButton
          />
          <BookSection
            id="commander"
            title="Командир рекомендує"
            seeAllHref="/catalog?section=commander"
            books={commanderRecommends}
            showReserveButton
          />
        </>
      )}
    </>
  );
}
