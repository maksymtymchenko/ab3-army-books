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

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.replace('#', '');
    const el = document.getElementById(id);

    if (!el) {
      return;
    }

    const header = document.querySelector(HEADER_SELECTOR);
    const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;

    const top =
      el.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top, left: 0, behavior: 'smooth' });
  }, [location]);

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
