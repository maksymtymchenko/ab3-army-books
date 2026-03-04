/**
 * Base URL for backend API. Use VITE_API_BASE_URL in .env or default to same-origin.
 */
const API_BASE = typeof import.meta.env !== 'undefined' && import.meta.env?.VITE_API_BASE_URL != null
  ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
  : '';

/** Build full URL for an API path (leading slash allowed). */
function url(path: string, params?: Record<string, string | number | undefined | string[]>): string {
  const base = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  if (!params) return base;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)));
    } else {
      search.set(key, String(value));
    }
  }
  const q = search.toString();
  return q ? `${base}?${q}` : base;
}

/** Parse JSON or throw with message. */
async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) throw new Error('Empty response');
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON: ${text.slice(0, 200)}`);
  }
}

/** API error with status and optional body. */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: { error?: string; message?: string; fields?: Record<string, string> }
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response, parse: () => Promise<T>): Promise<T> {
  if (!res.ok) {
    let body: { error?: string; message?: string; fields?: Record<string, string> } | undefined;
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    throw new ApiError(
      body?.message ?? `Request failed: ${res.status} ${res.statusText}`,
      res.status,
      body
    );
  }
  return parse();
}

/** Response shape for GET /api/books/home */
export interface HomeBooksResponse {
  recommended: import('src/types').Book[];
  newArrivals: import('src/types').Book[];
  commanderRecommends: import('src/types').Book[];
}

/** Fetches home page book sections (recommended, new arrivals, commander recommends). */
export async function getHomeBooks(): Promise<HomeBooksResponse> {
  const res = await fetch(url('/api/books/home'));
  return handleResponse(res, () => parseJson<HomeBooksResponse>(res));
}

/** Query params for GET /api/books */
export interface CatalogBooksParams {
  page?: number;
  pageSize?: number;
  author?: string | string[];
  status?: import('src/types').BookStatus | import('src/types').BookStatus[];
  difficulty?: string | string[];
  sortBy?: 'popularity' | 'title';
  sortOrder?: 'asc' | 'desc';
  /** Optional home-section tag to scope catalog (recommended, new, commander). */
  section?: 'recommended' | 'new' | 'commander';
}

/** Response shape for GET /api/books */
export interface CatalogBooksResponse {
  items: import('src/types').Book[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  appliedFilters: {
    authors: string[];
    statuses: string[];
    difficulties: string[];
    sortBy: string;
  };
}

/** Fetches paginated, filterable catalog books. */
export async function getCatalogBooks(params: CatalogBooksParams = {}): Promise<CatalogBooksResponse> {
  const q: Record<string, string | number | string[]> = {};
  if (params.page != null) q.page = params.page;
  if (params.pageSize != null) q.pageSize = params.pageSize;
  if (params.author != null) {
    q.author = Array.isArray(params.author) ? params.author : [params.author];
  }
  if (params.status != null) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status];
    // Send both singular and plural keys to be compatible with backend implementations
    // that may expect either `status` or `statuses` as the query parameter name.
    q.status = statuses;
    q.statuses = statuses;
  }
  if (params.difficulty != null) {
    q.difficulty = Array.isArray(params.difficulty) ? params.difficulty : [params.difficulty];
  }
  if (params.sortBy != null) q.sortBy = params.sortBy;
  if (params.sortOrder != null) q.sortOrder = params.sortOrder;
  if (params.section != null) q.section = params.section;
  const res = await fetch(url('/api/books', q));
  return handleResponse(res, () => parseJson<CatalogBooksResponse>(res));
}

/** Option for filters (value/label or id/label). */
export interface FilterOption {
  value?: string;
  id?: string;
  label: string;
}

/** Response shape for GET /api/books/filters */
export interface BooksFiltersResponse {
  authors: string[];
  statuses: FilterOption[];
  difficulties: FilterOption[];
}

/** Fetches filter options for catalog (authors, statuses, difficulties). */
export async function getBooksFilters(section?: string): Promise<BooksFiltersResponse> {
  const params = section != null ? { section } : undefined;
  const res = await fetch(url('/api/books/filters', params as Record<string, string>));
  return handleResponse(res, () => parseJson<BooksFiltersResponse>(res));
}

/** Fetches a single book by id. */
export async function getBook(id: string): Promise<import('src/types').Book> {
  const res = await fetch(url(`/api/books/${encodeURIComponent(id)}`));
  return handleResponse(res, () => parseJson<import('src/types').Book>(res));
}

/** Params for GET /api/books/search */
export interface SearchBooksParams {
  q: string;
  limit?: number;
  status?: import('src/types').BookStatus;
}

/** Response shape for GET /api/books/search */
export interface SearchBooksResponse {
  items: import('src/types').Book[];
  totalItems: number;
}

/** Searches books by title/author. */
export async function searchBooks(params: SearchBooksParams): Promise<SearchBooksResponse> {
  const { q: query, limit, status } = params;
  const queryParams: Record<string, string | number> = { q: query.trim() };
  if (limit != null) queryParams.limit = limit;
  if (status != null) queryParams.status = status;
  const res = await fetch(url('/api/books/search', queryParams));
  return handleResponse(res, () => parseJson<SearchBooksResponse>(res));
}

/** Response shape for GET /api/categories */
export interface CategoriesResponse {
  items: import('src/types').Category[];
}

/** Fetches categories for the home page. */
export async function getCategories(): Promise<CategoriesResponse> {
  const res = await fetch(url('/api/categories'));
  return handleResponse(res, () => parseJson<CategoriesResponse>(res));
}

/** Request body for POST /api/reservations */
export interface CreateReservationBody {
  bookId: string;
  fullName: string;
  phone: string;
  subdivision: string;
  comment?: string;
}

/** Reservation in create response. */
export interface ReservationBookInfo {
  id: string;
  title: string;
  author: string;
  status: import('src/types').BookStatus;
}

/** Response shape for POST /api/reservations (201) */
export interface CreateReservationResponse {
  id: string;
  bookId: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: string;
  book: ReservationBookInfo;
}

/** Creates a book reservation. */
export async function createReservation(body: CreateReservationBody): Promise<CreateReservationResponse> {
  const res = await fetch(url('/api/reservations'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res, () => parseJson<CreateReservationResponse>(res));
}
