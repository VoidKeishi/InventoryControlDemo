# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A **client-side-only demo app** for Victoria Motors, a Vietnamese electric motorcycle manufacturer. It demonstrates an ERP inventory/BOM management solution to non-technical stakeholders. There is no backend, no database, no authentication. All state lives in Zustand + localStorage. Seed data is hardcoded and resettable.

**UI language is Vietnamese. Code and comments are English.**

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Static export to out/ (output: 'export')
npm run lint         # ESLint
```

No test suite exists — this is a demo, not production software.

## Tech Stack

Next.js 16 App Router (static export) | React 19 | TypeScript | Tailwind CSS v4 | shadcn/ui | Zustand (persist middleware, localStorage) | TanStack Table | react-hook-form + zod | sonner (toasts) | date-fns (Vietnamese locale) | lucide-react | nanoid

Font: Be Vietnam Pro (vietnamese + latin subsets, weights 400/500/600).

## Architecture

### State: Single Zustand Store

`src/store/index.ts` — `useBoundStore` combines four slices:

| Slice | Persisted | What |
|---|---|---|
| `itemSlice` | Yes | Items (materials/parts) CRUD |
| `bomSlice` | Yes | BOMs (purchase + production) CRUD + versioning |
| `movementSlice` | Yes | Stock movements (receipt/issue/adjustment) |
| `uiSlice` | No | Sidebar state, modals |

localStorage key: `victoria-motors-erp`. Hydration guard (`src/components/layout/hydration-guard.tsx`) shows skeleton until `_hasHydrated` is true.

**Stock levels are never stored.** They are always derived: `SUM(movements.quantity) GROUP BY itemId`. See `src/store/selectors.ts` for `getStockMap()`, `getStockByItemId()`, `getLowStockItems()`, and `getProductionCapacity()`.

`resetToSeedData()` replaces all persisted state with seed data from `src/data/seed/`.

### Routing

All pages are `'use client'` (static export). No dynamic routes — detail views use dialogs or query params. Root layout (`src/app/layout.tsx`) wraps everything with sidebar + content area + toast provider + hydration guard.

Pages: `/` (dashboard), `/items`, `/bom`, `/stock`, `/receipt`, `/issue`, `/movements`, `/capacity`, `/adjustment`, `/mobile` (Tier 3), `/ocr` (Tier 3).

### Data Model

Types in `src/types/index.ts`: `Item`, `BOM`, `BOMVersion`, `BOMLine`, `StockMovement`.

- **BOM** has `type: "purchase" | "production"` and versioned line items. Editing creates a new version.
- **StockMovement** quantity is signed: positive = receipt, negative = issue/adjustment decrease.
- **Item** has `minStock` for low-stock alerts and `uomConversions` (defined but not yet used in flows).

Seed data and constants live in `src/data/`. Categories, units, vehicle models in `src/data/constants.ts`.

### Component Organization

- `src/components/ui/` — shadcn/ui generated components. **Do not hand-edit.**
- `src/components/layout/` — Sidebar, header, hydration guard.
- `src/components/data-table/` — Reusable DataTable wrapper (TanStack Table).
- `src/components/{items,bom,stock,receipt,issue,capacity,movements,shared}/` — Feature-specific components.
- `src/components/shared/` — Cross-feature components (confirm dialog, item/bom selectors, reset button).

### Key Flows

- **Goods Receipt**: Select Purchase BOM -> review/edit quantities -> confirm -> creates positive movements.
- **Goods Issue**: Select Production BOM + vehicle count -> system calculates materials needed -> sufficiency check -> confirm -> creates negative movements.
- **Production Capacity**: Select vehicle model -> `getProductionCapacity()` calculates `min(floor(stock/qty))` across all BOM lines -> shows max producible count + bottleneck item.

## Style Guide (Summary)

Full details in `STYLE-GUIDE.md`. Key points:

- **Google-inspired minimal design**: white surfaces, `#1a73e8` blue for interactive elements, borders not shadows on cards.
- **Base font**: 14px. Only weights 400/500/600. `tabular-nums` on all numeric displays.
- **Spacing**: 4px base grid. Content area padding: 24px top, 32px horizontal.
- **Data tables**: White rows, `#f8f9fa` header, hover highlight, no zebra stripes. Action buttons visible on hover only.
- **Destructive actions**: Always behind AlertDialog confirmation. Destructive button is rightmost.
- **Toasts**: sonner, bottom-right. Success/error/warning/info with colored left border.
- **Icons**: Lucide React only, 18px default.
- **No shadows on flat cards** — use 1px `#dadce0` borders. Shadows only on floating elements (dialogs, popovers).

## Current Status

Phases 0-8, 10-11 complete (Item Master, Production BOM, Purchase BOM, Stock, Receipt, Issue, Movements, Capacity Calculator, Stock Adjustment, Dashboard). Phase 9 (UoM Conversion) skipped.

**Remaining work (Phase 12 + Polish):**
- `/mobile` — Static mobile worker interface mockup (receive pick list, tick items)
- `/ocr` — Static OCR scan mockup (camera UI, sample OCR result)
- Refactor inline tables to use shared DataTable component
- Add category filter to items page
- Full visual audit against STYLE-GUIDE.md
- Verify golden path: create item -> add to BOM -> receive -> capacity check -> issue -> movement log
- Vercel deployment test
