import { Link } from 'react-router-dom';
import { Container } from 'src/layout/Container';
import heroBg from 'src/assets/header/hero.jpg';

/**
 * Hero section with title, subtitle and CTA (Figma: "Сила слова — для сили духу").
 */
export function Hero() {
  return (
    <section
      className="relative py-16 sm:py-24 md:py-32 bg-black/80 overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" />
      <Container className="relative z-10 text-center px-4">
        <h1
          id="hero-title"
          className="font-display font-bold text-white text-[20px] sm:text-3xl md:text-figma-32 md:text-5xl lg:text-figma-60 leading-tight mb-4"
        >
          Сила слова — для сили духу
        </h1>
        <p className="text-white text-sm sm:text-base md:text-figma-20 max-w-2xl mx-auto mb-8 opacity-95">
          Оберіть книгу, що підтримає, надихне або просто подарує
          <br />
          кілька спокійних годин
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center justify-center gap-2 rounded-full font-medium transition hover:brightness-105 bg-orange text-white text-sm sm:text-base md:text-figma-20 px-5 py-2 sm:px-8 sm:py-3"
          aria-label="Перейти до каталогу книг"
        >
          Оберіть книгу
        </Link>
      </Container>
    </section>
  );
}
