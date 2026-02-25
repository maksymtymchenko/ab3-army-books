/**
 * Category for the categories grid on the home page (matches API).
 */
export interface Category {
  id: string;
  name: string;
  /** URL to category icon (from API: iconUrl). */
  iconUrl: string;
  href?: string;
}
