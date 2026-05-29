import type { StockMovement } from "@/types";

const initialReceiptCreatedAt = "2026-01-03T08:00:00.000Z";

export const seedMovements: StockMovement[] = [
  // ─── Opening stock (Tồn đầu kỳ) ───
  { id: "mv_001", itemId: "DC-001", type: "receipt", quantity: 600, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_002", itemId: "DC-002", type: "receipt", quantity: 520, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_003", itemId: "DC-003", type: "receipt", quantity: 480, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_004", itemId: "DC-004", type: "receipt", quantity: 3, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_005", itemId: "DC-005", type: "receipt", quantity: 180, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_006", itemId: "DC-006", type: "receipt", quantity: 150, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_007", itemId: "DC-007", type: "receipt", quantity: 75, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_008", itemId: "DC-008", type: "receipt", quantity: 60, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_009", itemId: "DC-009", type: "receipt", quantity: 90, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_010", itemId: "DC-010", type: "receipt", quantity: 8, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_011", itemId: "KS-001", type: "receipt", quantity: 24, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_012", itemId: "KS-002", type: "receipt", quantity: 40, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_013", itemId: "KS-003", type: "receipt", quantity: 120, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_014", itemId: "KS-004", type: "receipt", quantity: 6, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_015", itemId: "KS-005", type: "receipt", quantity: 500, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_016", itemId: "KS-006", type: "receipt", quantity: 18, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_017", itemId: "OV-001", type: "receipt", quantity: 1200, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_018", itemId: "OV-002", type: "receipt", quantity: 950, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_019", itemId: "OV-003", type: "receipt", quantity: 1000, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_020", itemId: "OV-004", type: "receipt", quantity: 820, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_021", itemId: "OV-005", type: "receipt", quantity: 700, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_022", itemId: "OV-006", type: "receipt", quantity: 260, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_023", itemId: "DD-001", type: "receipt", quantity: 35, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_024", itemId: "DD-002", type: "receipt", quantity: 22, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_025", itemId: "DD-003", type: "receipt", quantity: 16, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_026", itemId: "DD-004", type: "receipt", quantity: 5, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_027", itemId: "DD-005", type: "receipt", quantity: 12, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_028", itemId: "DD-006", type: "receipt", quantity: 200, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_029", itemId: "DD-007", type: "receipt", quantity: 600, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_030", itemId: "NV-001", type: "receipt", quantity: 90, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_031", itemId: "NV-002", type: "receipt", quantity: 84, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_032", itemId: "NV-003", type: "receipt", quantity: 78, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_033", itemId: "NV-004", type: "receipt", quantity: 20, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_034", itemId: "NV-005", type: "receipt", quantity: 18, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_035", itemId: "NV-006", type: "receipt", quantity: 4, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_036", itemId: "GP-001", type: "receipt", quantity: 4, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_037", itemId: "GP-002", type: "receipt", quantity: 160, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_038", itemId: "GP-003", type: "receipt", quantity: 140, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_039", itemId: "GP-004", type: "receipt", quantity: 130, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_040", itemId: "GP-005", type: "receipt", quantity: 120, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_041", itemId: "GP-006", type: "receipt", quantity: 9, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_042", itemId: "PK-001", type: "receipt", quantity: 300, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_043", itemId: "PK-002", type: "receipt", quantity: 55, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_044", itemId: "PK-003", type: "receipt", quantity: 70, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_045", itemId: "PK-004", type: "receipt", quantity: 8, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_046", itemId: "KH-001", type: "receipt", quantity: 210, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_047", itemId: "KH-002", type: "receipt", quantity: 205, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_048", itemId: "KH-003", type: "receipt", quantity: 44, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_049", itemId: "KH-004", type: "receipt", quantity: 28, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_050", itemId: "KH-005", type: "receipt", quantity: 7, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },
  { id: "mv_051", itemId: "KH-006", type: "receipt", quantity: 18, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Tồn kho đầu kỳ", createdAt: initialReceiptCreatedAt, createdBy: "Hệ thống" },

  // ─── January 2026 activity ───
  { id: "mv_052", itemId: "DC-001", type: "issue", quantity: -25, bomId: "bom_passion_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất PASSION (5 chiếc)", createdAt: "2026-01-15T09:30:00.000Z", createdBy: "Trần Văn Nam" },
  { id: "mv_053", itemId: "DC-002", type: "issue", quantity: -25, bomId: "bom_passion_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất PASSION (5 chiếc)", createdAt: "2026-01-15T09:30:00.000Z", createdBy: "Trần Văn Nam" },
  { id: "mv_054", itemId: "OV-001", type: "issue", quantity: -150, bomId: "bom_passion_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất PASSION (5 chiếc)", createdAt: "2026-01-15T09:30:00.000Z", createdBy: "Trần Văn Nam" },
  { id: "mv_055", itemId: "KS-001", type: "issue", quantity: -5, bomId: "bom_passion_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất PASSION (5 chiếc)", createdAt: "2026-01-15T09:30:00.000Z", createdBy: "Trần Văn Nam" },
  { id: "mv_056", itemId: "OV-003", type: "issue", quantity: -200, bomId: "bom_royal_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất ROYAL (10 chiếc)", createdAt: "2026-01-28T10:00:00.000Z", createdBy: "Trần Văn Nam" },
  { id: "mv_057", itemId: "GP-002", type: "adjustment", quantity: -5, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Điều chỉnh kiểm kê: phát hiện hỏng", createdAt: "2026-01-30T14:00:00.000Z", createdBy: "Lê Thị Hoa" },

  // ─── February 2026 activity ───
  // PO-2026-02-001 received (engines) — dated 2026-02-15
  { id: "mv_058", itemId: "DC-004", type: "receipt", quantity: 20, bomId: null, bomVersion: null, poId: "po_2026_02_001", unitPrice: 860000, reason: "Nhập theo PO-2026-02-001", createdAt: "2026-02-15T08:30:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_059", itemId: "DC-005", type: "receipt", quantity: 50, bomId: null, bomVersion: null, poId: "po_2026_02_001", unitPrice: 155000, reason: "Nhập theo PO-2026-02-001", createdAt: "2026-02-15T08:30:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_060", itemId: "DC-006", type: "receipt", quantity: 40, bomId: null, bomVersion: null, poId: "po_2026_02_001", unitPrice: 185000, reason: "Nhập theo PO-2026-02-001", createdAt: "2026-02-15T08:30:00.000Z", createdBy: "Nguyễn Văn An" },
  // Production issues
  { id: "mv_061", itemId: "DC-004", type: "issue", quantity: -8, bomId: "bom_v38_pro_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất V38 PRO (8 chiếc)", createdAt: "2026-02-20T09:00:00.000Z", createdBy: "Phạm Văn Minh" },
  { id: "mv_062", itemId: "DC-005", type: "issue", quantity: -16, bomId: "bom_v38_pro_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất V38 PRO (8 chiếc)", createdAt: "2026-02-20T09:00:00.000Z", createdBy: "Phạm Văn Minh" },
  // PO-2026-02-002 received (fasteners) — dated 2026-02-22
  { id: "mv_063", itemId: "OV-001", type: "receipt", quantity: 500, bomId: null, bomVersion: null, poId: "po_2026_02_002", unitPrice: 520, reason: "Nhập theo PO-2026-02-002", createdAt: "2026-02-22T10:00:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_064", itemId: "OV-002", type: "receipt", quantity: 400, bomId: null, bomVersion: null, poId: "po_2026_02_002", unitPrice: 820, reason: "Nhập theo PO-2026-02-002", createdAt: "2026-02-22T10:00:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_065", itemId: "OV-003", type: "receipt", quantity: 500, bomId: null, bomVersion: null, poId: "po_2026_02_002", unitPrice: 310, reason: "Nhập theo PO-2026-02-002", createdAt: "2026-02-22T10:00:00.000Z", createdBy: "Nguyễn Văn An" },

  // ─── March 2026 activity ───
  // PO-2026-03-001 received (lighting) — dated 2026-03-12
  { id: "mv_066", itemId: "DD-001", type: "receipt", quantity: 20, bomId: null, bomVersion: null, poId: "po_2026_03_001", unitPrice: 390000, reason: "Nhập theo PO-2026-03-001", createdAt: "2026-03-12T08:00:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_067", itemId: "DD-002", type: "receipt", quantity: 15, bomId: null, bomVersion: null, poId: "po_2026_03_001", unitPrice: 285000, reason: "Nhập theo PO-2026-03-001", createdAt: "2026-03-12T08:00:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_068", itemId: "DD-006", type: "receipt", quantity: 100, bomId: null, bomVersion: null, poId: "po_2026_03_001", unitPrice: 1550, reason: "Nhập theo PO-2026-03-001", createdAt: "2026-03-12T08:00:00.000Z", createdBy: "Nguyễn Văn An" },
  // Production issues
  { id: "mv_069", itemId: "DD-001", type: "issue", quantity: -12, bomId: "bom_passion_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất PASSION (12 chiếc)", createdAt: "2026-03-18T09:00:00.000Z", createdBy: "Trần Văn Nam" },
  { id: "mv_070", itemId: "KS-001", type: "issue", quantity: -12, bomId: "bom_passion_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất PASSION (12 chiếc)", createdAt: "2026-03-18T09:00:00.000Z", createdBy: "Trần Văn Nam" },
  { id: "mv_071", itemId: "OV-001", type: "issue", quantity: -360, bomId: "bom_passion_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất PASSION (12 chiếc)", createdAt: "2026-03-18T09:00:00.000Z", createdBy: "Trần Văn Nam" },
  // PO-2026-03-002 partial receipt — KS-001 received 2026-03-28
  { id: "mv_072", itemId: "KS-001", type: "receipt", quantity: 15, bomId: null, bomVersion: null, poId: "po_2026_03_002", unitPrice: 1480000, reason: "Nhập theo PO-2026-03-002", createdAt: "2026-03-28T10:30:00.000Z", createdBy: "Nguyễn Văn An" },
  // Adjustment
  { id: "mv_073", itemId: "OV-002", type: "adjustment", quantity: 15, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Điều chỉnh kiểm kê: tìm thấy tại kho B", createdAt: "2026-03-31T15:00:00.000Z", createdBy: "Lê Thị Hoa" },

  // ─── April 2026 activity ───
  { id: "mv_074", itemId: "DC-001", type: "issue", quantity: -15, bomId: "bom_royal_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất ROYAL (15 chiếc)", createdAt: "2026-04-05T09:00:00.000Z", createdBy: "Phạm Văn Minh" },
  { id: "mv_075", itemId: "DC-002", type: "issue", quantity: -15, bomId: "bom_royal_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất ROYAL (15 chiếc)", createdAt: "2026-04-05T09:00:00.000Z", createdBy: "Phạm Văn Minh" },
  { id: "mv_076", itemId: "DD-002", type: "issue", quantity: -15, bomId: "bom_royal_prod", bomVersion: 1, poId: null, unitPrice: null, reason: "Xuất sản xuất ROYAL (15 chiếc)", createdAt: "2026-04-05T09:00:00.000Z", createdBy: "Phạm Văn Minh" },
  { id: "mv_077", itemId: "PK-001", type: "issue", quantity: -20, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Xuất phụ kiện cho trưng bày hội chợ", createdAt: "2026-04-10T14:00:00.000Z", createdBy: "Lê Thị Hoa" },
  { id: "mv_078", itemId: "KH-005", type: "adjustment", quantity: -1, bomId: null, bomVersion: null, poId: null, unitPrice: null, reason: "Hao hụt bay hơi", createdAt: "2026-04-12T11:00:00.000Z", createdBy: "Lê Thị Hoa" },

  // ─── Additional PO receipts (backfill for newly seeded POs) ───
  // PO-2026-01-001 received (fasteners from SUP-003) — 2026-01-08
  { id: "mv_079", itemId: "OV-004", type: "receipt", quantity: 500, bomId: null, bomVersion: null, poId: "po_2026_01_001", unitPrice: 480, reason: "Nhập theo PO-2026-01-001", createdAt: "2026-01-08T09:30:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_080", itemId: "OV-005", type: "receipt", quantity: 500, bomId: null, bomVersion: null, poId: "po_2026_01_001", unitPrice: 380, reason: "Nhập theo PO-2026-01-001", createdAt: "2026-01-08T09:30:00.000Z", createdBy: "Nguyễn Văn An" },
  // PO-2026-01-002 received (gaskets from SUP-007) — 2026-01-12
  { id: "mv_081", itemId: "GP-001", type: "receipt", quantity: 100, bomId: null, bomVersion: null, poId: "po_2026_01_002", unitPrice: 8200, reason: "Nhập theo PO-2026-01-002", createdAt: "2026-01-12T09:00:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_082", itemId: "GP-002", type: "receipt", quantity: 150, bomId: null, bomVersion: null, poId: "po_2026_01_002", unitPrice: 5800, reason: "Nhập theo PO-2026-01-002", createdAt: "2026-01-12T09:00:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_083", itemId: "GP-003", type: "receipt", quantity: 150, bomId: null, bomVersion: null, poId: "po_2026_01_002", unitPrice: 6800, reason: "Nhập theo PO-2026-01-002", createdAt: "2026-01-12T09:00:00.000Z", createdBy: "Nguyễn Văn An" },
  // PO-2026-02-003 received (oil/grease from SUP-008) — 2026-02-25
  { id: "mv_084", itemId: "KH-005", type: "receipt", quantity: 20, bomId: null, bomVersion: null, poId: "po_2026_02_003", unitPrice: 82000, reason: "Nhập theo PO-2026-02-003", createdAt: "2026-02-25T09:15:00.000Z", createdBy: "Lê Thị Hoa" },
  { id: "mv_085", itemId: "KH-006", type: "receipt", quantity: 15, bomId: null, bomVersion: null, poId: "po_2026_02_003", unitPrice: 115000, reason: "Nhập theo PO-2026-02-003", createdAt: "2026-02-25T09:15:00.000Z", createdBy: "Lê Thị Hoa" },
  // PO-2026-03-004 received (frame parts from SUP-002) — 2026-03-20
  { id: "mv_086", itemId: "KS-003", type: "receipt", quantity: 80, bomId: null, bomVersion: null, poId: "po_2026_03_004", unitPrice: 118000, reason: "Nhập theo PO-2026-03-004", createdAt: "2026-03-20T08:30:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_087", itemId: "KS-004", type: "receipt", quantity: 50, bomId: null, bomVersion: null, poId: "po_2026_03_004", unitPrice: 92000, reason: "Nhập theo PO-2026-03-004", createdAt: "2026-03-20T08:30:00.000Z", createdBy: "Nguyễn Văn An" },
  // PO-2026-03-005 received (plastic covers from SUP-005) — 2026-03-25
  { id: "mv_088", itemId: "NV-001", type: "receipt", quantity: 60, bomId: null, bomVersion: null, poId: "po_2026_03_005", unitPrice: 44000, reason: "Nhập theo PO-2026-03-005", createdAt: "2026-03-25T10:00:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_089", itemId: "NV-002", type: "receipt", quantity: 60, bomId: null, bomVersion: null, poId: "po_2026_03_005", unitPrice: 54000, reason: "Nhập theo PO-2026-03-005", createdAt: "2026-03-25T10:00:00.000Z", createdBy: "Nguyễn Văn An" },
  { id: "mv_090", itemId: "NV-003", type: "receipt", quantity: 60, bomId: null, bomVersion: null, poId: "po_2026_03_005", unitPrice: 54000, reason: "Nhập theo PO-2026-03-005", createdAt: "2026-03-25T10:00:00.000Z", createdBy: "Nguyễn Văn An" },
  // PO-2026-04-006 partial receipt (first batch of OV-004) — 2026-04-11
  { id: "mv_091", itemId: "OV-004", type: "receipt", quantity: 300, bomId: null, bomVersion: null, poId: "po_2026_04_006", unitPrice: 475, reason: "Nhập theo PO-2026-04-006 (đợt 1)", createdAt: "2026-04-11T11:00:00.000Z", createdBy: "Nguyễn Văn An" },
];
