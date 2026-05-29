"use client";

import { useState, useMemo } from "react";
import { startOfMonth } from "date-fns";
import { Search } from "lucide-react";
import { useBoundStore } from "@/store";
import {
  getStockSummaryInPeriod,
  type StockSummaryRow,
} from "@/store/selectors";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeFilter, type DateRange } from "@/components/reports/date-range-filter";
import { formatNumber, formatCurrency } from "@/lib/format";
import { CATEGORIES } from "@/data/constants";

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export default function StockSummaryPage() {
  const items = useBoundStore((s) => s.items);
  const movements = useBoundStore((s) => s.movements);

  const [range, setRange] = useState<DateRange>(() => ({
    from: startOfMonth(new Date()),
    to: endOfToday(),
  }));
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () => getStockSummaryInPeriod(items, movements, range.from, range.to),
    [items, movements, range.from, range.to],
  );

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (category !== "all" && r.item.category !== category) return false;
      if (q) {
        const blob = `${r.item.id} ${r.item.name}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [rows, category, search]);

  const totals = useMemo(() => {
    const acc = {
      opening: { qty: 0, value: 0 },
      receipts: { qty: 0, value: 0 },
      issues: { qty: 0, value: 0 },
      adjustments: { qty: 0, value: 0 },
      closing: { qty: 0, value: 0 },
    };
    for (const r of filteredRows) {
      acc.opening.qty += r.opening.qty;
      acc.opening.value += r.opening.value;
      acc.receipts.qty += r.receipts.qty;
      acc.receipts.value += r.receipts.value;
      acc.issues.qty += r.issues.qty;
      acc.issues.value += r.issues.value;
      acc.adjustments.qty += r.adjustments.qty;
      acc.adjustments.value += r.adjustments.value;
      acc.closing.qty += r.closing.qty;
      acc.closing.value += r.closing.value;
    }
    return acc;
  }, [filteredRows]);

  return (
    <>
      <Header title="Báo cáo Nhập-Xuất-Tồn" />

      <div className="flex flex-wrap items-end gap-3 border-b border-border pb-3">
        <DateRangeFilter range={range} onChange={setRange} />
        <div className="grid gap-1.5">
          <label className="text-xs uppercase text-muted-foreground">Nhóm</label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v ?? "all")}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs uppercase text-muted-foreground">Tìm kiếm</label>
          <div className="relative w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Tìm mã hoặc tên vật tư..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          title="Đầu kỳ"
          qty={totals.opening.qty}
          value={totals.opening.value}
        />
        <SummaryCard
          title="Nhập"
          qty={totals.receipts.qty}
          value={totals.receipts.value}
          tone="positive"
        />
        <SummaryCard
          title="Xuất"
          qty={totals.issues.qty}
          value={totals.issues.value}
          tone="negative"
        />
        <SummaryCard
          title="Cuối kỳ"
          qty={totals.closing.qty}
          value={totals.closing.value}
        />
      </div>

      <div className="rounded-md border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-dim border-b border-outline-variant">
              <th
                rowSpan={2}
                className="h-10 px-3 text-left text-label uppercase text-muted-foreground sticky left-0 bg-surface-dim"
              >
                Mã VT
              </th>
              <th
                rowSpan={2}
                className="h-10 px-3 text-left text-label uppercase text-muted-foreground"
              >
                Tên vật tư
              </th>
              <th
                rowSpan={2}
                className="h-10 px-3 text-center text-label uppercase text-muted-foreground"
              >
                ĐVT
              </th>
              <th
                colSpan={2}
                className="h-10 px-3 text-center text-label uppercase text-muted-foreground border-l border-outline-variant"
              >
                Đầu kỳ
              </th>
              <th
                colSpan={2}
                className="h-10 px-3 text-center text-label uppercase text-muted-foreground border-l border-outline-variant bg-green-50"
              >
                Nhập
              </th>
              <th
                colSpan={2}
                className="h-10 px-3 text-center text-label uppercase text-muted-foreground border-l border-outline-variant bg-red-50"
              >
                Xuất
              </th>
              <th
                colSpan={2}
                className="h-10 px-3 text-center text-label uppercase text-muted-foreground border-l border-outline-variant"
              >
                Cuối kỳ
              </th>
            </tr>
            <tr className="bg-surface-dim border-b border-outline-variant">
              <th className="h-9 px-3 text-right text-label uppercase text-muted-foreground border-l border-outline-variant">
                SL
              </th>
              <th className="h-9 px-3 text-right text-label uppercase text-muted-foreground">
                Giá trị
              </th>
              <th className="h-9 px-3 text-right text-label uppercase text-muted-foreground border-l border-outline-variant bg-green-50">
                SL
              </th>
              <th className="h-9 px-3 text-right text-label uppercase text-muted-foreground bg-green-50">
                Giá trị
              </th>
              <th className="h-9 px-3 text-right text-label uppercase text-muted-foreground border-l border-outline-variant bg-red-50">
                SL
              </th>
              <th className="h-9 px-3 text-right text-label uppercase text-muted-foreground bg-red-50">
                Giá trị
              </th>
              <th className="h-9 px-3 text-right text-label uppercase text-muted-foreground border-l border-outline-variant">
                SL
              </th>
              <th className="h-9 px-3 text-right text-label uppercase text-muted-foreground">
                Giá trị
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có biến động trong kỳ
                </td>
              </tr>
            ) : (
              filteredRows.map((r) => <SummaryRow key={r.item.id} row={r} />)
            )}
          </tbody>
          {filteredRows.length > 0 && (
            <tfoot>
              <tr className="bg-surface-dim border-t border-outline-variant font-medium">
                <td colSpan={3} className="h-10 px-3 text-right text-label uppercase text-muted-foreground">
                  Tổng cộng
                </td>
                <td className="h-10 px-3 text-right tabular-nums border-l border-outline-variant">
                  {formatNumber(totals.opening.qty)}
                </td>
                <td className="h-10 px-3 text-right tabular-nums">
                  {formatCurrency(totals.opening.value)}
                </td>
                <td className="h-10 px-3 text-right tabular-nums border-l border-outline-variant bg-green-50">
                  {formatNumber(totals.receipts.qty)}
                </td>
                <td className="h-10 px-3 text-right tabular-nums bg-green-50">
                  {formatCurrency(totals.receipts.value)}
                </td>
                <td className="h-10 px-3 text-right tabular-nums border-l border-outline-variant bg-red-50">
                  {formatNumber(totals.issues.qty)}
                </td>
                <td className="h-10 px-3 text-right tabular-nums bg-red-50">
                  {formatCurrency(totals.issues.value)}
                </td>
                <td className="h-10 px-3 text-right tabular-nums border-l border-outline-variant">
                  {formatNumber(totals.closing.qty)}
                </td>
                <td className="h-10 px-3 text-right tabular-nums">
                  {formatCurrency(totals.closing.value)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
}

function SummaryRow({ row }: { row: StockSummaryRow }) {
  return (
    <tr className="border-b border-outline-variant hover:bg-[#e8eaed]">
      <td className="h-10 px-3 font-medium sticky left-0 bg-white">
        {row.item.id}
      </td>
      <td className="h-10 px-3 truncate" title={row.item.name}>
        {row.item.name}
      </td>
      <td className="h-10 px-3 text-center text-muted-foreground">
        {row.item.unit}
      </td>
      <td className="h-10 px-3 text-right tabular-nums border-l border-outline-variant">
        {formatNumber(row.opening.qty)}
      </td>
      <td className="h-10 px-3 text-right tabular-nums text-muted-foreground">
        {row.opening.value > 0 ? formatCurrency(row.opening.value) : "—"}
      </td>
      <td className="h-10 px-3 text-right tabular-nums border-l border-outline-variant bg-green-50/40 text-green-700">
        {row.receipts.qty > 0 ? formatNumber(row.receipts.qty) : "—"}
      </td>
      <td className="h-10 px-3 text-right tabular-nums bg-green-50/40 text-green-700">
        {row.receipts.value > 0 ? formatCurrency(row.receipts.value) : "—"}
      </td>
      <td className="h-10 px-3 text-right tabular-nums border-l border-outline-variant bg-red-50/40 text-red-700">
        {row.issues.qty > 0 ? formatNumber(row.issues.qty) : "—"}
      </td>
      <td className="h-10 px-3 text-right tabular-nums bg-red-50/40 text-red-700">
        {row.issues.value > 0 ? formatCurrency(row.issues.value) : "—"}
      </td>
      <td className="h-10 px-3 text-right tabular-nums border-l border-outline-variant font-medium">
        {formatNumber(row.closing.qty)}
      </td>
      <td className="h-10 px-3 text-right tabular-nums font-medium">
        {row.closing.value > 0 ? formatCurrency(row.closing.value) : "—"}
      </td>
    </tr>
  );
}

function SummaryCard({
  title,
  qty,
  value,
  tone,
}: {
  title: string;
  qty: number;
  value: number;
  tone?: "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-green-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase text-muted-foreground">{title}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${toneClass}`}>
        {formatNumber(qty)}
      </div>
      <div className="mt-1 text-sm tabular-nums text-muted-foreground">
        {formatCurrency(value)}
      </div>
    </div>
  );
}
