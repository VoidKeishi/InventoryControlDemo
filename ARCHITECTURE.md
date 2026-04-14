# Victoria Motors ERP Demo — Architecture & Implementation Plan

> Reference document for all agents working on this project. See `CONTEXT.md` for full requirements.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js App Router + `output: 'export'` (static SPA) |
| UI | shadcn/ui (Tailwind v4) + lucide-react icons |
| State | Zustand + `persist` middleware (localStorage) |
| Tables | TanStack Table via shadcn/ui DataTable |
| Forms | react-hook-form + zod |
| Toasts | sonner |
| Font | Be Vietnam Pro (`next/font/google`, `subsets: ['vietnamese']`) |
| IDs | nanoid |
| Dates | date-fns + locale/vi |
| Deploy | Vercel (static export) |

## Project Structure

```
src/
├── app/                          # Next.js App Router (all pages 'use client')
│   ├── layout.tsx                # Root layout: sidebar + content + toast + hydration guard
│   ├── page.tsx                  # Dashboard
│   ├── items/page.tsx            # Item Master CRUD
│   ├── bom/page.tsx              # BOM listing (production + purchase, tabbed)
│   ├── stock/page.tsx            # Current Stock view
│   ├── receipt/page.tsx          # Goods Receipt (by BOM + individual)
│   ├── issue/page.tsx            # Goods Issue (by Production BOM + individual)
│   ├── movements/page.tsx        # Stock Movement Log
│   ├── capacity/page.tsx         # Production Capacity Calculator
│   ├── adjustment/page.tsx       # Stock Adjustment
│   ├── mobile/page.tsx           # Tier 3: Mobile worker mockup
│   └── ocr/page.tsx              # Tier 3: OCR scan mockup
│
├── components/
│   ├── ui/                       # shadcn/ui generated components (DO NOT hand-edit)
│   ├── layout/
│   │   ├── sidebar.tsx           # Navigation sidebar (collapsible)
│   │   ├── header.tsx            # Page header
│   │   └── hydration-guard.tsx   # Skeleton until localStorage rehydrates
│   ├── data-table/               # Reusable DataTable wrapper + pagination + toolbar
│   ├── items/                    # Item columns, form, category badge
│   ├── bom/                      # BOM columns, form, version selector, line editor
│   ├── stock/                    # Stock columns, level badge
│   ├── receipt/                  # Receipt by-bom and individual flows
│   ├── issue/                    # Issue by-bom and individual flows
│   ├── capacity/                 # Calculator, bottleneck display, detail table
│   ├── movements/                # Movement columns, type badge
│   └── shared/                   # confirm-dialog, item-select, bom-select, reset-button
│
├── store/
│   ├── index.ts                  # Combined Zustand store (useBoundStore)
│   ├── slices/
│   │   ├── item-slice.ts         # items: Item[], CRUD actions
│   │   ├── bom-slice.ts          # boms: BOM[], CRUD + version actions
│   │   ├── movement-slice.ts     # movements: StockMovement[], add/bulk-add
│   │   └── ui-slice.ts           # UI-only state (NOT persisted)
│   └── selectors.ts              # getStockByItemId, getStockMap, getLowStockItems, getProductionCapacity
│
├── data/
│   ├── seed/                     # items.ts, boms.ts, movements.ts, index.ts
│   └── constants.ts              # Categories, units, model names
│
├── lib/
│   ├── utils.ts                  # cn() + helpers
│   ├── format.ts                 # Vietnamese number/date formatting
│   └── id.ts                     # nanoid wrapper
│
└── types/
    └── index.ts                  # Item, BOM, BOMVersion, BOMLine, StockMovement
```

**No dynamic routes** — BOM detail uses query params or dialog pattern from list page.

## Data Model

```typescript
interface Item {
  id: string;              // SKU code, e.g. "M001"
  name: string;
  unit: string;            // primary: "cái", "mét", "kg", "cuộn", "bộ", "tấm", "lít"
  category: string;        // "Ốc vít", "Khung sườn", "Động cơ", "Pin/Ắc quy", "Dây điện", "Nhựa", "Phụ kiện", "Khác"
  minStock: number | null;
  uomConversions: { unit: string; factor: number }[];
}

interface BOM {
  id: string;
  type: "purchase" | "production";
  name: string;
  description: string;
  currentVersion: number;
  versions: BOMVersion[];
}

interface BOMVersion {
  version: number;
  createdAt: string;
  note: string;
  lines: BOMLine[];
}

interface BOMLine {
  itemId: string;
  quantity: number;
  unit: string;
  note: string;
}

interface StockMovement {
  id: string;
  itemId: string;
  type: "receipt" | "issue" | "adjustment";
  quantity: number;        // + = receipt, - = issue/decrease
  bomId: string | null;
  bomVersion: number | null;
  reason: string;
  createdAt: string;
  createdBy: string;
}
// Stock level = SUM(movements.quantity) GROUP BY itemId — NEVER stored separately
```

## State Architecture

**Zustand store** with `persist` middleware, localStorage key: `victoria-motors-erp`.

| Slice | Persisted | Key Actions |
|---|---|---|
| itemSlice | Yes | addItem, updateItem, deleteItem |
| bomSlice | Yes | addBOM, updateBOM, addBOMVersion, deleteBOM |
| movementSlice | Yes | addMovement, addBulkMovements |
| uiSlice | No | sidebarOpen, activeModal |

**Selectors** (derived, never stored):
- `getStockByItemId(itemId)` — SUM of movements
- `getStockMap()` — all stock levels
- `getLowStockItems()` — items below minStock
- `getProductionCapacity(bomId)` — min(floor(stock/qty)) across BOM lines = max producible vehicles + bottleneck

**Reset**: `resetToSeedData()` replaces all state with seed data. Protected by AlertDialog.

**Hydration**: `<HydrationGuard>` shows skeleton until `persist.hasHydrated()` is true.

## Sidebar Navigation

```
TỔNG QUAN: Dashboard
KHO HÀNG: Tồn kho hiện tại, Nhập kho, Xuất kho, Điều chỉnh kho, Lịch sử xuất/nhập
VẬT LIỆU & BOM: Danh sách vật liệu, BOM Sản xuất, BOM Mua hàng
CÔNG CỤ: Tính năng lực sản xuất [star]
DEMO: Giao diện mobile, Scan hoá đơn (OCR)
[Reset dữ liệu demo]
```

## Seed Data

- **~40-60 items**: Realistic Vietnamese motorcycle parts across 8 categories
- **6 Production BOMs**: PASSION, ROYAL, V38 PRO, VIRAL PRO, V68-3, VIRAL S2 (15-25 lines each)
- **2-3 Purchase BOMs**: Supplier orders (8-15 items each)
- **Initial movements**: Receipt records for non-zero starting stock

## Implementation Order

| Phase | What | Tier |
|---|---|---|
| 0 | Scaffold: create-next-app, shadcn/ui, deps, layout shell, font, hydration guard | Setup |
| 1 | Types + seed data + Zustand store + selectors + DataTable component | Data |
| 2 | Item Master (CRUD, search, categorize) | T1 |
| 3 | Production BOM (list + detail + versioning + line editor) | T1 |
| 4 | Current Stock + Goods Receipt (by BOM + individual) | T1 |
| 5 | Goods Issue + Movement Log | T1 |
| 6 | Production Capacity Calculator | T1 |
| 7 | Purchase BOM (type filter + receipt link) | T1 |
| 8 | Stock Adjustment | T2 |
| 9 | UoM conversion in receipt/issue | T2 |
| 10 | Min Stock Alert | T2 |
| 11 | Dashboard (overview, alerts, recent, capacity summary) | T2 |
| 12 | Mobile mockup + OCR mockup | T3 |

## Key UX Notes

- **Capacity Calculator** is the "wow moment" — hero number, bottleneck callout, color-coded detail table
- **All CRUD** via Dialog modals (shadcn/ui Dialog + react-hook-form + zod)
- **Goods Issue by BOM**: select model + count -> show sufficiency table -> confirm -> deduct
- **Goods Receipt by BOM**: select BOM -> editable quantity review -> confirm -> add stock
- **Toasts**: sonner (green=success, yellow=warning, red=error)
- **Destructive actions**: AlertDialog confirmation
- **Language**: Vietnamese UI, English code/comments

## Config

```ts
// next.config.ts
const nextConfig: NextConfig = { output: 'export' }
```

## Verification Checklist

1. `npm run build` produces `out/` directory
2. No hydration flash on page load
3. Golden path: create item -> add to BOM -> receive -> capacity check -> issue -> movement log
4. Reset restores seed data
5. localStorage persists across refresh
6. Vietnamese diacriticals render correctly
7. Vercel preview deployment works
