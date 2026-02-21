import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from 'src/layout/MainLayout';
import { HomePage } from 'src/pages/HomePage';
import { CatalogPage } from 'src/pages/CatalogPage';
import { BookPage } from 'src/pages/BookPage';

/**
 * App root: router and main layout wrapping all pages.
 */
function App() {
  return (
    <BrowserRouter>
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
