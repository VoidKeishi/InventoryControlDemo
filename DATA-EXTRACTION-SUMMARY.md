# Data Extraction Summary

## Source Files → What They Contain

| File | Content | Items | Key Models |
|---|---|---|---|
| Kho LK động cơ PASSION, at royal | Engine parts (vách máy, xi lanh, trục cơ, bánh răng...) | 118 | AT88 PASSION, AT88 ROYAL |
| Kho LK động cơ xe ga | Same engine parts but for scooter variants, has SKU codes | 118 | AT88 PRO FI, VIRAL 1 |
| Kho LK động cơ xe số | Shared motor parts (vô lăng từ, cuộn điện, gioăng...) | 183 | CUP 81, CX6, RC6 |
| Kho LK sản xuất V38, VIRAL, V68, ROYAL, VIRAL S2 | Frame/assembly parts (khung, giảm xóc, đèn, dây điện...) | 180 | V38 PRO, VIRAL PRO, V68-3, ROYAL, VIRAL S2 |
| Nhựa Si | Plastic body parts by color/supplier | 892 | RC4, RC5, RC6, Si |
| BBXX 2026 | Vehicle dispatch records (15,787+ vehicles) | - | All models |

## Extraction Results

- **Total raw items**: 1,491
- **After dedup**: 1,486 unique items
- **Items with stock > 0**: ~1,020

### Categories
| Category | Count |
|---|---|
| Nhựa/Vỏ | 905 |
| Động cơ | 192 |
| Khác | 182 |
| Ốc vít/Bu lông | 59 |
| Điện/Đèn | 52 |
| Khung sườn | 46 |
| Gioăng/Phớt | 26 |
| Phụ kiện | 24 |

### BOM Sizes (demo models)
| Model | Items in BOM |
|---|---|
| PASSION | 126 |
| ROYAL | 172 (includes shared engine parts with PASSION) |
| V38 PRO | 59 |
| V68-3 | 47 |
| VIRAL S2 | 38 |
| VIRAL PRO | 15 |

### Cross-usage (shared parts)
**144 items** are shared between 2+ models. Key examples:
- Giảm xóc trước (330mm) → V38, VIRAL PRO, VIRAL S2
- Attomat 40A → V38, VIRAL PRO, VIRAL S2, V68, ROYAL
- Đĩa phanh trước SZL → V38, VIRAL PRO, VIRAL S2, V68
- Engine parts (vách máy, xi lanh, etc.) → ROYAL, PASSION

This directly demonstrates the client's pain point: shared materials across models make manual tracking impossible.

## For Demo Seed Data

The `extracted-data.json` file contains the full extraction. For the demo:
1. **Item Master**: Use all items with `currentStock > 0` (curated to ~60-80 representative items)
2. **Production BOMs**: 6 models (PASSION, ROYAL, V38 PRO, VIRAL PRO, V68-3, VIRAL S2)
3. **Initial stock movements**: Generate from `currentStock` values
4. **The Nhựa Si file has too many plastic parts by color variant** — consolidate for demo (e.g., "Vỏ CTM RC6" instead of separate color rows)

## Excel File Structure (for reference)

All inventory files share this layout:
```
Header rows (company name, report title, month)
STT | Code | Tên linh kiện | ĐVT | Định mức | Tồn đầu (hỏng/tốt) | Daily receipts (1-31) | Tổng nhập | [model breakdowns] | Issue types | Tổng xuất | Hỏng/BH | Tồn cuối (tốt/hỏng)
```

Key columns for extraction:
- **Tên linh kiện**: Part name (Vietnamese)
- **ĐVT**: Unit of measure
- **Định mức**: BOM quantity per vehicle
- **Tồn cuối**: Ending stock (the number we use for current inventory)
