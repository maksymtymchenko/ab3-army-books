# Бібліотека (Biblioteka)

Production-ready React application for the library UI, built from the [Figma design](https://www.figma.com/design/tost2tUVOojV6hHQQe7Fjb/).

## Stack

- **React 18** + TypeScript
- **Vite** for build and dev server
- **Tailwind CSS** for styling (Figma-matched tokens)
- **React Router** for routing
- **ESLint** + **Prettier** for code quality

## Project structure

```
src/
  components/     # Reusable UI (Button, Card, Input, Header, Footer, Hero, etc.)
  pages/         # Page components (HomePage)
  layout/        # MainLayout, Container
  hooks/         # Custom hooks
  assets/        # Images, fonts
  types/         # TypeScript types
  utils/         # Helpers (e.g. cn)
  data/          # Static data (books, categories)
```

## Installation

```bash
npm install
```

## Scripts

| Command       | Description                |
|---------------|----------------------------|
| `npm run dev` | Start dev server           |
| `npm run build` | Production build        |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint               |
| `npm run lint:fix` | ESLint with auto-fix  |
| `npm run format` | Format with Prettier   |

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Design tokens (Tailwind)

Colors and typography are aligned with Figma:

- **Colors:** `black` (#001527), `orange` (#F7931E), `white`, `yellow`, `green`, `gray-dark`, `orange-light`, `bg` (#F7F7F7), `catalog` (khaki), `blue-light`
- **Fonts:** Futura PT (body), UAF Sans (display) — with system fallbacks
- **Spacing:** `max-w-content` (1200px) for main content width

## License

Private.
