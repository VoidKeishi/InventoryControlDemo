"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemSelect } from "@/components/shared/item-select";
import { useBoundStore } from "@/store";
import { getStockByItemId } from "@/store/selectors";
import { generateId } from "@/lib/id";

export function IssueIndividual() {
  const items = useBoundStore((s) => s.items);
  const movements = useBoundStore((s) => s.movements);
  const addMovement = useBoundStore((s) => s.addMovement);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const selectedItem = items.find((i) => i.id === selectedItemId);
  const currentStock = selectedItemId
    ? getStockByItemId(movements, selectedItemId)
    : 0;

  function handleSubmit() {
    if (!selectedItemId || !quantity) return;
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) return;

    addMovement({
      id: generateId(),
      itemId: selectedItemId,
      type: "issue",
      quantity: -qty,
      bomId: null,
      bomVersion: null,
      reason: reason.trim() || "Xuất kho lẻ",
      createdAt: new Date().toISOString(),
      createdBy: "Nhân viên kho",
    });

    toast.success(
      `Xuất kho thành công: ${qty} ${selectedItem?.unit ?? ""} ${selectedItem?.name ?? selectedItemId}`,
    );
    setSelectedItemId(null);
    setQuantity("");
    setReason("");
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-section-title">Xuất kho lẻ</h3>
        <p className="text-sm text-muted-foreground">
          Xuất kho từng vật liệu riêng lẻ
        </p>
      </div>

      <div className="grid gap-4 max-w-md">
        <div className="grid gap-1.5">
          <Label>Vật liệu</Label>
          <ItemSelect
            items={items}
            value={selectedItemId}
            onSelect={setSelectedItemId}
          />
          {selectedItemId && (
            <p className="text-small text-muted-foreground">
              Tồn kho hiện tại:{" "}
              <span className="font-medium tabular-nums">{currentStock}</span>{" "}
              {selectedItem?.unit}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="issue-qty">
              Số lượng xuất {selectedItem ? `(${selectedItem.unit})` : ""}
            </Label>
            <Input
              id="issue-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="VD: 10"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="issue-reason">Lý do</Label>
            <Input
              id="issue-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Sử dụng nội bộ"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedItemId || !quantity || parseInt(quantity, 10) <= 0}
          className="w-fit"
        >
          Xác nhận xuất kho
        </Button>
      </div>
    </div>
  );
}
