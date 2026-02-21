import classNames from 'classnames';

/**
 * Shorthand for classnames() for conditional and combined class names.
 */
export function cn(...args: classNames.ArgumentArray): string {
  return classNames(args);
}
