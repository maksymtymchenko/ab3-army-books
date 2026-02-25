import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { MainLayout } from 'src/layout/MainLayout';
import { HomePage } from 'src/pages/HomePage';
import { CatalogPage } from 'src/pages/CatalogPage';
import { BookPage } from 'src/pages/BookPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

/** Selector for sticky app header (used to measure offset for hash scroll). */
const HEADER_SELECTOR = '[data-app-header]';

/** Retry delays (ms) when scrolling to hash and target element is not yet in DOM (e.g. HomePage still loading). */
const HASH_SCROLL_RETRY_DELAYS = [0, 100, 300, 500, 800];

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.replace('#', '')?.trim();
    if (!hash) return;

    const scrollToElement = () => {
      const el = document.getElementById(hash);
      if (!el) return false;
      const header = document.querySelector(HEADER_SELECTOR);
      const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, left: 0, behavior: 'smooth' });
      return true;
    };

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    HASH_SCROLL_RETRY_DELAYS.forEach((delay) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        if (scrollToElement()) {
          timeouts.forEach(clearTimeout);
        }
      }, delay);
      timeouts.push(t);
    });

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [location.pathname, location.hash]);

  return null;
}

/**
 * App root: router and main layout wrapping all pages.
 */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollToHash />
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/book/:id" element={<BookPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
