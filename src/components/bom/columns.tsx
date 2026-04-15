"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { BOM } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/format";

interface BomColumnsOptions {
  onView: (bom: BOM) => void;
  onEdit: (bom: BOM) => void;
  onDelete: (bom: BOM) => void;
}

export function getBomColumns({
  onView,
  onEdit,
  onDelete,
}: BomColumnsOptions): ColumnDef<BOM>[] {
  return [
    {
      accessorKey: "name",
      header: "Mẫu xe",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => (
        <span className="text-muted-foreground truncate" title={row.original.description}>
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.type === "production" ? "Sản xuất" : "Mua hàng"}
        </Badge>
      ),
      size: 120,
    },
    {
      id: "version",
      header: () => <div className="text-right">Phiên bản</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums font-medium">
          v{row.original.currentVersion}
        </div>
      ),
      size: 100,
    },
    {
      id: "lineCount",
      header: () => <div className="text-right">Vật liệu</div>,
      cell: ({ row }) => {
        const currentVer = row.original.versions.find(
          (v) => v.version === row.original.currentVersion,
        );
        return (
          <div className="text-right tabular-nums font-medium">
            {currentVer?.lines.length ?? 0}
          </div>
        );
      },
      size: 100,
    },
    {
      id: "lastUpdated",
      header: "Cập nhật",
      cell: ({ row }) => {
        const currentVer = row.original.versions.find(
          (v) => v.version === row.original.currentVersion,
        );
        return (
          <span className="text-small text-muted-foreground">
            {currentVer ? formatDate(currentVer.createdAt) : "—"}
          </span>
        );
      },
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
                  onClick={() => onView(row.original)}
                />
              }
            >
              <Eye size={16} />
            </TooltipTrigger>
            <TooltipContent>Xem chi tiết</TooltipContent>
          </Tooltip>
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
            <TooltipContent>Tạo phiên bản mới</TooltipContent>
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
      size: 120,
    },
  ];
}
