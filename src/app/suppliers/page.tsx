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
import { getSupplierColumns } from "@/components/suppliers/supplier-columns";
import { SupplierFormDialog } from "@/components/suppliers/supplier-form-dialog";
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
import type { Supplier } from "@/types";

export default function SuppliersPage() {
  const suppliers = useBoundStore((s) => s.suppliers);
  const purchaseOrders = useBoundStore((s) => s.purchaseOrders);
  const addSupplier = useBoundStore((s) => s.addSupplier);
  const updateSupplier = useBoundStore((s) => s.updateSupplier);
  const deleteSupplier = useBoundStore((s) => s.deleteSupplier);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      getSupplierColumns({
        onEdit: (s) => {
          setEditing(s);
          setFormOpen(true);
        },
        onDelete: setDeleteTarget,
      }),
    [],
  );

  const table = useReactTable({
    data: suppliers,
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
    phone: string;
    email: string;
    address: string;
    taxId: string;
    note: string;
  }) {
    if (editing) {
      updateSupplier(editing.id, values);
      toast.success(`Đã cập nhật nhà cung cấp ${editing.id}`);
    } else {
      const id = nextSupplierId(suppliers);
      addSupplier({ id, ...values });
      toast.success(`Đã thêm nhà cung cấp ${id}`);
    }
    setEditing(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const referenced = purchaseOrders.some(
      (po) => po.supplierId === deleteTarget.id,
    );
    if (referenced) {
      toast.error(
        `Không thể xoá: nhà cung cấp ${deleteTarget.id} đang được tham chiếu trong đơn mua hàng`,
      );
      setDeleteTarget(null);
      return;
    }
    deleteSupplier(deleteTarget.id);
    toast.success(`Đã xoá nhà cung cấp ${deleteTarget.id}`);
    setDeleteTarget(null);
  }

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <>
      <Header title="Nhà cung cấp">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} />
          Thêm nhà cung cấp
        </Button>
      </Header>

      <div className="flex items-center justify-between border-b border-border pb-3 mb-0">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm nhà cung cấp..."
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

      <SupplierFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        supplier={editing}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={`Xoá nhà cung cấp ${deleteTarget?.id}?`}
        description={`Nhà cung cấp "${deleteTarget?.name}" sẽ bị xoá khỏi hệ thống. Hành động này không thể hoàn tác.`}
        confirmLabel="Xoá"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}

function nextSupplierId(suppliers: Supplier[]): string {
  const existing = suppliers
    .filter((s) => s.id.startsWith("SUP-"))
    .map((s) => {
      const n = parseInt(s.id.split("-")[1], 10);
      return isNaN(n) ? 0 : n;
    });
  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return `SUP-${String(next).padStart(3, "0")}`;
}
