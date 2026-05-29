"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { PurchaseOrder, Supplier } from "@/types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { POStatusBadge } from "./po-status-badge";
import { formatDate, formatCurrency } from "@/lib/format";

interface POColumnsOptions {
  suppliers: Supplier[];
  onView: (po: PurchaseOrder) => void;
  onConfirm: (po: PurchaseOrder) => void;
  onReceive: (po: PurchaseOrder) => void;
  onEdit: (po: PurchaseOrder) => void;
  onCancel: (po: PurchaseOrder) => void;
}

export function getPOColumns({
  suppliers,
  onView,
  onConfirm,
  onReceive,
  onEdit,
  onCancel,
}: POColumnsOptions): ColumnDef<PurchaseOrder>[] {
  const supplierMap = new Map(suppliers.map((s) => [s.id, s]));

  return [
    {
      accessorKey: "code",
      header: "Mã đơn",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.code}</span>
      ),
      size: 170,
    },
    {
      id: "supplierName",
      header: "Nhà cung cấp",
      accessorFn: (row) =>
        supplierMap.get(row.supplierId)?.name ?? row.supplierId,
      cell: ({ row }) => (
        <span
          className="truncate"
          title={supplierMap.get(row.original.supplierId)?.name ?? ""}
        >
          {supplierMap.get(row.original.supplierId)?.name ?? row.original.supplierId}
        </span>
      ),
    },
    {
      accessorKey: "orderDate",
      header: "Ngày đặt",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {formatDate(row.original.orderDate)}
        </span>
      ),
      size: 120,
    },
    {
      id: "expected",
      header: "Dự kiến",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.expectedDate
            ? formatDate(row.original.expectedDate)
            : "—"}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <POStatusBadge status={row.original.status} />,
      size: 140,
    },
    {
      id: "total",
      header: () => <div className="text-right">Tổng tiền</div>,
      cell: ({ row }) => {
        const total = row.original.lines.reduce(
          (sum, l) => sum + l.quantity * l.unitPrice,
          0,
        );
        return (
          <div className="text-right tabular-nums font-medium">
            {formatCurrency(total)}
          </div>
        );
      },
      size: 160,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const po = row.original;
        const canConfirm = po.status === "draft";
        const canReceive = po.status === "ordered" || po.status === "partial";
        const canEdit = po.status === "draft";
        const canCancel = po.status === "draft" || po.status === "ordered";

        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onView(po)}
              title="Xem chi tiết"
            >
              <Eye size={16} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" />}
              >
                <MoreHorizontal size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(po)}>
                  Xem chi tiết
                </DropdownMenuItem>
                {canConfirm && (
                  <DropdownMenuItem onClick={() => onConfirm(po)}>
                    Xác nhận đặt hàng
                  </DropdownMenuItem>
                )}
                {canReceive && (
                  <DropdownMenuItem onClick={() => onReceive(po)}>
                    Ghi nhận nhập hàng
                  </DropdownMenuItem>
                )}
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(po)}>
                    Sửa
                  </DropdownMenuItem>
                )}
                {canCancel && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onCancel(po)}
                      className="text-destructive"
                    >
                      Huỷ đơn
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 100,
    },
  ];
}
