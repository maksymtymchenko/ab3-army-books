import type { Category } from 'src/types';
import cat1 from 'src/assets/categories/cat_1.svg';
import cat2 from 'src/assets/categories/cat_2.svg';
import cat3 from 'src/assets/categories/cat_3.svg';
import cat4 from 'src/assets/categories/cat_4.svg';
import cat5 from 'src/assets/categories/cat_5.svg';
import cat6 from 'src/assets/categories/cat_6.svg';
import cat7 from 'src/assets/categories/cat_7.svg';
/**
 * Category list for the home page grid (matches Figma).
 * Icons come from `src/assets/categories`.
 */
export const categories: Category[] = [
  { id: '1', name: 'Війна та бойовий шлях', icon: cat1, href: '#' },
  { id: '2', name: 'Художня література', icon: cat2, href: '#' },
  { id: '3', name: 'Історія та біографії', icon: cat3, href: '#' },
  { id: '4', name: 'Навчальні матеріали', icon: cat4, href: '#' },
  { id: '5', name: 'Стратегія і державне мислення', icon: cat5, href: '#' },
  { id: '6', name: 'Ідеологія та політична думка', icon: cat6, href: '#' },
  { id: '7', name: 'Військовий гумор і внутрішня сатира', icon: cat7, href: '#' },
];
