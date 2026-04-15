export interface Item {
  id: string;
  name: string;
  unit: string;
  category: string;
  minStock: number | null;
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
  reason: string;
  createdAt: string;
  createdBy: string;
}
