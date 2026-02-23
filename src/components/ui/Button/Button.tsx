import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from 'src/utils/cn';

export type ButtonVariant = 'primary' | 'catalog' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Full width when used inside cards. */
  fullWidth?: boolean;
}

/**
 * Reusable button matching Figma (orange primary, catalog green, etc.).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-medium transition hover:brightness-105 disabled:opacity-50 disabled:pointer-events-none font-futura',
          'text-sm sm:text-figma-20 py-2 px-4 sm:py-2.5 sm:px-5',
          variant === 'primary' && 'bg-orange text-white',
          variant === 'catalog' && 'bg-catalog text-white',
          variant === 'ghost' && 'bg-transparent text-black border border-gray-200 hover:bg-gray-100',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
