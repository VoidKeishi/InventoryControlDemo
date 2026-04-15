"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Item } from "@/types";
import { Badge } from "@/components/ui/badge";

export interface StockRow {
  item: Item;
  currentStock: number;
}

function StockStatusBadge({ row }: { row: StockRow }) {
  if (row.item.minStock === null) {
    return <Badge variant="secondary" className="h-[22px]">—</Badge>;
  }
  if (row.currentStock <= 0) {
    return <Badge className="bg-error-container text-destructive border-0 h-[22px]">Hết hàng</Badge>;
  }
  if (row.currentStock < row.item.minStock) {
    return <Badge className="bg-warning-container text-[#e37400] border-0 h-[22px]">Sắp hết</Badge>;
  }
  return <Badge className="bg-success-container text-[#1e8e3e] border-0 h-[22px]">Đủ hàng</Badge>;
}

export function getStockColumns(): ColumnDef<StockRow>[] {
  return [
    {
      id: "id",
      accessorFn: (row) => row.item.id,
      header: "Mã",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.item.id}
        </span>
      ),
      size: 100,
    },
    {
      id: "name",
      accessorFn: (row) => row.item.name,
      header: "Tên vật liệu",
      cell: ({ row }) => (
        <span className="truncate" title={row.original.item.name}>
          {row.original.item.name}
        </span>
      ),
    },
    {
      id: "category",
      accessorFn: (row) => row.item.category,
      header: "Nhóm",
      cell: ({ row }) => (
        <Badge variant="secondary" className="h-[22px]">{row.original.item.category}</Badge>
      ),
      size: 140,
    },
    {
      id: "unit",
      accessorFn: (row) => row.item.unit,
      header: "ĐVT",
      size: 80,
    },
    {
      id: "currentStock",
      accessorFn: (row) => row.currentStock,
      header: () => <div className="text-right">Tồn kho</div>,
      cell: ({ row }) => {
        const isLow =
          row.original.item.minStock !== null &&
          row.original.currentStock < row.original.item.minStock;
        return (
          <div className="text-right tabular-nums font-medium">
            <span className={isLow ? "text-destructive" : ""}>
              {row.original.currentStock}
            </span>
          </div>
        );
      },
      size: 100,
    },
    {
      id: "minStock",
      accessorFn: (row) => row.item.minStock ?? -1,
      header: () => <div className="text-right">Tồn tối thiểu</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums font-medium text-muted-foreground">
          {row.original.item.minStock ?? "—"}
        </div>
      ),
      size: 120,
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => <StockStatusBadge row={row.original} />,
      size: 110,
    },
  ];
}
