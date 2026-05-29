"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { Supplier } from "@/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SupplierColumnsOptions {
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export function getSupplierColumns({
  onEdit,
  onDelete,
}: SupplierColumnsOptions): ColumnDef<Supplier>[] {
  return [
    {
      accessorKey: "id",
      header: "Mã NCC",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.id}</span>
      ),
      size: 110,
    },
    {
      accessorKey: "name",
      header: "Tên nhà cung cấp",
      cell: ({ row }) => (
        <span className="truncate" title={row.original.name}>
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Điện thoại",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.phone || "—"}
        </span>
      ),
      size: 140,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email || "—"}</span>
      ),
      size: 220,
    },
    {
      accessorKey: "taxId",
      header: "MST",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.original.taxId || "—"}
        </span>
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
