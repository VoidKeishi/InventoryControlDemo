import type { StockMovement, BOM, Item } from "@/types";

export function getStockByItemId(
  movements: StockMovement[],
  itemId: string,
): number {
  return movements
    .filter((m) => m.itemId === itemId)
    .reduce((sum, m) => sum + m.quantity, 0);
}

export function getStockMap(
  movements: StockMovement[],
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const m of movements) {
    map[m.itemId] = (map[m.itemId] ?? 0) + m.quantity;
  }
  return map;
}

export interface LowStockItem {
  item: Item;
  currentStock: number;
  minStock: number;
}

export function getLowStockItems(
  items: Item[],
  movements: StockMovement[],
): LowStockItem[] {
  const stockMap = getStockMap(movements);
  return items
    .filter((item) => {
      if (item.minStock === null) return false;
      const current = stockMap[item.id] ?? 0;
      return current < item.minStock;
    })
    .map((item) => ({
      item,
      currentStock: stockMap[item.id] ?? 0,
      minStock: item.minStock!,
    }));
}

export interface CapacityResult {
  bomId: string;
  bomName: string;
  maxProducible: number;
  bottleneck: BottleneckItem | null;
  details: CapacityDetail[];
}

export interface BottleneckItem {
  itemId: string;
  itemName: string;
  currentStock: number;
  requiredPerUnit: number;
  maxProducible: number;
}

export interface CapacityDetail {
  itemId: string;
  itemName: string;
  currentStock: number;
  requiredPerUnit: number;
  maxProducible: number;
  isSufficient: boolean;
}

export function getProductionCapacity(
  bom: BOM,
  items: Item[],
  movements: StockMovement[],
): CapacityResult {
  const stockMap = getStockMap(movements);
  const itemMap = new Map(items.map((i) => [i.id, i]));

  const currentVersion = bom.versions.find(
    (v) => v.version === bom.currentVersion,
  );

  if (!currentVersion || currentVersion.lines.length === 0) {
    return {
      bomId: bom.id,
      bomName: bom.name,
      maxProducible: 0,
      bottleneck: null,
      details: [],
    };
  }

  const details: CapacityDetail[] = currentVersion.lines.map((line) => {
    const stock = stockMap[line.itemId] ?? 0;
    const maxForLine =
      line.quantity > 0 ? Math.floor(stock / line.quantity) : Infinity;
    const item = itemMap.get(line.itemId);
    return {
      itemId: line.itemId,
      itemName: item?.name ?? line.itemId,
      currentStock: stock,
      requiredPerUnit: line.quantity,
      maxProducible: maxForLine === Infinity ? 999999 : maxForLine,
      isSufficient: true,
    };
  });

  const maxProducible = Math.min(...details.map((d) => d.maxProducible));

  for (const d of details) {
    d.isSufficient = d.maxProducible > maxProducible;
  }

  const bottleneckDetail = details.reduce((min, d) =>
    d.maxProducible < min.maxProducible ? d : min,
  );

  return {
    bomId: bom.id,
    bomName: bom.name,
    maxProducible,
    bottleneck: {
      itemId: bottleneckDetail.itemId,
      itemName: bottleneckDetail.itemName,
      currentStock: bottleneckDetail.currentStock,
      requiredPerUnit: bottleneckDetail.requiredPerUnit,
      maxProducible: bottleneckDetail.maxProducible,
    },
    details: details.sort((a, b) => a.maxProducible - b.maxProducible),
  };
}
