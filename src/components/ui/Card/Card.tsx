import { type HTMLAttributes } from 'react';
import { cn } from 'src/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Use for category cards (orange-light bg, border). */
  variant?: 'default' | 'category';
}

/**
 * Base card container; use variant="category" for category grid items.
 */
export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-figma bg-white shadow-card transition hover:shadow-card-hover',
        variant === 'category' &&
          'bg-orange-light border border-orange/30 shadow-category hover:shadow-category-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    />
  );
}
