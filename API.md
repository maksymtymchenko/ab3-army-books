### Biblioteka Backend API PRD

**Goal**: Define the backend HTTP API required to support the existing Biblioteka UI (home, catalog, book details, search, and reservation flow).

**Scope**: Read-only catalog data and anonymous book reservations. No user accounts or authentication in this version.

---

### 1. Domain Models (Conceptual)

- **Book**
  - **id**: string
  - **title**: string
  - **author**: string
  - **coverUrl**: string (public URL to image)
  - **status**: `'in_stock' | 'reserved' | 'issued'`
  - **description?**: string
  - **difficulty?**: `'basic' | 'medium' | 'advanced'` (for catalog filter)
  - **popularityScore?**: number (for “by popularity” sorting)
  - **sectionTags?**: `('recommended' \| 'new' \| 'commander')[]` (for home-page carousels)

- **Category**
  - **id**: string
  - **name**: string
  - **iconUrl**: string
  - **href**: string (optional deep-link)

- **Reservation**
  - **id**: string
  - **bookId**: string
  - **fullName**: string
  - **phone**: string
  - **subdivision**: string
  - **comment**: string
  - **status**: `'pending' | 'confirmed' | 'rejected' | 'cancelled'`
  - **createdAt**: ISO 8601 string

---

### 2. Endpoint: Get Home Page Book Sections

- **Used by UI**: `HomePage` (`BookSection` components: “Рекомендовано до прочитання”, “Новинки”, “Командир рекомендує”).
- **Purpose**: Fetch three carousels of books for the home screen.

**Method / URL**

- **GET** `/api/books/home`

**Query Params**

- None (optional future: `?limit=8` per section).

**Response 200**

```json
{
  "recommended": [
    {
      "id": "1",
      "title": "В сталевих грозах",
      "author": "Ернст Юнгер",
      "coverUrl": "https://.../book_1.png",
      "status": "in_stock",
      "description": "..."
    }
  ],
  "newArrivals": [
    {
      "id": "5",
      "title": "Нова книга 1",
      "author": "Автор 1",
      "coverUrl": "https://.../book_1.png",
      "status": "in_stock"
    }
  ],
  "commanderRecommends": [
    {
      "id": "9",
      "title": "Рекомендація 1",
      "author": "Автор 1",
      "coverUrl": "https://.../book_1.png",
      "status": "in_stock"
    }
  ]
}
```

**Error Cases**

- **200** with empty arrays if no data.
- **500** – internal error (`{ "error": "internal_error", "message": "..." }`).

---

### 3. Endpoint: Get Catalog Books (Новинки)

- **Used by UI**: `CatalogPage` (“Новинки”)
  - Filter by author, status, difficulty.
  - Sort by popularity or title.
  - Paginate and show total count.
- **Purpose**: Paginated, filterable, sortable list of books.

**Method / URL**

- **GET** `/api/books`

**Query Params**

- **page**: integer, default `1`.
- **pageSize**: integer, default `12` (matches `BOOKS_PER_PAGE`).
- **author**: string or repeated param (e.g. `?author=A&author=B`).
- **status**: `'in_stock' | 'reserved' | 'issued'` (repeatable).
- **difficulty**: `'basic' | 'medium' | 'advanced'` (repeatable).
- **sortBy**: `'popularity' | 'title'` (default `'popularity'`).
- **sortOrder?**: `'asc' | 'desc'` (optional, default depends on `sortBy`).

**Response 200**

```json
{
  "items": [
    {
      "id": "5",
      "title": "Нова книга 1",
      "author": "Автор 1",
      "coverUrl": "https://.../book_1.png",
      "status": "in_stock",
      "description": "optional",
      "difficulty": "basic",
      "popularityScore": 123
    }
  ],
  "page": 1,
  "pageSize": 12,
  "totalItems": 34,
  "totalPages": 3,
  "appliedFilters": {
    "authors": ["Автор 1"],
    "statuses": ["in_stock"],
    "difficulties": ["basic"],
    "sortBy": "popularity"
  }
}
```

**Error Cases**

- **400** – invalid params (negative `page`, unknown `status`, etc.).
- **500** – internal error.

---

### 4. Endpoint: Get Filter Options (Authors, Statuses, Difficulty)

- **Used by UI**: `CatalogPage` sidebar filters and filter tags.
- **Purpose**: Provide consistent canonical options for authors, statuses, and difficulty levels.

**Method / URL**

- **GET** `/api/books/filters`

**Query Params**

- **section?**: string – optional (e.g. `section=new` to scope to “Новинки” only).

**Response 200**

```json
{
  "authors": ["Ернст Юнгер", "Олексій Середюк"],
  "statuses": [
    { "value": "in_stock", "label": "В наявності" },
    { "value": "reserved", "label": "Заброньована" },
    { "value": "issued", "label": "Видана" }
  ],
  "difficulties": [
    { "id": "basic", "label": "Базовий" },
    { "id": "medium", "label": "Середній" },
    { "id": "advanced", "label": "Поглиблений" }
  ]
}
```

**Error Cases**

- **500** – internal error.

---

### 5. Endpoint: Get Single Book by ID

- **Used by UI**: `BookPage` (`/book/:id`).
- **Purpose**: Retrieve detailed information for a specific book (for detail page and reservation).

**Method / URL**

- **GET** `/api/books/{id}`

**Path Params**

- **id**: string – book identifier.

**Response 200**

```json
{
  "id": "1",
  "title": "В сталевих грозах",
  "author": "Ернст Юнгер",
  "coverUrl": "https://.../book_1.png",
  "status": "in_stock",
  "description": "Фронт Першої світової...",
  "difficulty": "advanced",
  "popularityScore": 200,
  "sectionTags": ["recommended", "new"]
}
```

**Error Cases**

- **404** – book not found  
  - `{ "error": "book_not_found", "message": "Book with given id not found" }`
- **500** – internal error.

---

### 6. Endpoint: Search Books

- **Used by UI**:
  - Header search input (opens `HeaderReserveModal` with initial query).
  - `HeaderReserveModal` search field (live search, then user can reserve top result).
- **Purpose**: Return a list of matching books based on title/author query.

**Method / URL**

- **GET** `/api/books/search`

**Query Params**

- **q**: string – required search term (trimmed, minimum length e.g. 2).
- **limit?**: integer – max results, default `10`.
- **status?**: `'in_stock' | 'reserved' | 'issued'` – optional filter (e.g. only `in_stock` for reservable books).

**Response 200**

```json
{
  "items": [
    {
      "id": "1",
      "title": "В сталевих грозах",
      "author": "Ернст Юнгер",
      "coverUrl": "https://.../book_1.png",
      "status": "in_stock"
    }
  ],
  "totalItems": 3
}
```

**Error Cases**

- **400** – invalid or missing query  
  - `{ "error": "invalid_query", "message": "Query must be at least 2 characters" }`
- **500** – internal error.

---

### 7. Endpoint: Get Categories

- **Used by UI**: `Categories` component on `HomePage`.
- **Purpose**: Provide list of categories (label + icon + optional deep link).

**Method / URL**

- **GET** `/api/categories`

**Query Params**

- None.

**Response 200**

```json
{
  "items": [
    {
      "id": "1",
      "name": "Війна та бойовий шлях",
      "iconUrl": "https://.../cat_1.svg",
      "href": "/catalog?category=war"
    }
  ]
}
```

**Error Cases**

- **500** – internal error.

---

### 8. Endpoint: Create Book Reservation

- **Used by UI**:
  - `ReserveBookModal` when user submits the form (“Забронювати”).
  - Triggered from book detail page or from header reserve flow (after selecting a book).
- **Purpose**: Create a reservation request for a specific book and optionally update book status.

**Method / URL**

- **POST** `/api/reservations`

**Request Body (JSON)**

```json
{
  "bookId": "1",
  "fullName": "Псевдо Боєць",
  "phone": "+380123456789",
  "subdivision": "1 ОМБр",
  "comment": "Буду в бібліотеці у пʼятницю."
}
```

**Validation Rules (High Level)**

- **bookId**: required, must reference an existing book that can be reserved.
- **fullName**: required, non-empty, max length (e.g. 100).
- **phone**: required, must be a valid phone format (WhatsApp/Signal-capable).
- **subdivision**: required, non-empty, max length (e.g. 100).
- **comment**: optional, max length (e.g. 500).

**Response 201**

```json
{
  "id": "res_123",
  "bookId": "1",
  "status": "pending",
  "createdAt": "2026-02-23T10:15:00.000Z",
  "book": {
    "id": "1",
    "title": "В сталевих грозах",
    "author": "Ернст Юнгер",
    "status": "reserved"
  }
}
```

**Error Cases**

- **400** – validation errors  
  - `{ "error": "validation_error", "fields": { "phone": "Invalid phone format" } }`
- **404** – `bookId` not found  
  - `{ "error": "book_not_found", "message": "Book with given id not found" }`
- **409** – book cannot be reserved (already reserved/issued or policy violation)  
  - `{ "error": "book_not_reservable", "message": "Book is already issued or reserved" }`
- **500** – internal error.

---

### 9. Cross-Cutting Requirements

- **Status Enum Consistency**
  - The API must use the same status enum as the UI: `'in_stock'`, `'reserved'`, `'issued'`.
  - Human-readable labels (e.g. “В наявності”) should be provided by the backend (e.g. `/api/books/filters`) to avoid duplication.

- **Pagination**
  - All list endpoints should support pagination or limits:
    - `/api/books` (page + pageSize).
    - `/api/books/search` (limit).
    - `/api/categories` (optional future pagination).

- **Localization**
  - All user-facing strings (labels, error messages) should be localizable (keys vs. raw strings).

- **Performance**
  - Targets: home and catalog endpoints should typically respond in \< 200–300 ms under normal conditions.

- **Security**
  - Reservation creation should include basic abuse protection (e.g. rate limiting per IP/phone).
  - No authentication is required for v1; future versions can add auth without breaking these public contracts.

