"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useBoundStore } from "@/store";
import { getStockMap } from "@/store/selectors";
import { getItemColumns } from "@/components/items/columns";
import { ItemFormDialog } from "@/components/items/item-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Item } from "@/types";
import { generateId } from "@/lib/id";

export default function ItemsPage() {
  const items = useBoundStore((s) => s.items);
  const movements = useBoundStore((s) => s.movements);
  const addItem = useBoundStore((s) => s.addItem);
  const updateItem = useBoundStore((s) => s.updateItem);
  const deleteItem = useBoundStore((s) => s.deleteItem);

  const stockMap = useMemo(() => getStockMap(movements), [movements]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      getItemColumns({
        onEdit: (item) => {
          setEditingItem(item);
          setFormOpen(true);
        },
        onDelete: setDeleteTarget,
        stockMap,
      }),
    [stockMap],
  );

  const table = useReactTable({
    data: items,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  function handleFormSubmit(values: {
    name: string;
    unit: string;
    category: string;
    minStock: number | null;
  }) {
    if (editingItem) {
      updateItem(editingItem.id, values);
      toast.success(`Đã cập nhật vật liệu ${editingItem.id}`);
    } else {
      const prefix = getCategoryPrefix(values.category);
      const nextNum = getNextItemNumber(items, prefix);
      const id = `${prefix}-${String(nextNum).padStart(3, "0")}`;
      addItem({
        id,
        ...values,
        uomConversions: [],
      });
      toast.success(`Đã thêm vật liệu ${id}`);
    }
    setEditingItem(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteItem(deleteTarget.id);
    toast.success(`Đã xoá vật liệu ${deleteTarget.id}`);
    setDeleteTarget(null);
  }

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <>
      <Header title="Danh sách vật liệu">
        <Button
          onClick={() => {
            setEditingItem(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} />
          Thêm vật liệu
        </Button>
      </Header>

      <div className="flex items-center justify-between border-b border-border pb-3 mb-0">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm vật liệu..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-surface-dim hover:bg-surface-dim"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 px-3 text-label uppercase text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="h-11 border-b border-outline-variant transition-colors duration-150 hover:bg-[#e8eaed]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 mt-0">
        <span className="text-small text-muted-foreground">
          Hiển thị {totalRows > 0 ? startRow : 0}-{endRow} / {totalRows}
        </span>
        <div className="flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              if (v) table.setPageSize(Number(v));
            }}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} dòng
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <span className="text-small tabular-nums text-muted-foreground">
            Trang {pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Tiếp
          </Button>
        </div>
      </div>

      <ItemFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingItem(null);
        }}
        item={editingItem}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={`Xoá vật liệu ${deleteTarget?.id}?`}
        description={`Vật liệu "${deleteTarget?.name}" sẽ bị xoá khỏi hệ thống. Hành động này không thể hoàn tác.`}
        confirmLabel="Xoá"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}

function getCategoryPrefix(category: string): string {
  const prefixMap: Record<string, string> = {
    "Động cơ": "DC",
    "Khung sườn": "KS",
    "Ốc vít/Bu lông": "OV",
    "Điện/Đèn": "DD",
    "Nhựa/Vỏ": "NV",
    "Gioăng/Phớt": "GP",
    "Phụ kiện": "PK",
    "Khác": "KH",
  };
  return prefixMap[category] ?? "KH";
}

function getNextItemNumber(items: Item[], prefix: string): number {
  const existing = items
    .filter((i) => i.id.startsWith(prefix + "-"))
    .map((i) => {
      const num = parseInt(i.id.split("-")[1], 10);
      return isNaN(num) ? 0 : num;
    });
  return existing.length > 0 ? Math.max(...existing) + 1 : 1;
}
