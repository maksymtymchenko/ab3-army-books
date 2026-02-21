import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from 'src/components/ui';
import { Container } from 'src/layout/Container';
import headerLogo from 'src/assets/header/logo.png';
import headerLabel from 'src/assets/header/label.png';
import headerSearchIcon from 'src/assets/header/search_icon.png';

/** Search icon image from header assets. */
function SearchIcon() {
  return (
    <img
      src={headerSearchIcon}
      alt=""
      className="w-5 h-5 shrink-0 object-contain"
      aria-hidden
    />
  );
}

/** Logo composed from header images (crest + label). */
function Logo() {
  return (
    <a
      href="/"
      className="flex shrink-0 items-center gap-3 text-black"
      aria-label="Головна сторінка"
    >
      <img src={headerLogo} alt="Логотип бібліотеки" className="h-10 w-auto object-contain" />
    </a>
  );
}

/** Catalog as hamburger icon (mobile only). */
function CatalogHamburger() {
  return (
    <Link
      to="/catalog"
      className="md:hidden flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-catalog text-white transition hover:brightness-105"
      aria-label="Відкрити каталог"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </Link>
  );
}

/** Catalog button with icon + label (desktop). */
function CatalogButton({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/catalog"
      className={`hidden md:inline-flex items-center justify-center gap-2 rounded-full font-medium transition hover:brightness-105 text-figma-20 shrink-0 bg-catalog text-white py-2.5 px-5 ${className}`}
      aria-label="Відкрити каталог"
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
      Каталог
    </Link>
  );
}

/** User/crest icon area now shows header label image. */
function UserIcon() {
  return (
    <img
      src={headerLabel}
      alt="Бібліотека"
      className="h-8 w-auto object-contain"
    />
  );
}

export interface HeaderProps {
  /** Open the reserve search modal (same as clicking Забронювати). Pass optional initial search query from header search. */
  onOpenReserveModal?: (initialQuery?: string) => void;
}

/**
 * Site header: logo, catalog button, search, reserve button, user icon.
 * On mobile shows only logo, search input, and catalog button.
 */
export function Header({ onOpenReserveModal }: HeaderProps) {
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenReserveModal?.(headerSearchQuery.trim());
  };

  const openReserve = (query?: string) => {
    onOpenReserveModal?.(query ?? '');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-light font-sans">
      <Container className="flex items-center gap-2 md:gap-4 py-3 md:py-4">
        <Logo />

        {/* Mobile: search + catalog only */}
        <form
          onSubmit={handleHeaderSearchSubmit}
          className="md:hidden flex flex-1 min-w-0"
          role="search"
        >
          <Input
            type="search"
            placeholder="Пошук"
            value={headerSearchQuery}
            onChange={(e) => setHeaderSearchQuery(e.target.value)}
            leftIcon={<SearchIcon />}
            className="border-0 p-0"
            wrapperClassName="flex items-center gap-2 flex-1 h-9 min-w-0 px-3 bg-white border border-gray-dark rounded-[30px] text-gray-dark text-sm sm:text-base"
            aria-label="Пошук книг"
          />
        </form>
        <CatalogHamburger />

        {/* Desktop nav */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:gap-6 md:ml-6">
          <CatalogButton />
          <form
            onSubmit={handleHeaderSearchSubmit}
            className="flex flex-1 items-center gap-3 min-w-0 max-w-xl"
            role="search"
          >
            <Input
              type="search"
              placeholder="Пошук"
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              leftIcon={<SearchIcon />}
              className="border-0 p-0"
              wrapperClassName="flex items-center gap-4 flex-1 h-[52px] px-6 py-3 bg-white border border-gray-dark rounded-[30px] text-gray-dark"
              aria-label="Пошук книг"
            />
          </form>
          <div className="flex items-center gap-6 shrink-0">
            <Button variant="primary" className="shrink-0" onClick={() => openReserve('')}>
              Забронювати
            </Button>
            <UserIcon />
          </div>
        </div>
      </Container>
    </header>
  );
}
