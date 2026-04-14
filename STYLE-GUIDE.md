# Victoria Motors ERP Demo — Style Guide

> Google-inspired, minimal, modern. Built on Material Design 3 principles adapted for shadcn/ui + Tailwind CSS v4.

---

## 1. Design Philosophy

**Core principles — in priority order:**

1. **Clarity first.** Every element must be instantly understandable to non-technical Vietnamese stakeholders who have never used ERP software. When in doubt, make it more obvious.
2. **Calm surfaces, purposeful color.** Backgrounds are white/near-white. Color is reserved for actions (blue), status (green/red/amber), and visual hierarchy — never decoration.
3. **Dense but breathable.** Data tables are the primary UI. Pack information efficiently, but maintain generous padding and clear row separation.
4. **Consistent rhythm.** All spacing derives from a 4px base grid. All sizing is predictable.

**Visual reference:** Google Cloud Console, Google Sheets, Gmail — clean white canvas, subtle gray borders, blue interactive elements, flat with minimal shadow.

---

## 2. Color System

Derived from Google's product palette, mapped to shadcn/ui CSS variables.

### 2.1 Primary Palette

| Role | Hex | HSL | Usage |
|---|---|---|---|
| **Primary** | `#1a73e8` | `214 82% 51%` | Buttons, links, active states, focused inputs |
| **Primary Hover** | `#1765cc` | `214 77% 45%` | Hover state for primary elements |
| **Primary Container** | `#e8f0fe` | `216 92% 95%` | Selected row background, active tab indicator, info badges |
| **On Primary** | `#ffffff` | `0 0% 100%` | Text/icon on primary-colored backgrounds |

### 2.2 Neutral / Surface Palette

| Role | Hex | HSL | Usage |
|---|---|---|---|
| **Background** | `#ffffff` | `0 0% 100%` | Page background |
| **Surface** | `#ffffff` | `0 0% 100%` | Cards, dialogs, popovers |
| **Surface Dim** | `#f8f9fa` | `210 17% 98%` | Sidebar background, secondary sections, table header |
| **Surface Container** | `#f1f3f4` | `200 14% 95%` | Muted areas, alternating table rows (optional), skeleton |
| **Surface Container High** | `#e8eaed` | `216 12% 92%` | Hover state on neutral surfaces, disabled backgrounds |
| **On Surface** | `#202124` | `225 6% 13%` | Primary text, headings |
| **On Surface Variant** | `#5f6368` | `213 5% 39%` | Secondary text, labels, descriptions, placeholders |

### 2.3 Outline

| Role | Hex | HSL | Usage |
|---|---|---|---|
| **Outline** | `#dadce0` | `220 9% 87%` | Borders: cards, tables, inputs, dividers |
| **Outline Variant** | `#e8eaed` | `216 12% 92%` | Subtle separators (table row lines, section dividers) |

### 2.4 Semantic Colors

| Role | Hex | HSL | Usage |
|---|---|---|---|
| **Error** | `#d93025` | `4 72% 50%` | Delete buttons, error text, negative stock indicators |
| **Error Container** | `#fce8e6` | `5 82% 95%` | Error badge background, alert background |
| **Success** | `#1e8e3e` | `137 65% 34%` | Receipt confirmation, positive stock, sufficient materials |
| **Success Container** | `#e6f4ea` | `137 44% 93%` | Success badge background, success alert |
| **Warning** | `#e37400` | `30 100% 45%` | Low stock warnings, caution states |
| **Warning Container** | `#fef7e0` | `43 93% 94%` | Warning badge background, warning alert |

### 2.5 shadcn/ui CSS Variable Mapping

```css
@layer base {
  :root {
    --background: 0 0% 100%;             /* #ffffff */
    --foreground: 225 6% 13%;            /* #202124 */

    --card: 0 0% 100%;                   /* #ffffff */
    --card-foreground: 225 6% 13%;       /* #202124 */

    --popover: 0 0% 100%;               /* #ffffff */
    --popover-foreground: 225 6% 13%;   /* #202124 */

    --primary: 214 82% 51%;             /* #1a73e8 */
    --primary-foreground: 0 0% 100%;    /* #ffffff */

    --secondary: 210 17% 98%;           /* #f8f9fa */
    --secondary-foreground: 225 6% 13%; /* #202124 */

    --muted: 200 14% 95%;               /* #f1f3f4 */
    --muted-foreground: 213 5% 39%;     /* #5f6368 */

    --accent: 216 92% 95%;              /* #e8f0fe */
    --accent-foreground: 214 82% 51%;   /* #1a73e8 */

    --destructive: 4 72% 50%;           /* #d93025 */
    --destructive-foreground: 0 0% 100%; /* #ffffff */

    --border: 220 9% 87%;               /* #dadce0 */
    --input: 220 9% 87%;                /* #dadce0 */
    --ring: 214 82% 51%;                /* #1a73e8 */
    --radius: 0.5rem;                   /* 8px */

    /* Extended tokens (custom, not shadcn defaults) */
    --success: 137 65% 34%;             /* #1e8e3e */
    --success-foreground: 0 0% 100%;
    --warning: 30 100% 45%;             /* #e37400 */
    --warning-foreground: 0 0% 100%;
  }
}
```

### 2.6 Color Usage Rules

- **Never use color alone to convey meaning.** Pair with icons and/or text (e.g. stock level badge: red dot + "Thiếu hàng").
- **Primary blue is for interactive elements only.** Do not use it for static decorative text.
- **Limit color on any screen to 3 semantic colors max.** A dashboard card showing stock alerts should show red (low) and green (ok) — not red, green, blue, yellow, and purple.
- **Table rows**: white background. No zebra stripes by default — use hover highlight (`surface-container-high`) instead. Zebra stripes only if the table exceeds 15 columns.

---

## 3. Typography

### 3.1 Font Family

**Be Vietnam Pro** — chosen for native Vietnamese diacritical support.

```css
--font-sans: 'Be Vietnam Pro', system-ui, -apple-system, sans-serif;
```

Load via `next/font/google` with `subsets: ['vietnamese', 'latin']`, weights `[400, 500, 600]`.

### 3.2 Type Scale

Adapted from Material Design 3's 15-token scale, simplified for this app. Only these sizes are used:

| Token | Size | Line Height | Weight | CSS Class | Usage |
|---|---|---|---|---|---|
| **Page Title** | 22px / 1.375rem | 28px | 600 | `.text-page-title` | Page headings ("Tồn kho hiện tại") |
| **Section Title** | 16px / 1rem | 24px | 600 | `.text-section-title` | Card titles, dialog headers, section headings |
| **Body** | 14px / 0.875rem | 20px | 400 | `.text-body` (default) | All standard content text |
| **Body Strong** | 14px / 0.875rem | 20px | 500 | `.text-body font-medium` | Table headers, emphasized inline text |
| **Small** | 12px / 0.75rem | 16px | 400 | `.text-small` | Timestamps, secondary info, help text |
| **Label** | 12px / 0.75rem | 16px | 500 | `.text-label` | Badges, chips, form labels, table column headers |
| **Number** | 14px / 0.875rem | 20px | 500 | `.font-medium tabular-nums` | Stock quantities, capacity numbers — always `tabular-nums` |
| **Hero Number** | 36px / 2.25rem | 40px | 600 | `.text-hero` | Capacity calculator main result |

### 3.3 Typography Rules

- **Base font size**: `14px` (0.875rem). This is the default body text size — set on `<html>`. ERP apps are data-dense; 16px wastes space.
- **Font weights**: Only 400 (regular), 500 (medium), 600 (semibold). Never use 300 or 700+.
- **Numbers in tables**: Always use `tabular-nums` for aligned columns. Use `font-medium` (500) for numeric data to improve readability.
- **Vietnamese text**: Ensure line-height is at least 1.43x font size to prevent diacritical clipping.
- **Truncation**: Long item names in tables use `truncate` (single-line ellipsis). Full name visible on hover via `title` attribute.
- **No ALL CAPS** except for sidebar section labels (e.g. "KHO HÀNG", "VẬT LIỆU & BOM").

---

## 4. Spacing & Layout

### 4.1 Base Grid

**4px base unit.** All spacing values are multiples of 4px.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon-to-text gap, tight inline spacing |
| `space-2` | 8px | Between related elements (label → input, badge gap) |
| `space-3` | 12px | Table cell padding (vertical), small card padding |
| `space-4` | 16px | Card padding, dialog section spacing, gap between form fields |
| `space-5` | 20px | Page content margin top (below header) |
| `space-6` | 24px | Card padding (large), dialog body padding |
| `space-8` | 32px | Between major page sections |
| `space-10` | 40px | Page horizontal padding (content area) |

### 4.2 Page Layout

```
┌──────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────────┐ │
│ │          │ │  Page Title          [Actions]  │ │
│ │ Sidebar  │ │─────────────────────────────────│ │
│ │ 240px    │ │                                 │ │
│ │          │ │  Content area                   │ │
│ │          │ │  max-width: none                │ │
│ │          │ │  padding: 24px 32px             │ │
│ │          │ │                                 │ │
│ │          │ │                                 │ │
│ └──────────┘ └─────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

- **Sidebar**: Fixed 240px wide, collapsible to 64px (icon-only). Background: `surface-dim` (#f8f9fa). Border-right: 1px `outline` (#dadce0).
- **Content area**: Fluid width, no max-width. Padding: `24px` top, `32px` horizontal.
- **Page header**: Title (left) + action buttons (right), separated by 1px border-bottom or `16px` margin-bottom.

### 4.3 Responsive Breakpoints

This app is primarily demoed on laptop. Minimal responsive adaptation:

| Breakpoint | Behavior |
|---|---|
| `≥ 1024px` | Full layout with expanded sidebar |
| `768px – 1023px` | Collapsed sidebar (icon-only), full content |
| `< 768px` | Hidden sidebar (hamburger menu), mobile layout (Tier 3 only) |

---

## 5. Elevation & Shadows

Google's modern UI uses **minimal shadows**. Prefer borders over shadows for separation.

| Level | Shadow | Usage |
|---|---|---|
| **0 (Flat)** | `none` | Default for most elements. Cards, tables, sections — use `border` instead. |
| **1 (Raised)** | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | Dropdown menus, popovers, tooltips |
| **2 (Floating)** | `0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)` | Dialogs, modals |
| **3 (Overlay)** | `0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)` | Command palette, mobile bottom sheets |

**Rules:**
- Cards on the page are flat (border only, no shadow). This is Google's current approach.
- Only floating elements (menus, dialogs, popovers) get shadow.
- Dialog overlay backdrop: `rgba(0,0,0,0.32)` — subtle, not dark.

---

## 6. Border Radius

Material Design 3 uses shape tokens. Adapted for this app:

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Badges, chips, small buttons, input fields |
| `--radius` | 8px | Cards, standard buttons, dropdowns |
| `--radius-lg` | 12px | Dialogs, modals, large cards |
| `--radius-full` | 9999px | Avatar/icon circles, pill badges |

**Rules:**
- **Tables**: No border-radius on individual cells. Table wrapper gets `--radius` (8px) with `overflow: hidden`.
- **Buttons**: `--radius-sm` (6px). Google's buttons are subtly rounded, not pill-shaped.
- **Input fields**: `--radius-sm` (6px).

---

## 7. Component Patterns

### 7.1 Buttons

Four variants, used strictly by purpose:

| Variant | Style | Usage |
|---|---|---|
| **Primary (filled)** | Blue bg `#1a73e8`, white text | Main page action: "Thêm vật liệu", "Xác nhận nhập kho", "Tạo BOM" |
| **Secondary (outline)** | White bg, gray border `#dadce0`, dark text | Secondary actions: "Huỷ", "Xuất file", filtering |
| **Ghost** | Transparent bg, dark text | Tertiary actions: "Xem thêm", icon-only buttons, table row actions |
| **Destructive (filled)** | Red bg `#d93025`, white text | "Xoá" — only inside confirm dialogs, never as first-click action |

**Button sizing:**
- Default height: 36px. Padding: 12px 16px. Font: 14px medium (500).
- Small (table actions): 28px height. Padding: 4px 8px. Font: 12px medium.
- Icon buttons: 36px × 36px (default), 28px × 28px (small). Icon size: 18px (default), 16px (small).

**Rules:**
- Maximum 1 primary button per visible section.
- Button labels are verbs: "Thêm", "Lưu", "Xoá", "Nhập kho" — not "OK", "Submit".
- Disabled buttons: 38% opacity, no pointer events.

### 7.2 Data Tables

The most important component — used on 8+ pages.

```
┌────────────────────────────────────────────────┐
│  Toolbar: Search [_______] + Filter + [Thêm]  │  ← 48px height, bottom border
├────┬───────────────┬────────┬────────┬─────────┤
│ □  │ Mã           │ Tên    │ Tồn kho│ Thao tác│  ← Header: surface-dim bg, label weight
├────┼───────────────┼────────┼────────┼─────────┤
│ □  │ M001         │ Ốc M6  │    120 │ ✎ 🗑   │  ← Row: white bg, hover: surface-container-high
├────┼───────────────┼────────┼────────┼─────────┤
│ □  │ M002         │ Bu lông │     45 │ ✎ 🗑   │
├────┴───────────────┴────────┴────────┴─────────┤
│  Showing 1-20 of 58 items      [< 1 2 3 ... >]│  ← Pagination footer
└────────────────────────────────────────────────┘
```

**Specifications:**
- **Header row**: Background `surface-dim` (#f8f9fa). Font: `label` (12px, 500, uppercase). Text: `on-surface-variant` (#5f6368). Height: 40px. Padding: 12px.
- **Body rows**: Background white. Height: 44px min. Padding: 12px. Border-bottom: 1px `outline-variant` (#e8eaed).
- **Hover state**: Background `surface-container-high` (#e8eaed) with 150ms ease transition.
- **Selected row**: Background `primary-container` (#e8f0fe).
- **Numbers**: Right-aligned, `tabular-nums`, `font-medium`.
- **Actions column**: Right-aligned. Ghost icon buttons, 28px. Visible on hover only (except on touch devices).
- **Empty state**: Centered text "Không có dữ liệu" with a muted icon above.
- **Toolbar**: Search input (left), filter dropdowns (center), primary action button (right).
- **Pagination**: "Hiển thị 1-20 / 58" (left), page buttons (right). Compact: max 5 page numbers visible.

### 7.3 Cards

Used on dashboard and capacity calculator.

```
┌───────────────────────────────┐
│  Section Title           [→]  │  ← 16px padding, border-bottom
│───────────────────────────────│
│                               │
│  Card content                 │  ← 16px padding
│                               │
└───────────────────────────────┘
```

**Specifications:**
- Background: `surface` (white). Border: 1px `outline` (#dadce0). Radius: `--radius` (8px).
- No shadow. Shadow = only for floating elements.
- Card header: Title (section-title weight) + optional action link/button. Bottom border 1px.
- Card body: 16px padding.

### 7.4 Stat Cards (Dashboard)

```
┌──────────────────┐
│  📦 Tổng SKU     │  ← Icon + label in muted-foreground
│  1,486           │  ← Hero number, on-surface
│  +12 tuần này    │  ← Small, success color (optional trend)
└──────────────────┘
```

- 4-column grid on desktop. Consistent height.
- Icon: 20px, `muted-foreground`. Label: `small` (12px), `muted-foreground`.
- Value: 28px, `semibold`, `on-surface`, `tabular-nums`.
- Trend: `small`, colored by direction (green up, red down).

### 7.5 Forms & Inputs

All CRUD is done via Dialog modals.

**Input fields:**
- Height: 36px. Border: 1px `outline` (#dadce0). Radius: 6px. Padding: 8px 12px. Font: 14px.
- Focus: border `primary` (#1a73e8), ring 2px `primary/20%`.
- Error: border `error` (#d93025). Error message below in `small` text, error color.
- Disabled: Background `surface-container` (#f1f3f4), text at 60% opacity.

**Labels:**
- `label` size (12px, 500). `on-surface-variant` (#5f6368). Margin-bottom: 4px.

**Form layout:**
- Single column for simple forms (Item, Stock Adjustment).
- Two-column grid for dense forms (BOM line editor) at `≥ 640px`.
- Spacing between fields: 16px.

**Select/Combobox (Item picker, BOM picker):**
- Searchable dropdown using shadcn/ui Combobox.
- Show item code + name in the dropdown: `M001 — Ốc M6 (cái)`.

### 7.6 Dialogs / Modals

- Max width: `480px` (simple CRUD), `640px` (BOM editor), `800px` (receipt/issue review).
- Border-radius: `--radius-lg` (12px).
- Shadow: Level 2.
- Backdrop: `rgba(0,0,0,0.32)`.
- Header: Title (section-title) + close button (X icon, ghost). Bottom border.
- Footer: Cancel (secondary) + Confirm (primary), right-aligned. Top border. Padding: 16px.
- Scroll: Content area scrolls if needed, header/footer stay fixed.

### 7.7 Badges / Chips

Used for categories, stock status, movement types.

| Type | Background | Text Color | Border | Example |
|---|---|---|---|---|
| **Neutral** | `surface-container` #f1f3f4 | `on-surface` #202124 | none | Category badge "Ốc vít" |
| **Primary** | `primary-container` #e8f0fe | `primary` #1a73e8 | none | BOM type "Sản xuất" |
| **Success** | `success-container` #e6f4ea | `success` #1e8e3e | none | "Đủ hàng", Receipt |
| **Error** | `error-container` #fce8e6 | `error` #d93025 | none | "Thiếu hàng", Bottleneck |
| **Warning** | `warning-container` #fef7e0 | `warning` #e37400 | none | "Sắp hết", Low stock |

- Padding: 2px 8px. Radius: `--radius-full` (pill). Font: `label` (12px, 500).
- No border. Color-fill only. Consistent height: 22px.

### 7.8 Sidebar Navigation

```
┌──────────────────┐
│  VM              │  ← Logo area, 56px height
│──────────────────│
│                  │
│  TỔNG QUAN       │  ← Section label: 11px, uppercase, 500, muted-foreground
│   ◉ Dashboard    │  ← Active: primary text, primary-container bg, left border
│                  │
│  KHO HÀNG        │
│   ○ Tồn kho      │  ← Inactive: on-surface-variant text, transparent bg
│   ○ Nhập kho     │
│   ○ Xuất kho     │
│   ○ Điều chỉnh   │
│   ○ Lịch sử      │
│                  │
│  VẬT LIỆU & BOM │
│   ○ Vật liệu    │
│   ○ BOM Sản xuất │
│   ○ BOM Mua hàng │
│                  │
│  CÔNG CỤ         │
│   ○ ⭐ Năng lực SX│
│                  │
│──────────────────│
│  ↺ Reset demo    │  ← Bottom-pinned, destructive ghost style
└──────────────────┘
```

- Width: 240px (expanded), 64px (collapsed, icon-only).
- Background: `surface-dim` (#f8f9fa). Right border: 1px `outline` (#dadce0).
- Nav item height: 36px. Padding: 8px 12px. Radius: 6px (for inner highlight shape).
- Active item: Background `primary-container` (#e8f0fe), text `primary` (#1a73e8), left border 3px `primary`.
- Hover (inactive): Background `surface-container` (#f1f3f4).
- Section labels: 11px, uppercase, `font-medium`, `muted-foreground`, 24px margin-top, 8px margin-bottom.
- Icons: Lucide, 18px, same color as text.

### 7.9 Toast Notifications (Sonner)

| Type | Icon | Left border color | Usage |
|---|---|---|---|
| **Success** | `CheckCircle` | `success` #1e8e3e | "Nhập kho thành công (12 vật liệu)" |
| **Error** | `XCircle` | `error` #d93025 | "Không đủ tồn kho để xuất" |
| **Warning** | `AlertTriangle` | `warning` #e37400 | "3 vật liệu dưới mức tối thiểu" |
| **Info** | `Info` | `primary` #1a73e8 | "Đã reset dữ liệu demo" |

- Position: bottom-right. Duration: 4 seconds (success/info), 6 seconds (warning/error).
- Style: White background, 1px border, 4px colored left border, shadow level 1.

### 7.10 Confirm Dialogs (AlertDialog)

Used for destructive or significant actions: deleting items, issuing stock, resetting demo data.

- Title: Direct question — "Xoá vật liệu M001?" not "Bạn có chắc chắn?"
- Description: Consequence — "Vật liệu này sẽ bị xoá khỏi tất cả BOM liên quan."
- Actions: "Huỷ" (secondary) + "Xoá" (destructive). Destructive button is always rightmost.

---

## 8. Page-Specific Patterns

### 8.1 Capacity Calculator (Hero Page)

This is the "wow moment." Visual structure:

```
┌─────────────────────────────────────────────────────┐
│  Tính năng lực sản xuất                             │
│                                                     │
│  Chọn mẫu xe: [  PASSION  ▼ ]                      │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │      Có thể sản xuất tối đa                 │    │
│  │            47 chiếc                          │    │  ← Hero number: 48px, semibold, primary
│  │                                              │    │
│  │  ⚠ Bottleneck: Ốc M6 (còn 188, cần 4/xe)   │    │  ← Warning badge style
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Chi tiết vật liệu                                  │
│  ┌──────┬──────────┬─────┬───────┬────────┬───────┐ │
│  │ Mã   │ Tên      │ Tồn │ Cần   │ Đủ cho │ Trạng │ │
│  │ M001 │ Ốc M6    │ 188 │ 4/xe  │ 47 xe  │ 🔴    │ │  ← Bottleneck row: error-container bg
│  │ M002 │ Bu lông  │ 500 │ 8/xe  │ 62 xe  │ 🟢    │ │  ← Sufficient row: default bg
│  └──────┴──────────┴─────┴───────┴────────┴───────┘ │
└─────────────────────────────────────────────────────┘
```

- Hero result card: Centered, `primary-container` background, large padding (32px).
- Hero number: 48px, `semibold`, `primary` color if positive, `error` color if 0.
- Bottleneck callout: `warning-container` background badge with icon.
- Detail table: "Đủ cho" column sorted ascending (bottleneck first). Bottleneck rows highlighted with `error-container` background.

### 8.2 Goods Receipt / Issue Flow

Multi-step within a dialog:

1. **Select** → Choose BOM or individual items.
2. **Review** → Editable quantity table with sufficiency indicators.
3. **Confirm** → Summary with total count, confirm button.

- Step indicator: Simple text "Bước 1/3" (no fancy stepper). Or tab-like horizontal segments.
- Review table: Editable number inputs inline. Green check / red X per row.

### 8.3 Dashboard

4-column stat cards at top → 2-column layout below (low stock alerts left, recent movements right) → full-width capacity overview at bottom.

### 8.4 BOM Detail

Accessed via dialog or expandable row from BOM list.

- Version selector: Dropdown showing "v3 (hiện tại)" with older versions below.
- BOM line table: Item code, name, quantity, unit, note. Inline-editable for current version only.

---

## 9. Icons

**Lucide React** — consistent 18px size throughout, 20px for standalone/emphasis.

Commonly used icons:

| Context | Icon | Name |
|---|---|---|
| Items/Materials | `Package` | package |
| BOM/Structure | `ListTree` | list-tree |
| Stock/Inventory | `Warehouse` | warehouse |
| Receipt (nhập) | `ArrowDownToLine` | arrow-down-to-line |
| Issue (xuất) | `ArrowUpFromLine` | arrow-up-from-line |
| Capacity | `Gauge` | gauge |
| Dashboard | `LayoutDashboard` | layout-dashboard |
| Movement log | `History` | history |
| Adjustment | `SlidersHorizontal` | sliders-horizontal |
| Add/Create | `Plus` | plus |
| Edit | `Pencil` | pencil |
| Delete | `Trash2` | trash-2 |
| Search | `Search` | search |
| Filter | `Filter` | filter |
| Low stock alert | `AlertTriangle` | alert-triangle |
| Success/Sufficient | `Check` | check |
| Error/Insufficient | `X` | x |
| Close dialog | `X` | x |
| Chevron (expand) | `ChevronDown` | chevron-down |
| Menu (mobile) | `Menu` | menu |
| Reset | `RotateCcw` | rotate-ccw |
| BOM Purchase | `ShoppingCart` | shopping-cart |
| BOM Production | `Factory` | factory |
| Mobile | `Smartphone` | smartphone |
| OCR/Scan | `ScanLine` | scan-line |

---

## 10. Motion & Transitions

Minimal, purposeful animation only.

| Element | Property | Duration | Easing |
|---|---|---|---|
| Button hover | background-color | 150ms | ease |
| Table row hover | background-color | 150ms | ease |
| Dialog enter | opacity + scale | 200ms | ease-out |
| Dialog exit | opacity | 150ms | ease-in |
| Sidebar collapse | width | 200ms | ease |
| Toast enter | translate-y + opacity | 200ms | ease-out |
| Toast exit | opacity | 150ms | ease-in |

**Rules:**
- No bounce, spring, or elastic easing. Google uses simple ease curves.
- No animation on page navigation (static export, no route transitions).
- Skeleton loading: Subtle pulse animation (CSS `animate-pulse`) for hydration guard.

---

## 11. Do's and Don'ts

### Do

- Use Vietnamese for all user-facing text. Keep labels short and clear.
- Right-align all numeric columns in tables.
- Show confirmation feedback for every user action (toast or inline).
- Use empty states with helpful context ("Chưa có vật liệu nào. Nhấn 'Thêm' để bắt đầu.").
- Maintain consistent 16px padding inside all cards and dialogs.
- Use `tabular-nums` for any numeric display.

### Don't

- Don't use more than 2 font weights on a single component.
- Don't use shadows on cards sitting on the page. Use 1px borders instead.
- Don't use colored backgrounds for page sections. White + borders is enough.
- Don't use icon-only buttons without tooltips (except well-known patterns like X to close).
- Don't center-align table content (left-align text, right-align numbers).
- Don't use loading spinners — use skeleton/pulse since there's no real API latency.
- Don't mix icon libraries. Lucide only.
- Don't use gradients, text shadows, or decorative elements.
