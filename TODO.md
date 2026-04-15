# Victoria Motors ERP Demo — Remaining Tasks

## Completed (Phases 0–11, Tier 1 + Tier 2)

- [x] Phase 0: Scaffold (Next.js, shadcn/ui, Tailwind v4, font, theme, layout shell)
- [x] Phase 1: Types + seed data + Zustand store + selectors + DataTable
- [x] Phase 2: Item Master CRUD
- [x] Phase 3: Production BOM + versioning + line editor
- [x] Phase 4: Current Stock + Goods Receipt (by BOM + individual)
- [x] Phase 5: Goods Issue + Movement Log
- [x] Phase 6: Production Capacity Calculator
- [x] Phase 7: Purchase BOM (full CRUD, detail/version dialogs, linked to receipt flow)
- [x] Phase 8: Stock Adjustment (select item, +/- quantity, mandatory reason)
- [x] Phase 10+11: Dashboard (stat cards, low stock alerts, recent movements, capacity overview)
- [x] Polish: Reset button wired to resetToSeedData() with AlertDialog confirmation

## Skipped

### Phase 9: UoM Conversion
- Low demo value vs implementation effort
- Data model supports it (Item.uomConversions exists), but receipt/issue flows don't convert yet
- Can be added later if needed for the demo presentation

## Remaining (Tier 3)

### Phase 12: Mobile + OCR Mockups
- [ ] `/mobile` — Static mobile worker interface mockup (receive pick list, tick items)
- [ ] `/ocr` — Static OCR scan mockup (camera UI, sample OCR result)

## Polish & Cleanup
- [ ] Refactor pages to use shared DataTable component (currently inline tables)
- [ ] Add category filter to items page
- [ ] Full visual audit pass against STYLE-GUIDE.md (partial audit done — spacing fixed)
- [ ] Verify golden path: create item → add to BOM → receive → capacity check → issue → movement log
- [ ] Vercel deployment test
