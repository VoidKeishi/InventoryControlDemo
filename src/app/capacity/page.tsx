"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "@/components/layout/header";
import { useBoundStore } from "@/store";
import {
  getProductionCapacity,
  type CapacityResult,
} from "@/store/selectors";
import { formatNumber } from "@/lib/format";

export default function CapacityPage() {
  const boms = useBoundStore((s) => s.boms);
  const items = useBoundStore((s) => s.items);
  const movements = useBoundStore((s) => s.movements);

  const productionBoms = useMemo(
    () => boms.filter((b) => b.type === "production"),
    [boms],
  );

  const [selectedBomId, setSelectedBomId] = useState(
    productionBoms[0]?.id ?? "",
  );

  const selectedBom = boms.find((b) => b.id === selectedBomId);

  const capacity: CapacityResult | null = useMemo(() => {
    if (!selectedBom) return null;
    return getProductionCapacity(selectedBom, items, movements);
  }, [selectedBom, items, movements]);

  return (
    <>
      <Header title="Tính năng lực sản xuất" />

      <div className="mb-6">
        <label className="mb-1.5 block text-sm text-muted-foreground">
          Chọn mẫu xe
        </label>
        <Select
          value={selectedBomId}
          onValueChange={(v) => setSelectedBomId(v ?? "")}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Chọn mẫu xe..." />
          </SelectTrigger>
          <SelectContent>
            {productionBoms.map((bom) => (
              <SelectItem key={bom.id} value={bom.id}>
                {bom.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {capacity && (
        <>
          <div className="mb-6 rounded-lg border border-border bg-primary-container/30 p-8 text-center">
            <p className="mb-2 text-sm text-muted-foreground">
              Có thể sản xuất tối đa
            </p>
            <p
              className={`text-hero tabular-nums ${
                capacity.maxProducible > 0 ? "text-primary" : "text-destructive"
              }`}
            >
              {formatNumber(capacity.maxProducible)}{" "}
              <span className="text-page-title">chiếc</span>
            </p>

            {capacity.bottleneck && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-warning-container px-4 py-1.5">
                <AlertTriangle size={16} className="text-[#e37400]" />
                <span className="text-sm font-medium text-[#e37400]">
                  Nguyên liệu thiếu: {capacity.bottleneck.itemName} (còn{" "}
                  {formatNumber(capacity.bottleneck.currentStock)}, cần{" "}
                  {capacity.bottleneck.requiredPerUnit}/xe)
                </span>
              </div>
            )}
          </div>

          <h3 className="text-section-title mb-3">Chi tiết vật liệu</h3>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-surface-dim hover:bg-surface-dim">
                  <TableHead className="h-10 px-3 text-label uppercase text-muted-foreground">
                    Mã
                  </TableHead>
                  <TableHead className="h-10 px-3 text-label uppercase text-muted-foreground">
                    Tên vật liệu
                  </TableHead>
                  <TableHead className="h-10 px-3 text-right text-label uppercase text-muted-foreground">
                    Tồn kho
                  </TableHead>
                  <TableHead className="h-10 px-3 text-right text-label uppercase text-muted-foreground">
                    Cần/xe
                  </TableHead>
                  <TableHead className="h-10 px-3 text-right text-label uppercase text-muted-foreground">
                    Đủ cho
                  </TableHead>
                  <TableHead className="h-10 px-3 text-center text-label uppercase text-muted-foreground">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capacity.details.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      BOM chưa có vật liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  capacity.details.map((detail) => {
                    const isBottleneck =
                      detail.maxProducible === capacity.maxProducible;
                    return (
                      <TableRow
                        key={detail.itemId}
                        className={`h-11 border-b border-outline-variant transition-colors duration-150 ${
                          isBottleneck
                            ? "bg-error-container/40"
                            : "hover:bg-[#e8eaed]"
                        }`}
                      >
                        <TableCell className="px-3 font-medium">
                          {detail.itemId}
                        </TableCell>
                        <TableCell
                          className="px-3 truncate"
                          title={detail.itemName}
                        >
                          {detail.itemName}
                        </TableCell>
                        <TableCell className="px-3 text-right tabular-nums font-medium">
                          {formatNumber(detail.currentStock)}
                        </TableCell>
                        <TableCell className="px-3 text-right tabular-nums text-muted-foreground">
                          {detail.requiredPerUnit}
                        </TableCell>
                        <TableCell className="px-3 text-right tabular-nums font-medium">
                          {formatNumber(detail.maxProducible)} xe
                        </TableCell>
                        <TableCell className="px-3 text-center">
                          {isBottleneck ? (
                            <Badge className="bg-error-container text-destructive border-0">
                              Thiếu
                            </Badge>
                          ) : (
                            <Badge className="bg-success-container text-[#1e8e3e] border-0">
                              Đủ
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {!capacity && selectedBomId === "" && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Gauge size={48} className="mb-4 opacity-30" />
          <p>Chọn mẫu xe để xem năng lực sản xuất</p>
        </div>
      )}
    </>
  );
}
