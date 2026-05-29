export interface Item {
  id: string;
  name: string;
  unit: string;
  category: string;
  minStock: number | null;
  standardCost: number | null;
  uomConversions: UomConversion[];
}

export interface UomConversion {
  unit: string;
  factor: number;
}

export interface BOM {
  id: string;
  type: "purchase" | "production";
  name: string;
  description: string;
  currentVersion: number;
  versions: BOMVersion[];
}

export interface BOMVersion {
  version: number;
  createdAt: string;
  note: string;
  lines: BOMLine[];
}

export interface BOMLine {
  itemId: string;
  quantity: number;
  unit: string;
  note: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: "receipt" | "issue" | "adjustment";
  quantity: number;
  bomId: string | null;
  bomVersion: number | null;
  poId: string | null;
  unitPrice: number | null;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxId: string;
  note: string;
}

export type PurchaseOrderStatus =
  | "draft"
  | "ordered"
  | "partial"
  | "received"
  | "cancelled";

export interface PurchaseOrderLine {
  itemId: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
  note: string;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierId: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDate: string | null;
  lines: PurchaseOrderLine[];
  note: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
