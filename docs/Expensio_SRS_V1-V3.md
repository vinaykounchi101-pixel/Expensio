# Software Requirements Specification (SRS)
## Expensio — Versions 1 to 3

| | |
|---|---|
| **Document Type** | Software Requirements Specification |
| **Product** | Expensio |
| **Versions Covered** | V1 — Core Expense Tracker · V2 — Better Expense Management · V3 — Analytics & Budget |
| **Document Version** | 2.0 |
| **Status** | Draft for Implementation |

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements, system architecture, database schema, API design, and UI design system for **Expensio V1–V3**, per `PRODUCT_ROADMAP.md`. Each version remains an independently shippable, complete product — V2 and V3 requirements are additive on top of V1 and do not replace it.

### 1.2 Scope
- **V1** — single-user expense CRUD, basic category filter, basic totals.
- **V2** — search, multi-field filtering, sorting, pagination, on top of V1.
- **V3** — analytics (spending breakdowns, trends, highlights) and budget management, on top of V1+V2.

Features from V4 onward (income, accounts, payment methods, authentication, multi-user, mobile, AI, etc.) are explicitly out of scope — see Section 13.

### 1.3 Intended Audience
Developers (human or AI-agent) implementing Expensio V1–V3, and reviewers validating each release against Section 14 (Definition of Done).

### 1.4 Definitions
- **DTO** — Data Transfer Object
- **CRUD** — Create, Read, Update, Delete
- **ORM** — Object-Relational Mapping
- **SRS** — Software Requirements Specification
- **Utilization** — percentage of a budget consumed by matching spend

---

## 2. Overall Description

### 2.1 Product Perspective
Still a single-user application — no authentication until V5. Each version is a full increment on the same live product; nothing here is throwaway/prototype work.

### 2.2 Assumptions & Constraints
- Single implicit user context, no login, in V1–V3.
- Currency is INR (₹), stored as a plain numeric amount; currency code is not modeled yet.
- Budgets in V3 are simple period-based budgets (overall, or optionally scoped to one category) — not the fully modeled multi-account system that arrives in V4.
- Deployment target: containerized (Docker), any container host; specific provider is a deployment-time decision.
- Development is done using **Google Antigravity** as the primary AI-assisted IDE. This is a tooling choice only — no Antigravity-specific files are committed to the repo.

---

## 3. Technology Stack

### 3.1 Backend
| Component | Choice | Notes |
|---|---|---|
| Language | Java 21 (LTS) | |
| Framework | Spring Boot 3.3.x | |
| Web layer | Spring Web (REST) | |
| ORM | Spring Data JPA (Hibernate) | + JPA Specifications for V2 search/filter |
| Database | PostgreSQL 16 | |
| Migrations | Flyway | one migration per schema change, never edited after merge |
| Validation | Jakarta Bean Validation | |
| Build tool | Maven | |
| Boilerplate reduction | Lombok | |
| API docs | springdoc-openapi (Swagger UI) | |
| Testing | JUnit 5, Mockito, Spring Boot Test, Testcontainers (Postgres) | |
| Logging | SLF4J + Logback | |

### 3.2 Frontend
| Component | Choice | Notes |
|---|---|---|
| Library | React 18 | |
| Build tool | Vite | |
| HTTP client | Axios | |
| Routing | React Router v6 | Dashboard / Expenses / Analytics / Budgets / NotFound |
| Styling | **Tailwind CSS v4**, utility classes over semantic CSS-variable tokens (`@theme inline`) — see Section 4 | Supersedes the plain-CSS approach from the original V1-only SRS; no inline styles, no hardcoded colors |
| Charts | Recharts | for V3 analytics (category breakdown, trend lines) |
| Fonts | **Fraunces** (headings, money display) + **Public Sans** (body/UI) | loaded via `<link>` in `index.html` `<head>` — never `@import` in CSS |
| Icons | lucide-react | consistent with token-driven, no-hardcoded-asset approach |
| State | React Context + hooks | `AppContext`, `ThemeContext`, feature hooks per domain |

### 3.3 Infrastructure
| Component | Choice |
|---|---|
| Containerization | Docker (backend, frontend images) |
| Local orchestration | `docker-compose.yml` — backend + frontend + Postgres |
| CI | GitHub Actions |
| Secrets | Environment variables only; `.env` gitignored, `.env.example` committed |

---

## 4. UI Design System

Source of truth: `Expensio_Design_System.md`. Summarized here for traceability; the design system file remains authoritative on exact token values.

### 4.1 Identity
Calm, modern, "premium-financial but light" — warm off-white paper surfaces, deep ink text, a single **teal-jade** primary accent and a **clay** counter-accent reserved for spend emphasis. No purple gradients, no glassmorphism, no heavy chrome.

### 4.2 Tokens
All values are defined once as semantic CSS variables (`oklch` color space) and consumed through Tailwind's `@theme inline` — components never hardcode a color, spacing value, radius, or shadow.

| Category | Source |
|---|---|
| Color (core, brand/intent, chart series, sidebar) | Design system §3 |
| Typography (Fraunces + Public Sans scale, tabular numerals for money) | Design system §4 |
| Spacing (4px base scale, `--space-1`…`--space-20`) | Design system §5 |
| Radius (`--radius-sm` 8px → `--radius-full` 999px) | Design system §6 |
| Shadow (`--shadow-xs` → `--shadow-lg`, warm/low-opacity) | Design system §7 |
| Motion (`--dur-fast/base/slow`, ease curves, reduced-motion respected) | Design system §8 |

### 4.3 Components required through V3
| Component | First needed in | Notes |
|---|---|---|
| Button (primary/secondary/outline/ghost/destructive/link) | V1 | |
| Card (default/stat/interactive) | V1 | `stat` variant powers Dashboard summary cards |
| Input (default/with-prefix/error) | V1 | currency prefix variant for amount fields |
| Select | V1 | category dropdown |
| Modal (dialog/confirm) | V1 | add/edit expense, delete confirmation |
| Table (default/compact, row→card below `md`) | V1 | expense list; sortable headers used from V2 |
| Loading State (skeleton/spinner/inline) | V1 | replaces the plain `Loader.jsx` placeholder |
| Error State (inline/section/page) | V1 | replaces the plain `ErrorMessage.jsx` placeholder |
| Empty State (default/filtered/first-run) | V1 | "filtered" variant used once V2 filters ship |
| Toast (info/success/warning/error) | V1 | CRUD confirmations |
| Navbar | V1 | search box wired up in V2 |
| Sidebar (expanded/rail/mobile-tabs) | V1 | nav grows as Analytics/Budgets pages arrive in V3 |
| Pagination control | V2 | page number + size + navigation |
| Chart primitives (category, trend) | V3 | thin wrapper around Recharts, tokens drive series colors (`--chart-1..5`) |
| Budget progress card | V3 | uses `--success`/`--warning`/`--destructive` for utilization state |

### 4.4 Theme
Light and dark are both first-class from V1 (`.dark` on `<html>`), with a theme toggle in the Navbar and the preference persisted client-side; system default on first load.

### 4.5 Restrictions (binding — ties to `Agents.md` rules 7–9)
- No inline styles; Tailwind utilities over tokens only.
- No hardcoded business data (amounts, categories, budget values) — always from data/props; fixtures live in a clearly named module used only in tests/storybook-equivalents, never shipped.
- No duplicated components — extend via variant, never fork.
- No hardcoded hex/rgb, no `!important`, no off-scale spacing.
- Accessibility floor: 4.5:1 body contrast, visible focus ring on every interactive element, 44px minimum touch target on mobile.

---

## 5. System Architecture

```text
┌─────────────┐      HTTPS/REST (JSON)      ┌──────────────────────┐      SQL      ┌──────────────┐
│   React SPA │  ─────────────────────────▶ │  Spring Boot Backend │ ─────────────▶│  PostgreSQL   │
│  (Vite build)│ ◀───────────────────────── │   (Layered)          │ ◀───────────── │  (Flyway)     │
└─────────────┘                              └──────────────────────┘                └──────────────┘
```

**Backend layering (unchanged through V1–V3):**
```text
Controller  →  validates HTTP input (incl. pagination/sort/filter params), delegates to Service
Service     →  business logic, orchestrates Repository + Mapper + Specification
Specification →  JPA Specifications for dynamic search/filter (V2+)
Mapper      →  Entity ↔ DTO conversion
Repository  →  Spring Data JPA + JpaSpecificationExecutor
Entity      →  JPA-mapped persistence model
```

No layer is skipped. Analytics (V3) is implemented as a read-only service composing repository queries — it does not introduce a new architectural pattern.

---

## 6. Folder Structure (detailed, standard — through V3)

This is your original structure, corrected and extended for V1–V3 scope. Nothing outside V1–V3 (Income, Accounts, Auth, etc.) is included — those arrive with their own version's SRS.

```text
expensio/
├── README.md
├── .gitignore
├── docker-compose.yml
│
├── docs/
│   ├── PRODUCT_ROADMAP.md
│   ├── Expensio_Design_System.md
│   └── SRS.md                                   # this document
│
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── README.md
│   └── src/
│       ├── main/
│       │   ├── java/com/expensio/backend/
│       │   │   ├── ExpensioApplication.java
│       │   │   │
│       │   │   ├── config/
│       │   │   │   ├── OpenApiConfig.java
│       │   │   │   └── PaginationConfig.java              # V2 — default page size, max page size
│       │   │   │
│       │   │   ├── controller/
│       │   │   │   ├── ExpenseController.java
│       │   │   │   ├── BudgetController.java               # V3
│       │   │   │   └── AnalyticsController.java             # V3
│       │   │   │
│       │   │   ├── dto/
│       │   │   │   ├── request/
│       │   │   │   │   ├── CreateExpenseRequest.java
│       │   │   │   │   ├── UpdateExpenseRequest.java
│       │   │   │   │   ├── ExpenseSearchRequest.java         # V2 — q, category, dateFrom/To, amountMin/Max, sort, page, size
│       │   │   │   │   ├── CreateBudgetRequest.java          # V3
│       │   │   │   │   └── UpdateBudgetRequest.java          # V3
│       │   │   │   │
│       │   │   │   └── response/
│       │   │   │       ├── ExpenseResponse.java
│       │   │   │       ├── ExpenseSummaryResponse.java
│       │   │   │       ├── PagedResponse.java                # V2 — generic: content, page, size, totalElements, totalPages
│       │   │   │       ├── BudgetResponse.java                # V3 — includes spent/remaining/utilizationPercent
│       │   │   │       ├── AnalyticsSummaryResponse.java      # V3 — total/average/highest/lowest
│       │   │   │       ├── CategoryBreakdownResponse.java     # V3
│       │   │   │       └── SpendingTrendResponse.java         # V3 — daily/weekly/monthly series
│       │   │   │
│       │   │   ├── entity/
│       │   │   │   ├── Expense.java
│       │   │   │   └── Budget.java                            # V3
│       │   │   │
│       │   │   ├── enums/
│       │   │   │   ├── ExpenseCategory.java
│       │   │   │   ├── SortField.java                         # V2 — DATE, AMOUNT, TITLE
│       │   │   │   ├── SortDirection.java                     # V2 — ASC, DESC
│       │   │   │   └── BudgetPeriod.java                      # V3 — MONTHLY (extensible later)
│       │   │   │
│       │   │   ├── exception/
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   ├── DuplicateBudgetException.java          # V3 — one active budget per period/category
│       │   │   │   └── ErrorResponse.java
│       │   │   │
│       │   │   ├── mapper/
│       │   │   │   ├── ExpenseMapper.java
│       │   │   │   └── BudgetMapper.java                      # V3
│       │   │   │
│       │   │   ├── repository/
│       │   │   │   ├── ExpenseRepository.java                 # extends JpaRepository + JpaSpecificationExecutor (V2)
│       │   │   │   └── BudgetRepository.java                  # V3
│       │   │   │
│       │   │   ├── specification/
│       │   │   │   └── ExpenseSpecification.java              # V2 — dynamic search/filter predicates
│       │   │   │
│       │   │   └── service/
│       │   │       ├── ExpenseService.java
│       │   │       ├── BudgetService.java                     # V3
│       │   │       └── AnalyticsService.java                  # V3
│       │   │
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── application-prod.properties
│       │       └── db/migration/
│       │           ├── V1__initial_schema.sql
│       │           ├── V2__add_search_indexes.sql
│       │           └── V3__create_budgets_table.sql
│       │
│       └── test/java/com/expensio/backend/
│           ├── controller/
│           │   ├── ExpenseControllerTest.java
│           │   ├── BudgetControllerTest.java                  # V3
│           │   └── AnalyticsControllerTest.java                # V3
│           ├── service/
│           │   ├── ExpenseServiceTest.java
│           │   ├── BudgetServiceTest.java                     # V3
│           │   └── AnalyticsServiceTest.java                   # V3
│           └── repository/
│               ├── ExpenseRepositoryTest.java
│               └── BudgetRepositoryTest.java                   # V3
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tailwind.config.js                                     # new
│   ├── postcss.config.js                                      # new
│   ├── index.html                                              # font <link> tags live here
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── README.md
│   └── src/
│       ├── assets/images/
│       │
│       ├── components/
│       │   ├── common/
│       │   │   ├── Button.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Input.jsx                                   # new — design system Input
│       │   │   ├── Select.jsx                                  # new
│       │   │   ├── Table.jsx                                   # new — generic table primitive
│       │   │   ├── Toast.jsx                                   # new
│       │   │   ├── EmptyState.jsx                               # new
│       │   │   ├── LoadingState.jsx                             # replaces Loader.jsx
│       │   │   ├── ErrorState.jsx                               # replaces ErrorMessage.jsx
│       │   │   ├── Pagination.jsx                               # new — V2
│       │   │   ├── SearchBar.jsx                                # new — V2
│       │   │   └── ThemeToggle.jsx                               # new
│       │   │
│       │   ├── expense/
│       │   │   ├── ExpenseForm.jsx
│       │   │   ├── ExpenseTable.jsx
│       │   │   ├── ExpenseCard.jsx
│       │   │   └── ExpenseFilters.jsx                           # new — V2 (category, date range, amount range)
│       │   │
│       │   ├── budget/                                          # new — V3
│       │   │   ├── BudgetForm.jsx
│       │   │   ├── BudgetCard.jsx
│       │   │   └── BudgetProgress.jsx
│       │   │
│       │   └── analytics/                                       # new — V3
│       │       ├── CategoryBreakdownChart.jsx
│       │       ├── SpendingTrendChart.jsx
│       │       └── SummaryHighlights.jsx                        # highest/lowest/average
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Expenses.jsx
│       │   ├── Analytics.jsx                                    # new — V3
│       │   ├── Budgets.jsx                                       # new — V3
│       │   └── NotFound.jsx
│       │
│       ├── layouts/
│       │   ├── MainLayout.jsx
│       │   ├── Navbar.jsx                                        # new
│       │   └── Sidebar.jsx                                        # new
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── expenseService.js
│       │   ├── budgetService.js                                  # new — V3
│       │   └── analyticsService.js                                # new — V3
│       │
│       ├── hooks/
│       │   ├── useExpenses.js
│       │   ├── useBudgets.js                                      # new — V3
│       │   ├── useAnalytics.js                                     # new — V3
│       │   └── useTheme.js                                         # new
│       │
│       ├── context/
│       │   ├── AppContext.jsx
│       │   └── ThemeContext.jsx                                    # new
│       │
│       ├── utils/
│       │   ├── formatCurrency.js
│       │   └── formatDate.js
│       │
│       ├── constants/
│       │   ├── expenseConstants.js
│       │   └── budgetConstants.js                                  # new — V3
│       │
│       ├── styles/
│       │   └── index.css                                           # Tailwind entry + @theme inline tokens
│       │
│       ├── tests/
│       │   ├── ExpenseForm.test.jsx
│       │   ├── ExpenseFilters.test.jsx                             # V2
│       │   ├── BudgetProgress.test.jsx                              # V3
│       │   └── useExpenses.test.js
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── database/
│   ├── README.md
│   └── migrations/                                                  # mirrors backend/.../db/migration for docs
│       ├── V1__initial_schema.sql
│       ├── V2__add_search_indexes.sql
│       └── V3__create_budgets_table.sql
│
├── postman/
│   ├── Expensio.postman_collection.json
│   └── Expensio.postman_environment.json
│
└── .github/workflows/ci.yml
```

**Changes from your original file, called out explicitly:**
- Fixed `components/common/Button's` → `Button.jsx`.
- Renamed `Loader.jsx` / `ErrorMessage.jsx` → `LoadingState.jsx` / `ErrorState.jsx` to match the design system's named states (they cover more variants: skeleton/spinner/inline and inline/section/page respectively).
- Everything else under `common/`, `expense/`, `pages/`, `layouts/`, `services/`, `hooks/`, `context/`, `utils/`, `constants/`, `database/`, `postman/`, `.github/` is your original structure, kept as-is, with version-scoped additions layered in (marked `# new` / `# V2` / `# V3` above) rather than restructured.

---

## 7. Functional Requirements

### 7.1 V1 — Expense Management (unchanged)
| ID | Requirement |
|---|---|
| FR-1.1 | Create an expense with title, amount, category, expense date, optional description. |
| FR-1.2 | Retrieve all expenses. |
| FR-1.3 | Retrieve a single expense by ID. |
| FR-1.4 | Update an expense's fields. |
| FR-1.5 | Delete an expense by ID. |
| FR-1.6 | Auto-populate `createdAt`/`updatedAt`, read-only via API. |
| FR-1.7 | Category restricted to enum: `FOOD, TRANSPORT, SHOPPING, BILLS, HEALTH, ENTERTAINMENT, OTHER`. |
| FR-1.8 | Basic filter by category and by date. |
| FR-1.9 | Basic summary: total amount + count. |
| FR-1.10 | Dashboard, expense list, add/edit/delete, summary, responsive layout, light+dark theme, loading/error/empty states per Section 4. |

### 7.2 V2 — Better Expense Management (new)
| ID | Requirement |
|---|---|
| FR-2.1 | Search expenses by title (and description) via a free-text query param. |
| FR-2.2 | Filter by category, date range (`dateFrom`/`dateTo`), and amount range (`amountMin`/`amountMax`), combinable with search. |
| FR-2.3 | Sort results by date, amount, or title, ascending or descending. |
| FR-2.4 | Paginate results with `page` and `size` query params; response includes total elements/pages. |
| FR-2.5 | Frontend: search box in Navbar, filter panel (category/date/amount), sort control on table headers, pagination control below the table. |
| FR-2.6 | Empty state must distinguish "no expenses yet" (first-run) from "no results for these filters" (filtered), per Section 4.3. |

### 7.3 V3 — Analytics & Budget (new)
| ID | Requirement |
|---|---|
| FR-3.1 | Provide daily, weekly, and monthly spending aggregates. |
| FR-3.2 | Provide category-wise spending breakdown. |
| FR-3.3 | Provide total spending, average spending, highest expense, lowest expense (optionally scoped by a date range). |
| FR-3.4 | Create a budget: amount, period (monthly), optional category scope. |
| FR-3.5 | Retrieve, update, and delete a budget. |
| FR-3.6 | Compute and expose budget utilization: spent, remaining, utilization percent, for the current period. |
| FR-3.7 | Reject creating a second active budget for the same period + category combination (`DuplicateBudgetException`). |
| FR-3.8 | Frontend: Analytics page with category breakdown chart and spending trend chart; Dashboard gains summary highlight cards; Budgets page with create/edit/delete and a progress card per budget (color-coded via `--success`/`--warning`/`--destructive` at configurable thresholds, e.g. <80% / 80–100% / >100%). |

---

## 8. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | p95 API response time < 300 ms for CRUD; < 800 ms for analytics aggregation queries at V3 data volumes (single user, thousands of rows). |
| NFR-2 | Reliability | Structured, consistent error responses (Section 10.4) for all failure modes; no raw stack traces to clients. |
| NFR-3 | Security | No secrets in source control; env-var config; input validated on every write endpoint; parameterized queries only (guaranteed by JPA/Specifications). |
| NFR-4 | Maintainability | Layered architecture (Section 5) strictly followed; no business logic in controllers; no SQL in services; Specifications isolated from Services. |
| NFR-5 | Usability | Destructive actions (delete expense/budget) require confirmation; filters are shareable/bookmarkable via URL query params. |
| NFR-6 | Portability | Full stack runs via `docker-compose up` with only `.env` values to supply. |
| NFR-7 | Observability | Structured request/response logging at INFO; ERROR with stack trace for unhandled exceptions only. |
| NFR-8 | Data Integrity | DB constraints mirror API validation; budgets and expenses never orphaned by a bad migration. |
| NFR-9 | Accessibility | 4.5:1 body contrast, visible focus states, 44px min touch targets — per design system §11. |
| NFR-10 | Design Consistency | No component is implemented twice; every new UI element added in V2/V3 reuses a Section 4.3 primitive or adds a documented variant to one. |

---

## 9. Database Design

### 9.1 `expenses` (V1, indexed further in V2)

| Column | Type | Constraints |
|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY GENERATED ALWAYS AS IDENTITY` |
| `title` | `VARCHAR(150)` | `NOT NULL` |
| `amount` | `NUMERIC(12,2)` | `NOT NULL`, `CHECK (amount > 0)` |
| `category` | `VARCHAR(30)` | `NOT NULL`, `CHECK (category IN (...))` |
| `expense_date` | `DATE` | `NOT NULL` |
| `description` | `VARCHAR(500)` | `NULL` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` |

```sql
-- V1__initial_schema.sql
CREATE TABLE expenses (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title          VARCHAR(150)   NOT NULL,
    amount         NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
    category       VARCHAR(30)    NOT NULL CHECK (category IN (
                        'FOOD','TRANSPORT','SHOPPING','BILLS',
                        'HEALTH','ENTERTAINMENT','OTHER')),
    expense_date   DATE           NOT NULL,
    description    VARCHAR(500),
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_expenses_category ON expenses (category);
CREATE INDEX idx_expenses_expense_date ON expenses (expense_date);
```

```sql
-- V2__add_search_indexes.sql
-- Supports title/description search and amount-range/sort queries at V2 scale.
CREATE INDEX idx_expenses_amount ON expenses (amount);
CREATE INDEX idx_expenses_title_trgm ON expenses USING gin (title gin_trgm_ops);
-- requires: CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### 9.2 `budgets` (V3, new)

| Column | Type | Constraints |
|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY GENERATED ALWAYS AS IDENTITY` |
| `period_month` | `DATE` | `NOT NULL` — first day of the budgeted month, e.g. `2026-08-01` |
| `category` | `VARCHAR(30)` | `NULL` — `NULL` = overall budget; else one `ExpenseCategory` value |
| `amount` | `NUMERIC(12,2)` | `NOT NULL`, `CHECK (amount > 0)` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` |

```sql
-- V3__create_budgets_table.sql
CREATE TABLE budgets (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    period_month   DATE           NOT NULL,
    category       VARCHAR(30)    CHECK (category IN (
                        'FOOD','TRANSPORT','SHOPPING','BILLS',
                        'HEALTH','ENTERTAINMENT','OTHER')),
    amount         NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT uq_budget_period_category UNIQUE (period_month, category)
);

CREATE INDEX idx_budgets_period_month ON budgets (period_month);
```

`UNIQUE (period_month, category)` enforces FR-3.7 at the database level (NFR-8) — note Postgres treats `NULL` as distinct per row by default, so a second `NULL`-category budget for the same month is **not** blocked by this constraint alone; the service layer must additionally check for an existing overall budget before insert.

---

## 10. API Design

**Base path:** `/api/v1`
**Format:** JSON over HTTPS · **Auth:** none through V3

### 10.1 Expenses (V1, extended in V2)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/expenses` | Create |
| `GET` | `/expenses` | List — see query params below |
| `GET` | `/expenses/{id}` | Get one |
| `PUT` | `/expenses/{id}` | Update |
| `DELETE` | `/expenses/{id}` | Delete |
| `GET` | `/expenses/summary` | Total + count (filterable) |

**Query parameters on `GET /expenses` (V1 base + V2 additions):**

| Param | Since | Notes |
|---|---|---|
| `category` | V1 | enum match |
| `date` | V1 | exact date |
| `q` | V2 | free-text search on title/description |
| `dateFrom` / `dateTo` | V2 | range filter (supersedes `date` when both present — `date` still works alone for V1 clients) |
| `amountMin` / `amountMax` | V2 | range filter |
| `sortBy` | V2 | `date` \| `amount` \| `title` |
| `sortDir` | V2 | `asc` \| `desc`, default `desc` on `date` |
| `page` / `size` | V2 | default `page=0`, `size=20`, max `size=100` |

**`GET /expenses` response (V2 onward) — `PagedResponse<ExpenseResponse>`:**
```json
{
  "content": [ { "id": 101, "title": "Grocery shopping", "amount": 1250.50, "category": "FOOD", "expenseDate": "2026-08-20", "description": "Weekly groceries", "createdAt": "2026-08-20T10:15:30Z", "updatedAt": "2026-08-20T10:15:30Z" } ],
  "page": 0,
  "size": 20,
  "totalElements": 137,
  "totalPages": 7
}
```

### 10.2 Analytics (V3, new)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/analytics/summary` | total, average, highest, lowest — filterable by `dateFrom`/`dateTo` |
| `GET` | `/analytics/breakdown` | category-wise totals — filterable by `dateFrom`/`dateTo` |
| `GET` | `/analytics/trend` | time series — `granularity=daily\|weekly\|monthly`, filterable by `dateFrom`/`dateTo` |

**`GET /analytics/summary` response:**
```json
{ "totalAmount": 38500.00, "averageAmount": 1425.93, "highestExpense": { "id": 201, "title": "Laptop repair", "amount": 6200.00 }, "lowestExpense": { "id": 88, "title": "Bus fare", "amount": 20.00 } }
```

**`GET /analytics/breakdown` response:**
```json
[ { "category": "FOOD", "totalAmount": 12500.00, "percentOfTotal": 32.5 }, { "category": "TRANSPORT", "totalAmount": 4200.00, "percentOfTotal": 10.9 } ]
```

**`GET /analytics/trend?granularity=monthly` response:**
```json
[ { "periodLabel": "2026-06", "totalAmount": 34200.00 }, { "periodLabel": "2026-07", "totalAmount": 41800.00 }, { "periodLabel": "2026-08", "totalAmount": 38500.00 } ]
```

### 10.3 Budgets (V3, new)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/budgets` | Create |
| `GET` | `/budgets` | List — filterable by `periodMonth` |
| `GET` | `/budgets/{id}` | Get one (with utilization) |
| `PUT` | `/budgets/{id}` | Update |
| `DELETE` | `/budgets/{id}` | Delete |

**`BudgetResponse`:**
```json
{
  "id": 5,
  "periodMonth": "2026-08-01",
  "category": null,
  "amount": 50000.00,
  "spent": 38500.00,
  "remaining": 11500.00,
  "utilizationPercent": 77.0,
  "createdAt": "2026-08-01T00:00:00Z",
  "updatedAt": "2026-08-20T10:15:30Z"
}
```

### 10.4 Error Response Shape (unchanged since V1)
```json
{ "timestamp": "2026-08-21T09:00:00Z", "status": 404, "error": "Not Found", "message": "Budget with id 5 not found", "path": "/api/v1/budgets/5" }
```

### 10.5 Validation Rules (cumulative)

| Field | Rule |
|---|---|
| `title` | Required, 1–150 characters |
| `amount` (expense/budget) | Required, > 0, up to 2 decimals |
| `category` | Required on expense; optional on budget (null = overall) |
| `expenseDate` | Required, not a future date |
| `description` | Optional, max 500 characters |
| `q` | Optional, max 200 characters |
| `page` | ≥ 0 |
| `size` | 1–100 |
| `periodMonth` | Required on budget, must be first-of-month date |

### 10.6 HTTP Status Codes (unchanged since V1)
`200` success · `201` created · `204` deleted · `400` validation/malformed · `404` not found · `409` conflict (duplicate budget, FR-3.7) · `500` unhandled error.

### 10.7 API Documentation
Swagger UI at `/swagger-ui.html` (non-prod profiles). Postman collection under `postman/` kept in sync and re-run manually before each release, per version.

---

## 11. Testing Strategy

### 11.1 Backend
- **Unit tests:** `ExpenseServiceTest`, `BudgetServiceTest` (mocked repositories; utilization math, duplicate-budget rejection), `AnalyticsServiceTest` (aggregation correctness against known fixtures).
- **Repository tests:** Testcontainers + real Postgres for all repositories, including `ExpenseSpecification` search/filter/sort combinations.
- **Controller tests:** MockMvc coverage for every endpoint above, including pagination edge cases (page beyond range, size > 100) and validation errors.

### 11.2 Frontend
- React Testing Library + Vitest for all new components (`ExpenseFilters`, `Pagination`, `SearchBar`, `BudgetForm`, `BudgetProgress`, chart wrappers with mocked data).
- Hook tests for `useExpenses` (with filters/sort/page state), `useBudgets`, `useAnalytics`.

### 11.3 Manual / Integration
Postman collection run against `docker-compose up` before every release; each version's run must additionally exercise that version's new endpoints end-to-end.

---

## 12. CI/CD (`.github/workflows/ci.yml`, unchanged shape since V1)

```text
Push / PR → Backend: mvn verify (unit + repository via Testcontainers)
          → Frontend: npm ci → lint → test → build
          → Docker image build (backend + frontend)
          → (Manual/tagged) Deploy
```

No deploy on every push to `main` — release is tag-triggered, per `Agents.md` rule 12 and roadmap §19 Git standards.

---

## 13. Out of Scope Through V3

Explicitly deferred — do not implement ahead of schedule:

- Income, accounts, payment methods, transactions (V4)
- Authentication, multi-user, RBAC (V5)
- Advanced/professional web UX polish beyond the design system baseline (V6)
- Mobile application (V7)
- Recurring transactions, file attachments, notifications (V8)
- Caching, queues, async processing, load testing (V9)
- OWASP/VAPT-level security hardening (V10)
- Any AI/LLM feature (V11+)

---

## 14. Production Release Criteria (Definition of Done, per version)

A version is released only when:

- [ ] All FRs for that version implemented and manually verified
- [ ] Migrations apply cleanly, in order, on a fresh database
- [ ] Backend unit, repository, and controller tests pass
- [ ] Frontend component/hook tests pass
- [ ] Postman collection run passes end-to-end, including that version's new endpoints
- [ ] Swagger docs reflect the live API
- [ ] No secrets in the repository
- [ ] CI pipeline passes on the release branch
- [ ] Docker images build and run via `docker-compose`
- [ ] Deployed and smoke-tested in production
- [ ] `docs/SRS.md` and `README.md` updated to reflect the delivered state
- [ ] (V2+) Design system compliance spot-checked: no hardcoded colors/spacing, all new components reuse Section 4.3 primitives

---

## 15. Open Items Requiring Follow-Up

1. Add `docker-compose.yml` at repo root (backend + frontend + Postgres) — still not created.
2. Confirm Flyway's `spring.flyway.locations` points at a single source of truth; `database/migrations/` and `backend/.../db/migration/` must stay identical or one should be removed in favor of the other.
3. Choose the production deployment target so `ci.yml`'s deploy step and `application-prod.properties` can be finalized.
4. Add ESLint/Prettier (frontend) and Checkstyle/Spotless (backend) configs so `Agents.md` rules 7–8 are mechanically enforced, not just documented.
5. Decide the exact utilization-threshold color bands for `BudgetProgress` (this SRS assumes <80% success / 80–100% warning / >100% destructive as a starting point — confirm before implementing).
6. Confirm `pg_trgm` extension is permitted on the target Postgres host before `V2__add_search_indexes.sql` runs in production.
