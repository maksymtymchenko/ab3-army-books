import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from 'src/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon (e.g. search) rendered left inside the input wrapper. */
  leftIcon?: React.ReactNode;
  /** Wrapper class when using leftIcon. */
  wrapperClassName?: string;
}

/**
 * Text input with optional left icon; matches header search styling.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, wrapperClassName, value, onChange, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        className={cn(
          'flex-1 min-w-0 bg-transparent outline-none text-sm sm:text-figma-20 text-black placeholder:text-gray-dark',
          leftIcon ? 'border-0' : 'py-2.5 px-4 rounded-full border border-gray-200',
          className
        )}
        value={value}
        onChange={onChange}
        {...props}
      />
    );

    if (leftIcon) {
      return (
        <div
          className={cn(
            'flex items-center gap-2 flex-1 py-2 px-4 bg-white border border-gray-200 rounded-full text-gray-dark',
            wrapperClassName
          )}
        >
          {leftIcon}
          {input}
        </div>
      );
    }

    return input;
  }
);

Input.displayName = 'Input';
