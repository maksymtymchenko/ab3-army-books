import { type HTMLAttributes } from 'react';
import { cn } from 'src/utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max width content area (1200px from Figma). */
  as?: 'div' | 'section' | 'article';
}

/**
 * Centered content container with max-width matching Figma.
 */
export function Container({
  className,
  as: Component = 'div',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full max-w-content px-3 sm:px-4', className)}
      {...props}
    />
  );
}
