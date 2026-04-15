"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBoundStore } from "@/store";
import type { BOM, StockMovement } from "@/types";
import { generateId } from "@/lib/id";

interface ReceiptLine {
  itemId: string;
  itemName: string;
  unit: string;
  bomQty: number;
  receiptQty: number;
}

export function ReceiptByBom() {
  const boms = useBoundStore((s) => s.boms);
  const items = useBoundStore((s) => s.items);
  const addBulkMovements = useBoundStore((s) => s.addBulkMovements);

  const purchaseBoms = useMemo(
    () => boms.filter((b) => b.type === "purchase"),
    [boms],
  );

  const [selectedBomId, setSelectedBomId] = useState<string>("");
  const [lines, setLines] = useState<ReceiptLine[]>([]);
  const [step, setStep] = useState<"select" | "review">("select");

  const selectedBom = boms.find((b) => b.id === selectedBomId);
  const itemMap = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items],
  );

  function handleBomSelect(bomId: string) {
    setSelectedBomId(bomId);
    const bom = boms.find((b) => b.id === bomId);
    if (!bom) return;

    const currentVersion = bom.versions.find(
      (v) => v.version === bom.currentVersion,
    );
    if (!currentVersion) return;

    setLines(
      currentVersion.lines.map((line) => {
        const item = itemMap.get(line.itemId);
        return {
          itemId: line.itemId,
          itemName: item?.name ?? line.itemId,
          unit: line.unit,
          bomQty: line.quantity,
          receiptQty: line.quantity,
        };
      }),
    );
  }

  function handleConfirm() {
    const validLines = lines.filter((l) => l.receiptQty > 0);
    if (validLines.length === 0) return;

    const now = new Date().toISOString();
    const movements: StockMovement[] = validLines.map((line, i) => ({
      id: generateId(),
      itemId: line.itemId,
      type: "receipt" as const,
      quantity: line.receiptQty,
      bomId: selectedBomId,
      bomVersion: selectedBom?.currentVersion ?? null,
      reason: `Nhập kho theo BOM: ${selectedBom?.name ?? selectedBomId}`,
      createdAt: now,
      createdBy: "Nhân viên kho",
    }));

    addBulkMovements(movements);
    toast.success(
      `Nhập kho thành công (${validLines.length} vật liệu từ ${selectedBom?.name})`,
    );
    setStep("select");
    setSelectedBomId("");
    setLines([]);
  }

  if (step === "review" && lines.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-section-title">Xác nhận nhập kho</h3>
            <p className="text-sm text-muted-foreground">
              BOM: {selectedBom?.name} — Kiểm tra số lượng trước khi xác nhận
            </p>
          </div>
          <Button variant="outline" onClick={() => setStep("select")}>
            Quay lại
          </Button>
        </div>

        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-dim">
                <th className="h-10 px-3 text-left text-label uppercase text-muted-foreground">
                  Mã
                </th>
                <th className="h-10 px-3 text-left text-label uppercase text-muted-foreground">
                  Tên vật liệu
                </th>
                <th className="h-10 px-3 text-center text-label uppercase text-muted-foreground">
                  ĐVT
                </th>
                <th className="h-10 px-3 text-right text-label uppercase text-muted-foreground">
                  Định mức
                </th>
                <th className="h-10 w-32 px-3 text-right text-label uppercase text-muted-foreground">
                  Số lượng nhập
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr
                  key={line.itemId}
                  className="border-t border-outline-variant"
                >
                  <td className="px-3 py-2 font-medium">{line.itemId}</td>
                  <td className="px-3 py-2 truncate" title={line.itemName}>
                    {line.itemName}
                  </td>
                  <td className="px-3 py-2 text-center text-muted-foreground">
                    {line.unit}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium text-muted-foreground">
                    {line.bomQty}
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      value={line.receiptQty}
                      onChange={(e) => {
                        const updated = [...lines];
                        updated[index] = {
                          ...updated[index],
                          receiptQty: parseInt(e.target.value, 10) || 0,
                        };
                        setLines(updated);
                      }}
                      className="h-8 w-full text-right tabular-nums"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleConfirm}>
            Xác nhận nhập kho ({lines.filter((l) => l.receiptQty > 0).length}{" "}
            vật liệu)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-section-title">Nhập kho theo BOM</h3>
        <p className="text-sm text-muted-foreground">
          Chọn BOM mua hàng hoặc BOM sản xuất để nhập kho hàng loạt
        </p>
      </div>

      <div className="grid gap-3 max-w-md">
        <Label>Chọn BOM</Label>
        <Select value={selectedBomId} onValueChange={(v) => handleBomSelect(v ?? "")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn BOM để nhập kho..." />
          </SelectTrigger>
          <SelectContent>
            {boms.map((bom) => (
              <SelectItem key={bom.id} value={bom.id}>
                {bom.name} ({bom.type === "purchase" ? "Mua hàng" : "Sản xuất"})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedBomId && lines.length > 0 && (
        <Button onClick={() => setStep("review")}>
          Tiếp tục ({lines.length} vật liệu)
        </Button>
      )}
    </div>
  );
}
