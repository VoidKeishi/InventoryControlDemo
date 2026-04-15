"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemSelect } from "@/components/shared/item-select";
import { useBoundStore } from "@/store";
import { generateId } from "@/lib/id";

export function ReceiptIndividual() {
  const items = useBoundStore((s) => s.items);
  const addMovement = useBoundStore((s) => s.addMovement);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const selectedItem = items.find((i) => i.id === selectedItemId);

  function handleSubmit() {
    if (!selectedItemId || !quantity) return;
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) return;

    addMovement({
      id: generateId(),
      itemId: selectedItemId,
      type: "receipt",
      quantity: qty,
      bomId: null,
      bomVersion: null,
      reason: reason.trim() || "Nhập kho lẻ",
      createdAt: new Date().toISOString(),
      createdBy: "Nhân viên kho",
    });

    toast.success(
      `Nhập kho thành công: ${qty} ${selectedItem?.unit ?? ""} ${selectedItem?.name ?? selectedItemId}`,
    );
    setSelectedItemId(null);
    setQuantity("");
    setReason("");
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-section-title">Nhập kho lẻ</h3>
        <p className="text-sm text-muted-foreground">
          Nhập kho từng vật liệu riêng lẻ
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="receipt-qty">
              Số lượng {selectedItem ? `(${selectedItem.unit})` : ""}
            </Label>
            <Input
              id="receipt-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="VD: 100"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="receipt-reason">Lý do (tuỳ chọn)</Label>
            <Input
              id="receipt-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Mua thêm từ NCC"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedItemId || !quantity || parseInt(quantity, 10) <= 0}
          className="w-fit"
        >
          Xác nhận nhập kho
        </Button>
      </div>
    </div>
  );
}
