import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Book } from 'src/types';
import { Header } from 'src/components/Header/Header';
import { Footer } from 'src/components/Footer/Footer';
import { HeaderReserveModal } from 'src/components/HeaderReserveModal';
import { ReserveBookModal } from 'src/components/ReserveBookModal';

export interface MainLayoutProps {
  children: ReactNode;
}

/** Context so any descendant (e.g. Categories) can open the reserve modal. */
const ReserveModalContext = createContext<((initialQuery?: string) => void) | null>(null);

/** Hook to open the reserve search modal with optional initial query (e.g. category name). */
export function useReserveModal(): (initialQuery?: string) => void {
  const open = useContext(ReserveModalContext);
  return open ?? (() => {});
}

/**
 * Main app layout: sticky header, full-width main content, footer.
 * Owns reserve modal state so Header and Footer can both open the same modals.
 */
export function MainLayout({ children }: MainLayoutProps) {
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [initialModalSearchQuery, setInitialModalSearchQuery] = useState('');
  const [reserveFormBook, setReserveFormBook] = useState<Book | null>(null);
  const [reserveFormOpen, setReserveFormOpen] = useState(false);

  const onOpenReserveModal = useCallback((initialQuery = '') => {
    setInitialModalSearchQuery(initialQuery);
    setReserveModalOpen(true);
  }, []);

  const handleCloseReserveModal = useCallback(() => {
    setReserveModalOpen(false);
    setInitialModalSearchQuery('');
  }, []);

  const handleReserveBook = useCallback((book: Book) => {
    setReserveModalOpen(false);
    setReserveFormBook(book);
    setReserveFormOpen(true);
  }, []);

  const handleCloseReserveForm = useCallback(() => {
    setReserveFormOpen(false);
    setReserveFormBook(null);
  }, []);

  return (
    <ReserveModalContext.Provider value={onOpenReserveModal}>
      <div className="min-h-screen flex flex-col bg-bg">
        <Header onOpenReserveModal={onOpenReserveModal} />
        <main className="flex-1">{children}</main>
        <Footer onOpenReserveModal={onOpenReserveModal} />
        <HeaderReserveModal
          open={reserveModalOpen}
          onClose={handleCloseReserveModal}
          onReserveBook={handleReserveBook}
          initialSearchQuery={initialModalSearchQuery}
        />
      {reserveFormBook && (
          <ReserveBookModal
            book={reserveFormBook}
            open={reserveFormOpen}
            onClose={handleCloseReserveForm}
          />
        )}
      </div>
    </ReserveModalContext.Provider>
  );
}
