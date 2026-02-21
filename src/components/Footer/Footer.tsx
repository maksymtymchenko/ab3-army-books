import { Button } from 'src/components/ui';
import { Container } from 'src/layout/Container';

export interface FooterProps {
  /** Open the reserve search modal (same as header Забронювати). */
  onOpenReserveModal?: (initialQuery?: string) => void;
}

const footerCol1 = [
  { label: 'Війна та бойовий шлях', href: '#' },
  { label: 'Стратегія і державне мислення', href: '#' },
  { label: 'Ідеологія та політична думка', href: '#' },
  { label: 'Історія та біографії', href: '#' },
];

const footerCol2 = [
  { label: 'Художня література', href: '#' },
  { label: 'Військовий гумор і внутрішня сатира', href: '#' },
  { label: 'Навчальні матеріали', href: '#' },
];

/** Footer link click: open reserve modal with category name as initial search. */
function handleCategoryClick(
  label: string,
  onOpenReserveModal?: (initialQuery?: string) => void
) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenReserveModal?.(label);
  };
}

/**
 * Site footer: two columns of links, CTA button, copyright.
 */
export function Footer({ onOpenReserveModal }: FooterProps) {
  return (
    <footer className="bg-black text-white font-sans py-10 px-4 sm:px-6">
      <Container className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
        <nav className="flex flex-wrap gap-8 sm:gap-12" aria-label="Категорії">
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {footerCol1.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-white text-sm sm:text-figma-20 no-underline hover:underline cursor-pointer"
                  onClick={handleCategoryClick(label, onOpenReserveModal)}
                  aria-label={`Забронювати книги: ${label}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {footerCol2.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-white text-sm sm:text-figma-20 no-underline hover:underline cursor-pointer"
                  onClick={handleCategoryClick(label, onOpenReserveModal)}
                  aria-label={`Забронювати книги: ${label}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="shrink-0">
          <Button
            variant="primary"
            className="hover:brightness-105"
            onClick={() => onOpenReserveModal?.()}
          >
            Забронювати
          </Button>
        </div>
      </Container>
      <hr className="border-0 h-px bg-white/20 my-8 w-full max-w-content mx-auto" />
      <p className="text-center text-xs sm:text-figma-16 text-white/80 m-0">
        © Всі права захищені
      </p>
    </footer>
  );
}
