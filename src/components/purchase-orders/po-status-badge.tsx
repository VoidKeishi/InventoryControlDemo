"use client";

import { Badge } from "@/components/ui/badge";
import type { PurchaseOrderStatus } from "@/types";

const STATUS_CONFIG: Record<
  PurchaseOrderStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Nháp",
    className: "bg-surface-dim text-muted-foreground border-border",
  },
  ordered: {
    label: "Đã đặt hàng",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  partial: {
    label: "Nhập một phần",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  received: {
    label: "Đã nhận đủ",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Đã huỷ",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export const PO_STATUS_ORDER: PurchaseOrderStatus[] = [
  "draft",
  "ordered",
  "partial",
  "received",
  "cancelled",
];

export function getPOStatusLabel(status: PurchaseOrderStatus): string {
  return STATUS_CONFIG[status].label;
}

export function POStatusBadge({ status }: { status: PurchaseOrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`h-[22px] border ${cfg.className}`}>
      {cfg.label}
    </Badge>
  );
}
