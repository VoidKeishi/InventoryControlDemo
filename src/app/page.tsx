"use client";

import { useMemo } from "react";
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  History,
  Gauge,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { useBoundStore } from "@/store";
import {
  getLowStockItems,
  getProductionCapacity,
  type LowStockItem,
  type CapacityResult,
} from "@/store/selectors";
import { formatNumber, formatRelativeTime } from "@/lib/format";
import type { StockMovement } from "@/types";

function isWithinDays(dateStr: string, days: number): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

export default function DashboardPage() {
  const items = useBoundStore((s) => s.items);
  const boms = useBoundStore((s) => s.boms);
  const movements = useBoundStore((s) => s.movements);

  const lowStockItems = useMemo(
    () => getLowStockItems(items, movements),
    [items, movements],
  );

  const recentReceipts = useMemo(
    () => movements.filter((m) => m.type === "receipt" && isWithinDays(m.createdAt, 7)).length,
    [movements],
  );

  const recentIssues = useMemo(
    () => movements.filter((m) => m.type === "issue" && isWithinDays(m.createdAt, 7)).length,
    [movements],
  );

  const recentMovements = useMemo(
    () =>
      [...movements]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [movements],
  );

  const itemMap = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items],
  );

  const productionBoms = useMemo(
    () => boms.filter((b) => b.type === "production"),
    [boms],
  );

  const capacityResults: CapacityResult[] = useMemo(
    () => productionBoms.map((bom) => getProductionCapacity(bom, items, movements)),
    [productionBoms, items, movements],
  );

  return (
    <>
      <Header title="Dashboard" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Package} label="Tổng SKU" value={items.length} />
        <StatCard icon={ArrowDownToLine} label="Nhập kho (7 ngày)" value={recentReceipts} />
        <StatCard icon={ArrowUpFromLine} label="Xuất kho (7 ngày)" value={recentIssues} />
        <StatCard
          icon={AlertTriangle}
          label="Cảnh báo tồn thấp"
          value={lowStockItems.length}
          alert={lowStockItems.length > 0}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <LowStockCard items={lowStockItems} />
        <RecentMovementsCard movements={recentMovements} itemMap={itemMap} />
      </div>

      <CapacityOverviewCard results={capacityResults} />
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  alert,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  alert?: boolean;
}) {
  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={20} className="text-muted-foreground" />
        <span className="text-small text-muted-foreground">{label}</span>
      </div>
      <p
        className={`text-[28px] font-semibold tabular-nums ${
          alert ? "text-[#e37400]" : "text-foreground"
        }`}
      >
        {formatNumber(value)}
      </p>
    </div>
  );
}

function LowStockCard({ items }: { items: LowStockItem[] }) {
  return (
    <div className="rounded-md border border-border">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <AlertTriangle size={18} className="text-muted-foreground" />
        <h3 className="text-section-title">Cảnh báo tồn thấp</h3>
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Không có cảnh báo
          </p>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 8).map((entry) => (
              <div
                key={entry.item.id}
                className="flex items-center justify-between py-1.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium shrink-0">
                    {entry.item.id}
                  </span>
                  <span className="text-sm text-muted-foreground truncate">
                    {entry.item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-sm tabular-nums font-medium text-destructive">
                    {entry.currentStock}
                  </span>
                  <span className="text-small text-muted-foreground">/</span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {entry.minStock}
                  </span>
                  <Badge className="bg-warning-container text-[#e37400] border-0">
                    Thấp
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MovementTypeBadge({ type }: { type: StockMovement["type"] }) {
  switch (type) {
    case "receipt":
      return (
        <Badge className="bg-success-container text-[#1e8e3e] border-0 w-16 justify-center">
          Nhập
        </Badge>
      );
    case "issue":
      return (
        <Badge className="bg-primary-container text-primary border-0 w-16 justify-center">
          Xuất
        </Badge>
      );
    case "adjustment":
      return (
        <Badge className="bg-warning-container text-[#e37400] border-0 w-16 justify-center">
          Đ.chỉnh
        </Badge>
      );
  }
}

function RecentMovementsCard({
  movements,
  itemMap,
}: {
  movements: StockMovement[];
  itemMap: Map<string, { id: string; name: string; unit: string }>;
}) {
  return (
    <div className="rounded-md border border-border">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <History size={18} className="text-muted-foreground" />
        <h3 className="text-section-title">Hoạt động gần đây</h3>
      </div>
      <div className="p-4">
        {movements.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Chưa có hoạt động
          </p>
        ) : (
          <div className="space-y-2">
            {movements.map((m) => {
              const item = itemMap.get(m.itemId);
              const isPositive = m.quantity > 0;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-1.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MovementTypeBadge type={m.type} />
                    <span className="text-sm truncate">
                      {item?.name ?? m.itemId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span
                      className={`text-sm tabular-nums font-medium ${
                        isPositive ? "text-[#1e8e3e]" : "text-destructive"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {m.quantity}
                    </span>
                    <span className="text-small text-muted-foreground w-20 text-right">
                      {formatRelativeTime(m.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CapacityOverviewCard({ results }: { results: CapacityResult[] }) {
  return (
    <div className="rounded-md border border-border">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Gauge size={18} className="text-muted-foreground" />
        <h3 className="text-section-title">Năng lực sản xuất</h3>
      </div>
      <div className="p-4">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Chưa có BOM sản xuất
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {results.map((r) => (
              <div
                key={r.bomId}
                className="rounded-md border border-border p-3"
              >
                <p className="text-sm font-semibold mb-1">{r.bomName}</p>
                <p
                  className={`text-[24px] font-semibold tabular-nums ${
                    r.maxProducible > 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {formatNumber(r.maxProducible)}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    chiếc
                  </span>
                </p>
                {r.bottleneck && (
                  <p className="text-small text-muted-foreground mt-1 truncate" title={r.bottleneck.itemName}>
                    Nguyên liệu thiếu: {r.bottleneck.itemName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
