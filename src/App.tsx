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

/**
 * App root: router and main layout wrapping all pages.
 */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
