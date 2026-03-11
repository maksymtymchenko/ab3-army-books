import { Link } from 'react-router-dom';
import { Container } from 'src/layout/Container';

/**
 * Fallback error page for unknown routes or general navigation errors.
 */
export function ErrorPage() {
  return (
    <div className="py-12 md:py-16">
      <Container className="flex flex-col items-center text-center gap-6">
        <p className="text-sm sm:text-base font-futura text-orange uppercase tracking-[0.12em]">
          Помилка 404
        </p>
        <h1 className="text-[28px] sm:text-[32px] md:text-[40px] font-sans font-bold text-black">
          Сторінку не знайдено
        </h1>
        <p className="max-w-xl text-sm sm:text-figma-20 font-futura text-[#828A8E]">
          Можливо, ви помилилися в адресі або сторінка була переміщена. 
          Поверніться на головну або скористайтеся каталогом, щоб знайти потрібну книгу.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition hover:brightness-105 disabled:opacity-50 disabled:pointer-events-none font-futura text-sm sm:text-figma-20 py-2 px-4 sm:py-2.5 sm:px-5 bg-orange text-white"
          >
            На головну
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition hover:brightness-105 disabled:opacity-50 disabled:pointer-events-none font-futura text-sm sm:text-figma-20 py-2 px-4 sm:py-2.5 sm:px-5 bg-transparent text-black border border-gray-200 hover:bg-gray-100"
          >
            До каталогу
          </Link>
        </div>
      </Container>
    </div>
  );
}

