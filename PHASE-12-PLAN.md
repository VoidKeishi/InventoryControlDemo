# Phase 12: Mobile + OCR Mockups — Implementation Plan

## Context

Phase 12 is the final implementation phase of the Victoria Motors ERP demo. Phases 0-11 delivered all functional features (Item Master, BOM CRUD, Stock Receipt/Issue, Capacity Calculator, Dashboard). Phase 12 adds two **static UI-only mockup pages** (Tier 3) that demonstrate future mobile and OCR capabilities to non-technical stakeholders. These pages use hardcoded data and do not need real backend integration — they exist purely to help the client envision the full product.

Both routes (`/mobile`, `/ocr`) already exist as minimal placeholders showing "Tính năng đang phát triển" and are linked in the sidebar under the DEMO section.

---

## Page 1: `/mobile` — Mobile Worker Interface

### Concept

A warehouse worker receives a "phiếu xuất" (pick list) on their phone, sees items to collect, and ticks them off as they go. Demoed on laptop, so the UI is rendered **inside a phone-shaped bezel frame** to visually communicate "this is a mobile app."

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Giao diện mobile                           (Header)    │
│─────────────────────────────────────────────────────────│
│  Mô phỏng giao diện nhân viên kho trên điện thoại...   │
│                                                         │
│              ┌─────────────────────┐                    │
│              │ ╭─  phone notch  ─╮ │                    │
│              │ ┌───────────────────┐│                    │
│              │ │ PHIẾU XUẤT KHO   ││ <- blue header     │
│              │ │ PASSION — 5 chiếc ││                    │
│              │ │ 15/04/2026        ││                    │
│              │ ├───────────────────┤│                    │
│              │ │ ████████░░  5/8   ││ <- progress bar   │
│              │ ├───────────────────┤│                    │
│              │ │ [✓] DC-001        ││ <- checked item   │
│              │ │     Vách máy phải ││    (green bg,     │
│              │ │     SL: 5 Bộ  ✓  ││     strikethrough) │
│              │ │───────────────────││                    │
│              │ │ [ ] OV-001        ││ <- unchecked item │
│              │ │     Bu lông M6x20 ││                    │
│              │ │     SL: 30 Chiếc  ││                    │
│              │ │───────────────────││                    │
│              │ │ ...more items...  ││ <- scrollable     │
│              │ ├───────────────────┤│                    │
│              │ │ [Hoàn thành]      ││ <- sticky bottom  │
│              │ └───────────────────┘│                    │
│              └─────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Files

| File | Action | Purpose |
|---|---|---|
| `src/components/mobile/phone-frame.tsx` | Create | Reusable phone bezel wrapper (children slot) |
| `src/components/mobile/pick-list-mockup.tsx` | Create | Interactive pick list with checkbox state |
| `src/app/mobile/page.tsx` | Rewrite | Compose Header + PhoneFrame + PickListMockup |

### PhoneFrame component

Pure presentational wrapper. Props: `children: React.ReactNode`.

- Outer: `w-[375px] h-[720px] mx-auto rounded-[40px] border-[8px] border-[#202124] bg-background overflow-hidden relative flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]`
- Notch: `absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[24px] rounded-b-2xl bg-[#202124] z-10`
- Content area: `flex-1 flex flex-col overflow-hidden pt-[24px]` (clears the notch)

Shadow is appropriate here (STYLE-GUIDE Level 3) — this is a physical device mockup, not a flat card.

### PickListMockup component

`'use client'` component with local `useState`.

**Hardcoded data** — 8 items from the PASSION production BOM, with quantities multiplied by 5 (simulating an issue for 5 vehicles):

```typescript
const PICK_LIST_ITEMS = [
  { id: "DC-001", name: "Vách máy phải, phớt NJK", qty: 5, unit: "Bộ" },
  { id: "DC-002", name: "Vách máy giữa", qty: 5, unit: "Bộ" },
  { id: "DC-004", name: "Xi lanh cao 60 mm nghiêng", qty: 5, unit: "Chiếc" },
  { id: "OV-001", name: "Bu lông lục giác M6x20", qty: 30, unit: "Chiếc" },
  { id: "OV-003", name: "Ê cu hãm M6", qty: 30, unit: "Chiếc" },
  { id: "DD-001", name: "Cụm đèn pha LED PASSION", qty: 5, unit: "Bộ" },
  { id: "KS-001", name: "Khung sườn chính PASSION", qty: 5, unit: "Chiếc" },
  { id: "PK-001", name: "Tem logo Victoria Motors", qty: 5, unit: "Bộ" },
];
```

**State:** `useState<Set<string>>` — initialized with `new Set(["DC-001", "DC-002", "DC-004", "OV-001", "OV-003"])` (5 of 8 pre-checked — shows a partially-complete pick list, more interesting than starting empty).

**Structure inside the phone:**

1. **Header strip** (sticky top): `bg-primary text-primary-foreground` h-14, px-4. Shows `ClipboardList` icon + "PHIẾU XUẤT KHO" title + "PASSION — 5 chiếc | 15/04/2026" subtitle.

2. **Progress section**: px-4 py-3. Text `"{checked}/{total} đã lấy"` in `text-sm text-muted-foreground`. Progress bar: outer `h-2 rounded-full bg-surface-container`, inner `bg-primary rounded-full transition-all duration-300` with computed width percentage.

3. **Item list** (scrollable, `flex-1 overflow-y-auto`): Each item is a row with:
   - `px-4 py-3 border-b border-outline-variant` base
   - When checked: `bg-success-container/30` background
   - Left: `Checkbox` from `@/components/ui/checkbox` (controlled via `checked`/`onCheckedChange`)
   - Right: Item ID in `text-sm font-medium`, name in `text-sm text-muted-foreground` (with `line-through opacity-60` when checked), "SL: {qty} {unit}" in `text-xs text-muted-foreground`
   - When checked: small `Check` icon (lucide, 14px, `text-[#1e8e3e]`)

4. **Bottom action** (sticky): `border-t border-outline-variant` p-4. Full-width `Button` "Hoàn thành phiếu xuất". Disabled until all checked. When all checked and clicked → button text changes to "Đã hoàn thành" with `Check` icon, disabled.

### Checkbox API note

The existing `Checkbox` from `src/components/ui/checkbox.tsx` wraps `@base-ui/react/checkbox`. It accepts `checked: boolean` and `onCheckedChange: (checked: boolean) => void` via `CheckboxPrimitive.Root.Props`.

---

## Page 2: `/ocr` — OCR Scan Mockup

### Concept

User photographs a supplier invoice. The system OCR-reads it and extracts structured material data, ready to import as a Purchase BOM. Showing the flow: scanned document → extracted table → BOM preview.

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Scan hoá đơn (OCR)                             (Header)    │
│──────────────────────────────────────────────────────────────│
│  Mô phỏng tính năng scan hoá đơn nhà cung cấp...           │
│                                                              │
│  ┌─────────────────────┐  ┌────────────────────────────────┐ │
│  │ 1. Ảnh chụp hoá đơn │  │ 2. Kết quả nhận dạng (OCR)   │ │
│  │ ───────────────────  │  │ ──────────────────────────────│ │
│  │ ┌ ─ ─ ─ ─ ─ ─ ─ ─┐  │  │ NCC: Cty Phụ tùng Hà Nội    │ │
│  │ │  [Document img]  │  │  │ Ngày: 10/04/2026             │ │
│  │ │  with scanning   │  │  │                              │ │
│  │ │  line animation  │  │  │ ┌────┬────────┬─────┬──────┐ │ │
│  │ └ ─ ─ ─ ─ ─ ─ ─ ─┘  │  │ │ STT│ Tên    │  SL │ Khớp │ │ │
│  │                      │  │ │  1 │ Vách.. │  50 │  ✓   │ │ │
│  │ [Chụp lại]          │  │ │ ...│ ...    │ ... │  ✓   │ │ │
│  └─────────────────────┘  │ └────┴────────┴─────┴──────┘ │ │
│                            │                              │ │
│                            │ Badge: "Nhận dạng 12/12"     │ │
│                            │ [Tạo BOM mua hàng →]         │ │
│                            └────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ 3. Xem trước BOM mua hàng                           │    │
│  │ ────────────────────────────────────────────────────  │    │
│  │ Tên: Đơn mua linh kiện động cơ AT88                  │    │
│  │ NCC: Công ty TNHH Phụ tùng Hà Nội                    │    │
│  │ ┌──────┬────────────────────┬──────┬──────┐           │    │
│  │ │  Mã  │ Tên vật liệu       │  SL  │  ĐV  │           │    │
│  │ │DC-001│ Vách máy phải...   │   50 │  Bộ  │           │    │
│  │ │ ...  │ ...                │  ... │  ... │           │    │
│  │ └──────┴────────────────────┴──────┴──────┘           │    │
│  │ Badge: "Sẵn sàng nhập"                                │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Files

| File | Action | Purpose |
|---|---|---|
| `src/components/ocr/scan-viewport.tsx` | Create | Camera viewport mockup with scanning animation |
| `src/components/ocr/ocr-results.tsx` | Create | OCR result table + BOM preview card |
| `src/app/ocr/page.tsx` | Rewrite | Compose Header + 2-col grid + full-width preview |

### ScanViewport component

Presentational component (no state).

- Card wrapper: `rounded-md border border-border` (standard card pattern)
- Card header: icon `ScanLine` + "1. Ảnh chụp hoá đơn" in `text-section-title`
- Viewport area: `aspect-[3/4] bg-surface-dim rounded-lg border-2 border-dashed border-primary/30 relative overflow-hidden`
- Inside viewport — simulated document: a white card (`bg-white rounded-md shadow-sm p-4 mx-6 my-4 -rotate-1`) containing stylized invoice text:
  - "HÓA ĐƠN MUA HÀNG" header (bold, small)
  - "Linh kiện động cơ AT88" subtitle
  - "NCC: Công ty TNHH Phụ tùng Hà Nội"
  - "Ngày: 10/04/2026"
  - A few blurred/faded lines to simulate more content (`h-2 bg-muted-foreground/20 rounded w-3/4 my-1` etc.)
- Scanning line: absolutely-positioned `h-0.5 w-full bg-primary/50` with CSS animation moving top-to-bottom in 3s loop
- Below viewport: outline `Button` "Chụp lại" (disabled, visual only)

**Scanning animation** — add to `src/app/globals.css`:
```css
@keyframes scan-line {
  0%, 100% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  50% { top: calc(100% - 2px); }
}
```
Apply via `animate-[scan-line_3s_ease-in-out_infinite]`.

### OcrResults component

Two exported components from one file: `OcrResultsCard` and `BomPreviewCard`.

**Hardcoded data** — matches `bom_purchase_at88_q1` from seed (12 items). Uses actual item IDs and names from `src/data/seed/items.ts`:

```typescript
const OCR_DATA = [
  { stt: 1, name: "Vách máy phải, phớt NJK TC 16.4x30x5", matchedId: "DC-001", qty: 50, unit: "Bộ" },
  { stt: 2, name: "Vách máy giữa", matchedId: "DC-002", qty: 50, unit: "Bộ" },
  { stt: 3, name: "Vách máy trái liền vòng bi", matchedId: "DC-003", qty: 50, unit: "Bộ" },
  { stt: 4, name: "Xi lanh cao 60mm nghiêng 49cm3", matchedId: "DC-004", qty: 60, unit: "Chiếc" },
  { stt: 5, name: "Bộ xéc măng", matchedId: "DC-005", qty: 120, unit: "Bộ" },
  { stt: 6, name: "Quả pít tông phi 37,5mm", matchedId: "DC-006", qty: 120, unit: "Chiếc" },
  { stt: 7, name: "Trục cam", matchedId: "DC-007", qty: 80, unit: "Chiếc" },
  { stt: 8, name: "Bánh răng cam", matchedId: "DC-008", qty: 80, unit: "Chiếc" },
  { stt: 9, name: "Phanh gài chốt pít tông", matchedId: "OV-006", qty: 300, unit: "Chiếc" },
  { stt: 10, name: "Gioăng giấy đáy xi lanh", matchedId: "GP-002", qty: 200, unit: "Chiếc" },
  { stt: 11, name: "Gioăng cao su viền đầu xi lanh", matchedId: "GP-004", qty: 200, unit: "Chiếc" },
  { stt: 12, name: "Quạt gió làm mát động cơ", matchedId: "KH-004", qty: 60, unit: "Chiếc" },
];
```

**OcrResultsCard:**
- Card wrapper: `rounded-md border border-border`
- Header: `FileText` icon + "2. Kết quả nhận dạng (OCR)"
- Invoice info: key-value pairs (`text-sm`) — NCC, ngày, số hoá đơn
- Table: standard table pattern (`Table`, `TableHeader`, etc. from `@/components/ui/table`)
  - Columns: STT, Tên vật liệu (OCR), SL, ĐV, Khớp mã
  - "Khớp mã" column: green `Check` icon + matched ID in `text-xs text-muted-foreground`
  - All rows show green check (demo assumes 100% match)
- Footer: `Badge` "Nhận dạng 12/12 vật liệu" in `bg-success-container text-[#1e8e3e]` + primary `Button` "Tạo BOM mua hàng" with `ArrowRight` icon

**BomPreviewCard:**
- Full-width card below the 2-column grid
- Header: `ListTree` icon + "3. Xem trước BOM mua hàng"
- BOM info: name, supplier, date
- Table: Mã, Tên vật liệu, Số lượng, Đơn vị — using the matched/cleaned data
- Footer: `Badge` "Sẵn sàng nhập" in success style

### OCR page composition

```
<Header title="Scan hoá đơn (OCR)" />
<p description text />
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  <ScanViewport />
  <OcrResultsCard />
</div>
<BomPreviewCard />
```

Uses `lg:grid-cols-2` so it stacks on smaller screens.

---

## Reusable components from existing codebase

| Component | Source | Usage |
|---|---|---|
| `Header` | `src/components/layout/header.tsx` | Page headers |
| `Badge` | `src/components/ui/badge.tsx` | Status badges |
| `Button` | `src/components/ui/button.tsx` | Action buttons |
| `Checkbox` | `src/components/ui/checkbox.tsx` | Pick list checkboxes |
| `Table` etc. | `src/components/ui/table.tsx` | OCR result tables |
| `ScrollArea` | `src/components/ui/scroll-area.tsx` | Scrollable pick list (if needed) |

Icons from lucide-react: `ClipboardList`, `Check`, `ScanLine`, `FileText`, `ArrowRight`, `ListTree`, `Camera`

---

## Implementation order

| Step | What | Files |
|---|---|---|
| 1 | PhoneFrame component | `src/components/mobile/phone-frame.tsx` |
| 2 | PickListMockup component | `src/components/mobile/pick-list-mockup.tsx` |
| 3 | Rewrite mobile page | `src/app/mobile/page.tsx` |
| 4 | Add scan-line keyframes | `src/app/globals.css` |
| 5 | ScanViewport component | `src/components/ocr/scan-viewport.tsx` |
| 6 | OcrResults components | `src/components/ocr/ocr-results.tsx` |
| 7 | Rewrite OCR page | `src/app/ocr/page.tsx` |

Steps 1-3 (mobile) and 4-7 (OCR) are independent and can be built in either order.

---

## Verification

1. `npm run dev` — navigate to `/mobile`, verify phone frame renders centered with pick list inside
2. Click checkboxes — progress bar and count update, checked items show green bg + strikethrough
3. Check all items — "Hoàn thành" button enables, click shows completion state
4. Navigate to `/ocr` — verify 2-column layout with scan viewport and OCR results
5. Scanning line animation plays smoothly in the viewport
6. All tables display correct data matching seed items
7. `npm run build` — static export succeeds with no errors
8. Sidebar DEMO section links work for both pages
9. Vietnamese diacriticals render correctly in all text
