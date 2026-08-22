# Expensio — Design System

Expense tracker. Calm, modern, premium-financial — but light, airy and a bit unexpected: warm off-white paper surfaces, deep ink text, and a single confident **teal-jade** accent with a **clay** counter-accent for spend. No purple gradients, no heavy chrome, no glassmorphism.

---

## 1. Style

| Aspect | Decision |
| --- | --- |
| Mood | Quiet premium, editorial, "receipt paper meets private bank app" |
| Density | Comfortable — generous whitespace, low border weight (1px), soft shadows |
| Depth | Flat surfaces + subtle elevation only for floating UI (modal, dropdown, toast) |
| Signature move | Money figures set in tabular numerals, oversized, with a thin accent underline |
| Anti-goals | Neon glow, dark-glass fintech clichés, purple/indigo gradients, drop-shadow stacking |

---

## 2. Layout

Responsive desktop + mobile, single canonical shell.

```text
Desktop >= 1024px                     Mobile < 768px
┌──────┬────────────────────────┐     ┌───────────────┐
│ Side │ Navbar                 │     │ Navbar        │
│ bar  ├────────────────────────┤     ├───────────────┤
│ 264  │ Page (max-w 1200, p-8) │     │ Page (p-4)    │
│ px   │  summary cards grid    │     │  stacked      │
│      │  chart + table         │     │  cards → list │
└──────┴────────────────────────┘     ├───────────────┤
                                      │ Bottom tabs   │
                                      └───────────────┘
```

- Breakpoints: `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`
- Content grid: 12 columns desktop, 4 columns mobile, gutter `--space-6`
- Sidebar collapses to icon rail at `lg`, becomes bottom tab bar below `md`
- Tables become stacked "row cards" below `md` — never horizontal scroll for primary data

---

## 3. Color tokens

All colors are `oklch`, exposed as semantic CSS variables in `src/styles.css` and mapped in `@theme inline`. Components never hardcode colors.

### Core semantics

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--background` | `oklch(0.985 0.006 95)` | `oklch(0.175 0.012 250)` | App canvas (warm paper / deep ink) |
| `--foreground` | `oklch(0.215 0.02 250)` | `oklch(0.965 0.005 95)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.215 0.014 250)` | Surfaces |
| `--card-foreground` | `oklch(0.215 0.02 250)` | `oklch(0.96 0.005 95)` | Text on surfaces |
| `--popover` / `--popover-foreground` | same as card | same as card | Floating surfaces |
| `--muted` | `oklch(0.955 0.008 95)` | `oklch(0.255 0.012 250)` | Subtle fills, table zebra |
| `--muted-foreground` | `oklch(0.535 0.018 250)` | `oklch(0.715 0.014 250)` | Secondary text, labels |
| `--border` | `oklch(0.905 0.008 95)` | `oklch(1 0 0 / 12%)` | Hairlines |
| `--input` | `oklch(0.925 0.008 95)` | `oklch(1 0 0 / 16%)` | Field borders |
| `--ring` | `oklch(0.62 0.11 178)` | `oklch(0.70 0.10 178)` | Focus ring |

### Brand & intent

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--primary` | `oklch(0.52 0.105 178)` | `oklch(0.72 0.105 178)` | Teal-jade: primary actions, active nav |
| `--primary-foreground` | `oklch(0.99 0.004 178)` | `oklch(0.19 0.02 250)` | Text on primary |
| `--secondary` | `oklch(0.945 0.014 95)` | `oklch(0.27 0.014 250)` | Secondary buttons, chips |
| `--secondary-foreground` | `oklch(0.28 0.02 250)` | `oklch(0.95 0.005 95)` | Text on secondary |
| `--accent` | `oklch(0.66 0.13 48)` | `oklch(0.74 0.12 48)` | Clay: spend emphasis, highlights |
| `--accent-foreground` | `oklch(0.20 0.02 48)` | `oklch(0.18 0.02 48)` | Text on accent |
| `--success` | `oklch(0.60 0.13 155)` | `oklch(0.72 0.13 155)` | Income, under budget |
| `--warning` | `oklch(0.75 0.14 82)` | `oklch(0.82 0.14 82)` | Near budget limit |
| `--destructive` | `oklch(0.575 0.19 25)` | `oklch(0.69 0.17 25)` | Delete, over budget |
| `--destructive-foreground` | `oklch(0.99 0.004 25)` | `oklch(0.99 0.004 25)` | Text on destructive |

### Data visualisation (category series)

| Token | Light | Dark |
| --- | --- | --- |
| `--chart-1` | `oklch(0.60 0.11 178)` | `oklch(0.72 0.11 178)` |
| `--chart-2` | `oklch(0.66 0.13 48)` | `oklch(0.76 0.12 48)` |
| `--chart-3` | `oklch(0.62 0.12 155)` | `oklch(0.74 0.11 155)` |
| `--chart-4` | `oklch(0.70 0.13 82)` | `oklch(0.80 0.12 82)` |
| `--chart-5` | `oklch(0.55 0.09 250)` | `oklch(0.70 0.09 250)` |

Sidebar tokens (`--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`) mirror the surface scale one step darker than `--background` in light mode, one step lighter in dark mode.

---

## 4. Typography

| Role | Family | Token | Size / Line | Weight | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (balance) | Fraunces | `--text-display` | 48 / 52 | 600 | -0.02em |
| H1 page title | Fraunces | `--text-h1` | 32 / 38 | 600 | -0.015em |
| H2 section | Fraunces | `--text-h2` | 24 / 30 | 600 | -0.01em |
| H3 card title | Public Sans | `--text-h3` | 18 / 26 | 600 | 0 |
| Body | Public Sans | `--text-body` | 15 / 24 | 400 | 0 |
| Body small | Public Sans | `--text-sm` | 13 / 20 | 400 | 0 |
| Label / overline | Public Sans | `--text-label` | 11 / 16 | 600 | 0.08em, uppercase |
| Numeric / money | Public Sans (tabular) | `--text-num` | inherits | 500–600 | 0, `font-variant-numeric: tabular-nums` |

- Two families only: **Fraunces** (soft serif) for headings and money display, **Public Sans** for everything else.
- Loaded via `<link>` in `src/routes/__root.tsx` head — never `@import` in CSS.
- Mobile scales display down one step (`40 / 44`).

---

## 5. Spacing tokens

4px base scale: `--space-1 4` · `2 8` · `3 12` · `4 16` · `5 20` · `6 24` · `8 32` · `10 40` · `12 48` · `16 64` · `20 80`

| Context | Value |
| --- | --- |
| Inline gap (icon ↔ label) | `--space-2` |
| Control padding (md) | `--space-3` / `--space-4` |
| Card padding | `--space-6` |
| Section rhythm | `--space-10` |
| Page padding | `--space-4` mobile · `--space-8` desktop |

---

## 6. Border radius tokens

`--radius: 0.75rem` base.

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 8px | Chips, badges, checkbox |
| `--radius-md` | 10px | Inputs, select, buttons |
| `--radius-lg` | 12px | Cards, toasts |
| `--radius-xl` | 16px | Modals, panels |
| `--radius-full` | 999px | Avatars, pills, toggles |

---

## 7. Shadow tokens

Warm, low-opacity, single-layer where possible. Dark mode reduces spread and leans on borders.

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-xs` | `0 1px 2px oklch(0.25 0.02 250 / 0.05)` | Buttons hover |
| `--shadow-sm` | `0 1px 3px oklch(0.25 0.02 250 / 0.07), 0 1px 2px oklch(0.25 0.02 250 / 0.04)` | Cards |
| `--shadow-md` | `0 6px 16px oklch(0.25 0.02 250 / 0.09)` | Dropdown, popover, toast |
| `--shadow-lg` | `0 20px 48px oklch(0.25 0.02 250 / 0.16)` | Modal |
| `--shadow-focus` | `0 0 0 3px oklch(0.62 0.11 178 / 0.28)` | Focus ring |

---

## 8. Motion

| Token | Value |
| --- | --- |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--dur-fast` | 120ms (hover, press) |
| `--dur-base` | 200ms (fade, dropdown, toast) |
| `--dur-slow` | 320ms (modal, sheet, route transition) |

Rules: fade + 4–8px translate only; numbers count up on first paint (`--dur-slow`); skeleton shimmer 1.4s linear; no bounce, no parallax; all motion disabled under `prefers-reduced-motion`.

---

## 9. Components

One implementation per component, variants via tokens — never a second copy.

| Component | Variants | Sizes | Notes |
| --- | --- | --- | --- |
| **Button** | `primary`, `secondary`, `outline`, `ghost`, `destructive`, `link` | `sm 32` · `md 40` · `lg 48` · `icon` | Loading state swaps label for spinner, width preserved |
| **Card** | `default`, `stat`, `interactive` | — | `stat` = label + tabular money + delta chip; `interactive` lifts to `--shadow-md` |
| **Input** | `default`, `with-prefix` (currency), `error` | `sm`, `md` | Label above, helper/error text below, `aria-invalid` bound to error |
| **Select** | `default`, `error` | `sm`, `md` | Native trigger + popover list, keyboard nav, checkmark on selected |
| **Modal** | `dialog`, `confirm`, `sheet` (mobile) | `sm 420` · `md 560` · `lg 720` | Focus trap, ESC + overlay close, sheet slides from bottom under `md` |
| **Table** | `default`, `compact` | — | Sticky header, zebra `--muted`, right-aligned tabular amounts, sortable headers, row → card below `md` |
| **Navbar** | `app` | 64px | Left: page title. Right: search, currency switcher, theme toggle, avatar menu |
| **Sidebar** | `expanded`, `rail`, `mobile-tabs` | 264 / 72 px | Active item: `--sidebar-accent` fill + 2px `--primary` left marker |
| **Toast** | `info`, `success`, `warning`, `error` | — | Bottom-right desktop, top mobile, 4s auto-dismiss, max 3 stacked |
| **Empty State** | `default`, `filtered`, `first-run` | — | Line illustration, one-line reason, single primary action |
| **Loading State** | `skeleton`, `spinner`, `inline` | — | Skeleton mirrors final layout dimensions; spinner only for <1s actions |
| **Error State** | `inline`, `section`, `page` | — | Plain-language cause + Retry; never a raw stack trace |

### App surfaces using them
Dashboard (stat cards + category chart + recent table) · Transactions (filter bar + table) · Budgets (progress cards) · Add/Edit Expense (modal form) · Settings (sections + toggles).

---

## 10. Theme

- Light and dark are both first-class; `.dark` on `<html>`.
- Every color is a token — no `text-white`, `bg-black`, `bg-[#…]` anywhere.
- Dark mode raises chroma on `--primary` / `--accent` and drops shadow opacity, relying on `--border` for separation.
- Preference stored per user; system default on first load.

---

## 11. Restrictions

- **No inline styles** — Tailwind utilities over semantic tokens only.
- **No hardcoded business data** — amounts, categories, budgets, currencies all come from data/props; mock data lives in a clearly named fixtures module.
- **No duplicated UI components** — extend an existing component with a variant instead of forking it.
- No hardcoded hex/rgb colors, no `!important`, no arbitrary one-off spacing values outside the scale.
- Accessibility floor: 4.5:1 body contrast, visible focus on every interactive element, 44px minimum touch target on mobile.
