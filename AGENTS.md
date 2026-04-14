# AGENTS.md — Victoria Motors ERP Demo

## What This Is

Client-side-only demo app for Victoria Motors (Vietnamese electric motorcycle manufacturer). **Not production code.** Priority: looks professional, realistic data, smooth flows. No auth, no backend, no tests.

## Reference Docs (READ BEFORE WORKING)

- `CONTEXT.md` — Full requirements, data model, scope tiers, business context
- `ARCHITECTURE.md` — Tech stack, project structure, state architecture, implementation phases
- `STYLE-GUIDE.md` — Google-inspired design system, color tokens, component specs, page layouts

These three files are the **source of truth**. When in doubt, trust them over this file.

## Stack & Key Decisions

| What | Choice | Gotcha |
|---|---|---|
| Framework | Next.js App Router, `output: 'export'` | Static SPA — every page must be `'use client'`. No API routes, no SSR. |
| UI | shadcn/ui + Tailwind v4 + lucide-react | shadcn components in `src/components/ui/` — do NOT hand-edit these |
| State | Zustand + `persist` middleware | localStorage key: `victoria-motors-erp`. Hydration guard required. |
| Tables | TanStack Table via shadcn DataTable | Primary UI component — used on 8+ pages |
| Forms | react-hook-form + zod | All CRUD via Dialog modals |
| Toast | sonner | Not shadcn toast — use sonner directly |
| Font | Be Vietnam Pro (`next/font/google`, `subsets: ['vietnamese']`) | 14px base, weights 400/500/600 only |
| IDs | nanoid | Not uuid |
| Dates | date-fns + locale/vi | Vietnamese date formatting |

## Critical Architecture Rules

1. **Stock = SUM(movements)**. Never store stock levels separately. Always derive from `StockMovement` records grouped by `itemId`.
2. **No dynamic routes.** BOM detail uses dialog or query params from list page.
3. **Vietnamese UI, English code.** All user-facing text in Vietnamese. Variables, comments, code in English.
4. **Seed data must be realistic.** Real Victoria Motors model names: PASSION, ROYAL, V38 PRO, VIRAL PRO, V68-3, VIRAL S2. Real part names from `extracted-data-curated.json`.
5. **Reset button** must restore all state to initial seed data. Protected by AlertDialog.

## Commands

```bash
npm run dev          # Dev server
npm run build        # Static export → out/
npm run lint         # ESLint
```

## Folder Structure

```
src/
├── app/             # Pages (all 'use client')
├── components/
│   ├── ui/          # shadcn/ui generated (DO NOT edit)
│   ├── layout/      # sidebar, header, hydration-guard
│   ├── data-table/  # Reusable DataTable wrapper
│   ├── shared/      # confirm-dialog, item-select, bom-select, reset-button
│   └── {feature}/   # items/, bom/, stock/, receipt/, issue/, capacity/, movements/
├── store/
│   ├── index.ts     # Combined Zustand store (useBoundStore)
│   ├── slices/      # item-slice, bom-slice, movement-slice, ui-slice
│   └── selectors.ts # Derived: getStockMap, getProductionCapacity, getLowStockItems
├── data/
│   ├── seed/        # Hardcoded seed data (items, boms, movements)
│   └── constants.ts # Category list, unit list, model names
├── lib/             # utils.ts (cn), format.ts (VN formatting), id.ts (nanoid)
└── types/           # index.ts — Item, BOM, BOMVersion, BOMLine, StockMovement
```

## Seed Data Source

`extracted-data-curated.json` contains ~80 curated items from client's real Excel files. Use this as the basis for seed data — transform into TypeScript seed files with proper SKU codes and category mapping.

Categories from extraction: Động cơ, Khung sườn, Ốc vít/Bu lông, Điện/Đèn, Nhựa/Vỏ, Gioăng/Phớt, Phụ kiện, Khác.

## Style Quick Reference

- **Colors**: Google-inspired. Primary `#1a73e8`, surfaces white/`#f8f9fa`, borders `#dadce0`. See `STYLE-GUIDE.md` §2 for full palette.
- **Cards**: Flat (border only, no shadow). Shadow only on floating elements (dialogs, popovers).
- **Tables**: No zebra stripes. Hover highlight. Header bg `#f8f9fa`. Numbers right-aligned + `tabular-nums`.
- **Buttons**: 36px height default, 28px small. Max 1 primary button per section.
- **Spacing**: 4px base grid. Card padding 16px. Content area padding 24px top, 32px horizontal.

## Implementation Phases

| Phase | Scope |
|---|---|
| 0 | Scaffold: create-next-app, shadcn/ui, deps, layout shell, font, hydration guard |
| 1 | Types + seed data + Zustand store + selectors + DataTable |
| 2 | Item Master CRUD |
| 3 | Production BOM + versioning |
| 4 | Current Stock + Goods Receipt |
| 5 | Goods Issue + Movement Log |
| 6 | Production Capacity Calculator (wow moment) |
| 7 | Purchase BOM |
| 8-11 | Tier 2: Adjustment, UoM, Alerts, Dashboard |
| 12 | Tier 3: Mobile + OCR mockups |

## Don'ts

- Don't add authentication, authorization, or complex error boundaries
- Don't write tests (demo app)
- Don't use `as any` or `@ts-ignore`
- Don't use shadows on non-floating elements
- Don't use icon libraries other than lucide-react
- Don't store stock levels — always derive from movements
- Don't use 16px base font — this app uses 14px
- Don't over-engineer. Ship fast, look professional.
