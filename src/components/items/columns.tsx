"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ItemColumnsOptions {
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  stockMap: Record<string, number>;
}

export function getItemColumns({
  onEdit,
  onDelete,
  stockMap,
}: ItemColumnsOptions): ColumnDef<Item>[] {
  return [
    {
      accessorKey: "id",
      header: "Mã",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.id}</span>
      ),
      size: 100,
    },
    {
      accessorKey: "name",
      header: "Tên vật liệu",
      cell: ({ row }) => (
        <span className="truncate" title={row.original.name}>
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Nhóm",
      cell: ({ row }) => (
        <Badge variant="secondary" className="h-[22px]">{row.original.category}</Badge>
      ),
      size: 140,
    },
    {
      accessorKey: "unit",
      header: "ĐVT",
      size: 80,
    },
    {
      id: "stock",
      header: () => <div className="text-right">Tồn kho</div>,
      cell: ({ row }) => {
        const stock = stockMap[row.original.id] ?? 0;
        const isLow =
          row.original.minStock !== null && stock < row.original.minStock;
        return (
          <div className="text-right tabular-nums font-medium">
            <span className={isLow ? "text-destructive" : ""}>{stock}</span>
          </div>
        );
      },
      size: 100,
    },
    {
      id: "minStock",
      header: () => <div className="text-right">Tồn tối thiểu</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums font-medium text-muted-foreground">
          {row.original.minStock ?? "—"}
        </div>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(row.original)}
                />
              }
            >
              <Pencil size={16} />
            </TooltipTrigger>
            <TooltipContent>Sửa</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(row.original)}
                />
              }
            >
              <Trash2 size={16} className="text-destructive" />
            </TooltipTrigger>
            <TooltipContent>Xoá</TooltipContent>
          </Tooltip>
        </div>
      ),
      size: 100,
    },
  ];
}
