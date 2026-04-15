"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { StockMovement, Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";

export interface MovementRow {
  movement: StockMovement;
  itemName: string;
  itemUnit: string;
}

function MovementTypeBadge({ type }: { type: StockMovement["type"] }) {
  switch (type) {
    case "receipt":
      return (
        <Badge className="bg-success-container text-[#1e8e3e] border-0">
          Nhập kho
        </Badge>
      );
    case "issue":
      return (
        <Badge className="bg-primary-container text-primary border-0">
          Xuất kho
        </Badge>
      );
    case "adjustment":
      return (
        <Badge className="bg-warning-container text-[#e37400] border-0">
          Điều chỉnh
        </Badge>
      );
  }
}

export function getMovementColumns(): ColumnDef<MovementRow>[] {
  return [
    {
      id: "createdAt",
      accessorFn: (row) => row.movement.createdAt,
      header: "Thời gian",
      cell: ({ row }) => (
        <span className="text-small text-muted-foreground whitespace-nowrap">
          {formatDateTime(row.original.movement.createdAt)}
        </span>
      ),
      size: 150,
    },
    {
      id: "type",
      accessorFn: (row) => row.movement.type,
      header: "Loại",
      cell: ({ row }) => (
        <MovementTypeBadge type={row.original.movement.type} />
      ),
      size: 110,
    },
    {
      id: "itemId",
      accessorFn: (row) => row.movement.itemId,
      header: "Mã VL",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.movement.itemId}</span>
      ),
      size: 90,
    },
    {
      id: "itemName",
      accessorFn: (row) => row.itemName,
      header: "Tên vật liệu",
      cell: ({ row }) => (
        <span className="truncate" title={row.original.itemName}>
          {row.original.itemName}
        </span>
      ),
    },
    {
      id: "quantity",
      accessorFn: (row) => row.movement.quantity,
      header: () => <div className="text-right">Số lượng</div>,
      cell: ({ row }) => {
        const qty = row.original.movement.quantity;
        const isPositive = qty > 0;
        return (
          <div
            className={`text-right tabular-nums font-medium ${
              isPositive ? "text-[#1e8e3e]" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}
            {qty} {row.original.itemUnit}
          </div>
        );
      },
      size: 120,
    },
    {
      id: "reason",
      accessorFn: (row) => row.movement.reason,
      header: "Lý do",
      cell: ({ row }) => (
        <span
          className="text-muted-foreground truncate"
          title={row.original.movement.reason}
        >
          {row.original.movement.reason}
        </span>
      ),
    },
    {
      id: "createdBy",
      accessorFn: (row) => row.movement.createdBy,
      header: "Người thực hiện",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.movement.createdBy}
        </span>
      ),
      size: 130,
    },
  ];
}
