"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemSelect } from "@/components/shared/item-select";
import { useBoundStore } from "@/store";
import { getStockByItemId } from "@/store/selectors";
import { generateId } from "@/lib/id";

export default function AdjustmentPage() {
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

  const qty = parseInt(quantity, 10);
  const isValid =
    selectedItemId !== null &&
    quantity !== "" &&
    !isNaN(qty) &&
    qty !== 0 &&
    reason.trim().length > 0;

  function handleSubmit() {
    if (!isValid || !selectedItemId) return;

    addMovement({
      id: generateId(),
      itemId: selectedItemId,
      type: "adjustment",
      quantity: qty,
      bomId: null,
      bomVersion: null,
      poId: null,
      unitPrice: null,
      reason: reason.trim(),
      createdAt: new Date().toISOString(),
      createdBy: "Quản lý kho",
    });

    const sign = qty > 0 ? "+" : "";
    toast.success(
      `Điều chỉnh kho thành công: ${sign}${qty} ${selectedItem?.unit ?? ""} ${selectedItem?.name ?? selectedItemId}`,
    );
    setSelectedItemId(null);
    setQuantity("");
    setReason("");
  }

  return (
    <>
      <Header title="Điều chỉnh kho" />

      <div className="space-y-4 max-w-md">
        <p className="text-sm text-muted-foreground">
          Điều chỉnh tồn kho thủ công cho kiểm kê hoặc sửa sai lệch. Bắt buộc
          nhập lý do.
        </p>

        <div className="grid gap-4">
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

          <div className="grid gap-1.5">
            <Label htmlFor="adj-qty">
              Số lượng điều chỉnh (dương = tăng, âm = giảm)
            </Label>
            <Input
              id="adj-qty"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="VD: -5 hoặc +10"
            />
            {selectedItemId && quantity && !isNaN(qty) && qty !== 0 && (
              <p className="text-small text-muted-foreground">
                Tồn kho sau điều chỉnh:{" "}
                <span className="font-medium tabular-nums">
                  {currentStock + qty}
                </span>{" "}
                {selectedItem?.unit}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="adj-reason">
              Lý do <span className="text-destructive">*</span>
            </Label>
            <Input
              id="adj-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Kiểm kê phát hiện thiếu 5 chiếc"
            />
          </div>

          <Button onClick={handleSubmit} disabled={!isValid} className="w-fit">
            Xác nhận điều chỉnh
          </Button>
        </div>
      </div>
    </>
  );
}
