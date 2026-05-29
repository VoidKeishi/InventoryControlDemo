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
import { getPOColumns } from "@/components/purchase-orders/po-columns";
import {
  PO_STATUS_ORDER,
  getPOStatusLabel,
} from "@/components/purchase-orders/po-status-badge";
import { POFormDialog } from "@/components/purchase-orders/po-form-dialog";
import { PODetailDialog } from "@/components/purchase-orders/po-detail-dialog";
import { POReceiveDialog } from "@/components/purchase-orders/po-receive-dialog";
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
import type {
  PurchaseOrder,
  PurchaseOrderLine,
  PurchaseOrderStatus,
} from "@/types";

export default function PurchaseOrdersPage() {
  const items = useBoundStore((s) => s.items);
  const suppliers = useBoundStore((s) => s.suppliers);
  const purchaseOrders = useBoundStore((s) => s.purchaseOrders);
  const addPO = useBoundStore((s) => s.addPO);
  const updatePO = useBoundStore((s) => s.updatePO);
  const confirmPO = useBoundStore((s) => s.confirmPO);
  const cancelPO = useBoundStore((s) => s.cancelPO);
  const receivePO = useBoundStore((s) => s.receivePO);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PurchaseOrder | null>(null);
  const [detailTarget, setDetailTarget] = useState<PurchaseOrder | null>(null);
  const [receiveTarget, setReceiveTarget] = useState<PurchaseOrder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<PurchaseOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | "all">(
    "all",
  );
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "orderDate", desc: true },
  ]);

  const filtered = useMemo(() => {
    return purchaseOrders.filter((po) => {
      if (statusFilter !== "all" && po.status !== statusFilter) return false;
      if (supplierFilter !== "all" && po.supplierId !== supplierFilter)
        return false;
      return true;
    });
  }, [purchaseOrders, statusFilter, supplierFilter]);

  function openDetail(po: PurchaseOrder) {
    setDetailTarget(po);
  }

  function openEdit(po: PurchaseOrder) {
    setDetailTarget(null);
    setEditing(po);
    setFormOpen(true);
  }

  function openReceive(po: PurchaseOrder) {
    setDetailTarget(null);
    setReceiveTarget(po);
  }

  function handleConfirmPO(po: PurchaseOrder) {
    confirmPO(po.id);
    toast.success(`Đã xác nhận đơn ${po.code}`);
    setDetailTarget(null);
  }

  function handleCancelPO() {
    if (!cancelTarget) return;
    cancelPO(cancelTarget.id);
    toast.success(`Đã huỷ đơn ${cancelTarget.code}`);
    setCancelTarget(null);
    setDetailTarget(null);
  }

  const columns = useMemo(
    () =>
      getPOColumns({
        suppliers,
        onView: openDetail,
        onConfirm: handleConfirmPO,
        onReceive: openReceive,
        onEdit: openEdit,
        onCancel: setCancelTarget,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suppliers],
  );

  const table = useReactTable({
    data: filtered,
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
    supplierId: string;
    orderDate: string;
    expectedDate: string | null;
    note: string;
    lines: PurchaseOrderLine[];
  }) {
    if (editing) {
      updatePO(editing.id, values);
      toast.success(`Đã cập nhật đơn ${editing.code}`);
    } else {
      const { id, code } = nextPOIdAndCode(purchaseOrders, values.orderDate);
      const now = new Date().toISOString();
      addPO({
        id,
        code,
        supplierId: values.supplierId,
        status: "draft",
        orderDate: values.orderDate,
        expectedDate: values.expectedDate,
        lines: values.lines,
        note: values.note,
        createdBy: "Quản lý mua hàng",
        createdAt: now,
        updatedAt: now,
      });
      toast.success(`Đã tạo đơn ${code} (nháp)`);
    }
    setEditing(null);
  }

  const detailSupplier = detailTarget
    ? suppliers.find((s) => s.id === detailTarget.supplierId) ?? null
    : null;
  const receiveSupplier = receiveTarget
    ? suppliers.find((s) => s.id === receiveTarget.supplierId) ?? null
    : null;

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <>
      <Header title="Đơn mua hàng">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          disabled={suppliers.length === 0}
        >
          <Plus size={16} />
          Tạo đơn mua
        </Button>
      </Header>

      <div className="flex flex-wrap items-center gap-3 border-b border-border pb-3 mb-0">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm mã đơn hoặc tên NCC..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v as PurchaseOrderStatus | "all")
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {PO_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {getPOStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={supplierFilter}
          onValueChange={(v) => setSupplierFilter(v ?? "all")}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhà cung cấp</SelectItem>
            {suppliers.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  className="h-11 border-b border-outline-variant transition-colors duration-150 hover:bg-[#e8eaed] cursor-pointer"
                  onClick={(e) => {
                    // Don't trigger on action clicks
                    if ((e.target as HTMLElement).closest("button")) return;
                    openDetail(row.original);
                  }}
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
                  Không có đơn mua hàng
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

      <POFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        po={editing}
        suppliers={suppliers}
        items={items}
        onSubmit={handleFormSubmit}
      />

      <PODetailDialog
        open={detailTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDetailTarget(null);
        }}
        po={detailTarget}
        supplier={detailSupplier}
        items={items}
        onConfirm={handleConfirmPO}
        onReceive={openReceive}
        onEdit={openEdit}
        onCancel={(po) => setCancelTarget(po)}
      />

      <POReceiveDialog
        open={receiveTarget !== null}
        onOpenChange={(open) => {
          if (!open) setReceiveTarget(null);
        }}
        po={receiveTarget}
        supplier={receiveSupplier}
        items={items}
        onConfirm={(receipts) => {
          if (!receiveTarget) return;
          receivePO(receiveTarget.id, receipts, "Nhân viên kho");
          toast.success(`Đã ghi nhận nhập hàng theo ${receiveTarget.code}`);
          setReceiveTarget(null);
        }}
      />

      <ConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        title={`Huỷ đơn ${cancelTarget?.code}?`}
        description="Đơn mua sẽ chuyển sang trạng thái Đã huỷ. Hành động này không ảnh hưởng đến các lần nhập đã ghi nhận trước đó."
        confirmLabel="Huỷ đơn"
        destructive
        onConfirm={handleCancelPO}
      />
    </>
  );
}

function nextPOIdAndCode(
  existing: PurchaseOrder[],
  orderDateIso: string,
): { id: string; code: string } {
  const d = new Date(orderDateIso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const prefix = `PO-${y}-${m}-`;
  const numbers = existing
    .filter((po) => po.code.startsWith(prefix))
    .map((po) => parseInt(po.code.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  const code = `${prefix}${String(next).padStart(3, "0")}`;
  const id = `po_${y}_${m}_${String(next).padStart(3, "0")}`;
  return { id, code };
}
