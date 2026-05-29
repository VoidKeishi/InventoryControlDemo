"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { POStatusBadge } from "./po-status-badge";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/format";
import type { Item, PurchaseOrder, Supplier } from "@/types";

interface PODetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: PurchaseOrder | null;
  supplier: Supplier | null;
  items: Item[];
  onConfirm: (po: PurchaseOrder) => void;
  onReceive: (po: PurchaseOrder) => void;
  onEdit: (po: PurchaseOrder) => void;
  onCancel: (po: PurchaseOrder) => void;
}

export function PODetailDialog({
  open,
  onOpenChange,
  po,
  supplier,
  items,
  onConfirm,
  onReceive,
  onEdit,
  onCancel,
}: PODetailDialogProps) {
  if (!po) return null;

  const itemMap = new Map(items.map((i) => [i.id, i]));
  const total = po.lines.reduce(
    (sum, l) => sum + l.quantity * l.unitPrice,
    0,
  );

  const canConfirm = po.status === "draft";
  const canReceive = po.status === "ordered" || po.status === "partial";
  const canEdit = po.status === "draft";
  const canCancel = po.status === "draft" || po.status === "ordered";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{po.code}</span>
            <POStatusBadge status={po.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <div className="text-label uppercase text-muted-foreground">
              Nhà cung cấp
            </div>
            <div className="mt-1 font-medium">
              {supplier?.name ?? po.supplierId}
            </div>
            {supplier?.phone && (
              <div className="text-xs text-muted-foreground">
                {supplier.phone}
              </div>
            )}
          </div>
          <div>
            <div className="text-label uppercase text-muted-foreground">
              Người tạo
            </div>
            <div className="mt-1">{po.createdBy}</div>
          </div>
          <div>
            <div className="text-label uppercase text-muted-foreground">
              Ngày đặt
            </div>
            <div className="mt-1 tabular-nums">
              {formatDate(po.orderDate)}
            </div>
          </div>
          <div>
            <div className="text-label uppercase text-muted-foreground">
              Dự kiến nhận
            </div>
            <div className="mt-1 tabular-nums">
              {po.expectedDate ? formatDate(po.expectedDate) : "—"}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-label uppercase text-muted-foreground">
              Ghi chú
            </div>
            <div className="mt-1 text-muted-foreground">
              {po.note || "—"}
            </div>
          </div>
        </div>

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
                <th className="h-9 w-32 px-3 text-right text-label uppercase text-muted-foreground">
                  Đơn giá
                </th>
                <th className="h-9 w-36 px-3 text-right text-label uppercase text-muted-foreground">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {po.lines.map((line) => {
                const item = itemMap.get(line.itemId);
                const subtotal = line.quantity * line.unitPrice;
                return (
                  <tr
                    key={line.itemId}
                    className="border-t border-outline-variant"
                  >
                    <td className="px-3 py-1.5 font-medium">{line.itemId}</td>
                    <td className="px-3 py-1.5">
                      <div>{item?.name ?? line.itemId}</div>
                      {line.note && (
                        <div className="text-xs text-muted-foreground">
                          {line.note}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {line.quantity} {item?.unit ?? ""}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      <span
                        className={
                          line.receivedQuantity >= line.quantity
                            ? "text-green-700"
                            : line.receivedQuantity > 0
                              ? "text-amber-700"
                              : "text-muted-foreground"
                        }
                      >
                        {line.receivedQuantity}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {formatCurrency(line.unitPrice)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums font-medium">
                      {formatCurrency(subtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-outline-variant bg-surface-dim">
                <td
                  colSpan={5}
                  className="h-9 px-3 text-right text-label uppercase text-muted-foreground"
                >
                  Tổng cộng
                </td>
                <td className="px-3 text-right tabular-nums font-semibold">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="text-xs text-muted-foreground">
          Tạo: {formatDateTime(po.createdAt)} · Cập nhật:{" "}
          {formatDateTime(po.updatedAt)}
        </div>

        <DialogFooter className="flex-wrap gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {canEdit && (
            <Button variant="outline" onClick={() => onEdit(po)}>
              Sửa
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outline"
              onClick={() => onCancel(po)}
              className="text-destructive"
            >
              Huỷ đơn
            </Button>
          )}
          {canConfirm && (
            <Button onClick={() => onConfirm(po)}>Xác nhận đặt hàng</Button>
          )}
          {canReceive && (
            <Button onClick={() => onReceive(po)}>Ghi nhận nhập hàng</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
