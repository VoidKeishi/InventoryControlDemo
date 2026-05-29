"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Item, PurchaseOrder, Supplier } from "@/types";

interface POReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: PurchaseOrder | null;
  supplier: Supplier | null;
  items: Item[];
  onConfirm: (receipts: { itemId: string; quantity: number }[]) => void;
}

export function POReceiveDialog({
  open,
  onOpenChange,
  po,
  supplier,
  items,
  onConfirm,
}: POReceiveDialogProps) {
  const [thisTime, setThisTime] = useState<Record<string, number>>({});

  const rows = useMemo(() => {
    if (!po) return [];
    const itemMap = new Map(items.map((i) => [i.id, i]));
    return po.lines.map((line) => {
      const item = itemMap.get(line.itemId);
      const remaining = Math.max(0, line.quantity - line.receivedQuantity);
      return {
        itemId: line.itemId,
        ordered: line.quantity,
        received: line.receivedQuantity,
        remaining,
        unit: item?.unit ?? "",
        itemName: item?.name ?? line.itemId,
      };
    });
  }, [po, items]);

  function handleOpenChange(next: boolean) {
    if (!next) setThisTime({});
    onOpenChange(next);
  }

  function getThisTime(itemId: string, fallback: number) {
    return thisTime[itemId] ?? fallback;
  }

  function updateThisTime(itemId: string, value: number, remaining: number) {
    setThisTime((prev) => ({
      ...prev,
      [itemId]: Math.max(0, Math.min(remaining, value)),
    }));
  }

  function handleConfirm() {
    const receipts = rows
      .map((r) => ({
        itemId: r.itemId,
        quantity: getThisTime(r.itemId, r.remaining),
      }))
      .filter((r) => r.quantity > 0);
    if (receipts.length === 0) return;
    onConfirm(receipts);
    handleOpenChange(false);
  }

  const hasAny = rows.some(
    (r) => getThisTime(r.itemId, r.remaining) > 0 && r.remaining > 0,
  );
  const anyRemaining = rows.some((r) => r.remaining > 0);

  if (!po) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ghi nhận nhập hàng</DialogTitle>
          <DialogDescription>
            {po.code}
            {supplier ? ` — ${supplier.name}` : ""}
          </DialogDescription>
        </DialogHeader>

        {!anyRemaining ? (
          <p className="py-8 text-center text-muted-foreground">
            Đơn này đã nhận đủ tất cả các dòng.
          </p>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-dim">
                  <th className="h-9 px-3 text-left text-label uppercase text-muted-foreground">
                    Mã VT
                  </th>
                  <th className="h-9 px-3 text-left text-label uppercase text-muted-foreground">
                    Tên vật tư
                  </th>
                  <th className="h-9 w-20 px-3 text-right text-label uppercase text-muted-foreground">
                    Đặt
                  </th>
                  <th className="h-9 w-24 px-3 text-right text-label uppercase text-muted-foreground">
                    Đã nhận
                  </th>
                  <th className="h-9 w-24 px-3 text-right text-label uppercase text-muted-foreground">
                    Còn lại
                  </th>
                  <th className="h-9 w-32 px-3 text-right text-label uppercase text-muted-foreground">
                    Nhận lần này
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const value = getThisTime(r.itemId, r.remaining);
                  return (
                    <tr
                      key={r.itemId}
                      className="border-t border-outline-variant"
                    >
                      <td className="px-3 py-1.5 font-medium">{r.itemId}</td>
                      <td className="px-3 py-1.5">
                        <span className="truncate" title={r.itemName}>
                          {r.itemName}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {r.ordered} {r.unit}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                        {r.received}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {r.remaining}
                      </td>
                      <td className="px-3 py-1.5">
                        <Input
                          type="number"
                          min={0}
                          max={r.remaining}
                          value={value}
                          disabled={r.remaining === 0}
                          onChange={(e) =>
                            updateThisTime(
                              r.itemId,
                              parseInt(e.target.value, 10) || 0,
                              r.remaining,
                            )
                          }
                          className="h-8 text-right tabular-nums"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!hasAny}>
            Ghi nhận nhập kho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
