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
import { getBomColumns } from "@/components/bom/columns";
import { BomFormDialog } from "@/components/bom/bom-form-dialog";
import { BomDetailDialog } from "@/components/bom/bom-detail-dialog";
import { BomVersionDialog } from "@/components/bom/bom-version-dialog";
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
import type { BOM, BOMLine, BOMVersion } from "@/types";
import { generateId } from "@/lib/id";

export default function ProductionBomPage() {
  const allBoms = useBoundStore((s) => s.boms);
  const items = useBoundStore((s) => s.items);
  const addBOM = useBoundStore((s) => s.addBOM);
  const addBOMVersion = useBoundStore((s) => s.addBOMVersion);
  const deleteBOM = useBoundStore((s) => s.deleteBOM);

  const productionBoms = useMemo(
    () => allBoms.filter((b) => b.type === "production"),
    [allBoms],
  );

  const [formOpen, setFormOpen] = useState(false);
  const [detailBom, setDetailBom] = useState<BOM | null>(null);
  const [versionBom, setVersionBom] = useState<BOM | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BOM | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      getBomColumns({
        onView: setDetailBom,
        onEdit: setVersionBom,
        onDelete: setDeleteTarget,
      }),
    [],
  );

  const table = useReactTable({
    data: productionBoms,
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

  function handleCreateBom(values: {
    name: string;
    description: string;
    lines: BOMLine[];
  }) {
    const id = `bom_${values.name.toLowerCase().replace(/\s+/g, "_")}_prod`;
    const newBom: BOM = {
      id,
      type: "production",
      name: values.name,
      description: values.description,
      currentVersion: 1,
      versions: [
        {
          version: 1,
          createdAt: new Date().toISOString(),
          note: "Phiên bản khởi tạo",
          lines: values.lines,
        },
      ],
    };
    addBOM(newBom);
    toast.success(`Đã tạo BOM sản xuất "${values.name}"`);
  }

  function handleNewVersion(
    bomId: string,
    note: string,
    lines: BOMLine[],
  ) {
    const bom = allBoms.find((b) => b.id === bomId);
    if (!bom) return;
    const newVersion: BOMVersion = {
      version: bom.currentVersion + 1,
      createdAt: new Date().toISOString(),
      note: note || "Cập nhật định mức",
      lines,
    };
    addBOMVersion(bomId, newVersion);
    toast.success(
      `Đã tạo phiên bản v${newVersion.version} cho "${bom.name}"`,
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteBOM(deleteTarget.id);
    toast.success(`Đã xoá BOM "${deleteTarget.name}"`);
    setDeleteTarget(null);
  }

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <>
      <Header title="BOM Sản xuất">
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} />
          Tạo BOM
        </Button>
      </Header>

      <div className="flex items-center justify-between border-b border-border pb-3 mb-0">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm mẫu xe..."
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
                  className="h-11 border-b border-outline-variant transition-colors duration-150 hover:bg-[#e8eaed] cursor-pointer"
                  onClick={() => setDetailBom(row.original)}
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

      {totalRows > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-3 mt-0">
          <span className="text-small text-muted-foreground">
            Hiển thị {startRow}-{endRow} / {totalRows}
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
      )}

      <BomFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        items={items}
        onSubmit={handleCreateBom}
      />

      <BomDetailDialog
        open={detailBom !== null}
        onOpenChange={(o) => {
          if (!o) setDetailBom(null);
        }}
        bom={detailBom}
        items={items}
      />

      <BomVersionDialog
        open={versionBom !== null}
        onOpenChange={(o) => {
          if (!o) setVersionBom(null);
        }}
        bom={versionBom}
        items={items}
        onSubmit={handleNewVersion}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
        title={`Xoá BOM "${deleteTarget?.name}"?`}
        description="BOM và toàn bộ phiên bản sẽ bị xoá. Hành động này không thể hoàn tác."
        confirmLabel="Xoá"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
