"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AlertTriangle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { getStockMap } from "@/store/selectors";
import type { StockMovement } from "@/types";
import { generateId } from "@/lib/id";

interface IssueLine {
  itemId: string;
  itemName: string;
  unit: string;
  requiredPerUnit: number;
  totalRequired: number;
  currentStock: number;
  sufficient: boolean;
}

export function IssueByBom() {
  const boms = useBoundStore((s) => s.boms);
  const items = useBoundStore((s) => s.items);
  const movements = useBoundStore((s) => s.movements);
  const addBulkMovements = useBoundStore((s) => s.addBulkMovements);

  const productionBoms = useMemo(
    () => boms.filter((b) => b.type === "production"),
    [boms],
  );

  const stockMap = useMemo(() => getStockMap(movements), [movements]);
  const itemMap = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items],
  );

  const [selectedBomId, setSelectedBomId] = useState("");
  const [vehicleCount, setVehicleCount] = useState("1");
  const [step, setStep] = useState<"select" | "review">("select");
  const [lines, setLines] = useState<IssueLine[]>([]);

  const selectedBom = boms.find((b) => b.id === selectedBomId);

  function calculateLines() {
    if (!selectedBom) return;
    const count = parseInt(vehicleCount, 10);
    if (isNaN(count) || count <= 0) return;

    const currentVersion = selectedBom.versions.find(
      (v) => v.version === selectedBom.currentVersion,
    );
    if (!currentVersion) return;

    const calculated: IssueLine[] = currentVersion.lines.map((line) => {
      const item = itemMap.get(line.itemId);
      const stock = stockMap[line.itemId] ?? 0;
      const totalNeeded = line.quantity * count;
      return {
        itemId: line.itemId,
        itemName: item?.name ?? line.itemId,
        unit: line.unit,
        requiredPerUnit: line.quantity,
        totalRequired: totalNeeded,
        currentStock: stock,
        sufficient: stock >= totalNeeded,
      };
    });

    setLines(calculated);
    setStep("review");
  }

  const allSufficient = lines.every((l) => l.sufficient);
  const insufficientCount = lines.filter((l) => !l.sufficient).length;

  function handleConfirm() {
    if (!selectedBom) return;
    const count = parseInt(vehicleCount, 10);

    const now = new Date().toISOString();
    const newMovements: StockMovement[] = lines.map((line) => ({
      id: generateId(),
      itemId: line.itemId,
      type: "issue" as const,
      quantity: -line.totalRequired,
      bomId: selectedBomId,
      bomVersion: selectedBom.currentVersion,
      reason: `Xuất kho sản xuất ${count} xe ${selectedBom.name}`,
      createdAt: now,
      createdBy: "Nhân viên kho",
    }));

    addBulkMovements(newMovements);
    toast.success(
      `Xuất kho thành công: ${count} xe ${selectedBom.name} (${lines.length} vật liệu)`,
    );
    setStep("select");
    setSelectedBomId("");
    setVehicleCount("1");
    setLines([]);
  }

  if (step === "review" && lines.length > 0) {
    const count = parseInt(vehicleCount, 10);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-section-title">
              Xuất kho: {count} xe {selectedBom?.name}
            </h3>
            {allSufficient ? (
              <p className="text-sm text-[#1e8e3e]">
                <Check size={14} className="inline mr-1" />
                Đủ vật liệu cho toàn bộ đơn xuất
              </p>
            ) : (
              <p className="text-sm text-destructive">
                <AlertTriangle size={14} className="inline mr-1" />
                {insufficientCount} vật liệu không đủ tồn kho
              </p>
            )}
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
                <th className="h-10 px-3 text-right text-label uppercase text-muted-foreground">
                  Tồn kho
                </th>
                <th className="h-10 px-3 text-right text-label uppercase text-muted-foreground">
                  Cần/xe
                </th>
                <th className="h-10 px-3 text-right text-label uppercase text-muted-foreground">
                  Tổng cần
                </th>
                <th className="h-10 px-3 text-center text-label uppercase text-muted-foreground">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr
                  key={line.itemId}
                  className={`border-t border-outline-variant ${
                    !line.sufficient ? "bg-error-container/30" : ""
                  }`}
                >
                  <td className="px-3 py-2 font-medium">{line.itemId}</td>
                  <td className="px-3 py-2 truncate" title={line.itemName}>
                    {line.itemName}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium">
                    {line.currentStock}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {line.requiredPerUnit}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium">
                    {line.totalRequired}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {line.sufficient ? (
                      <Badge className="bg-success-container text-[#1e8e3e] border-0">
                        Đủ
                      </Badge>
                    ) : (
                      <Badge className="bg-error-container text-destructive border-0">
                        Thiếu {line.totalRequired - line.currentStock}
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2">
          {!allSufficient && (
            <span className="flex items-center text-sm text-muted-foreground">
              Vẫn có thể xuất kho dù thiếu (tồn kho sẽ âm)
            </span>
          )}
          <Button onClick={handleConfirm}>
            Xác nhận xuất kho
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-section-title">Xuất kho theo BOM sản xuất</h3>
        <p className="text-sm text-muted-foreground">
          Chọn mẫu xe và số lượng cần sản xuất — hệ thống sẽ tính toán vật liệu
          cần xuất
        </p>
      </div>

      <div className="grid gap-4 max-w-md">
        <div className="grid gap-1.5">
          <Label>Mẫu xe</Label>
          <Select
            value={selectedBomId}
            onValueChange={(v) => setSelectedBomId(v ?? "")}
          >
            <SelectTrigger className="w-full">
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

        <div className="grid gap-1.5">
          <Label htmlFor="vehicle-count">Số lượng xe</Label>
          <Input
            id="vehicle-count"
            type="number"
            min={1}
            value={vehicleCount}
            onChange={(e) => setVehicleCount(e.target.value)}
            className="max-w-32"
          />
        </div>

        <Button
          onClick={calculateLines}
          disabled={!selectedBomId || !vehicleCount || parseInt(vehicleCount, 10) <= 0}
          className="w-fit"
        >
          Kiểm tra vật liệu
        </Button>
      </div>
    </div>
  );
}
