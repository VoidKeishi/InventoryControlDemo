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
import { Search } from "lucide-react";
import { useBoundStore } from "@/store";
import {
  getMovementColumns,
  type MovementRow,
} from "@/components/movements/columns";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOVEMENT_TYPES } from "@/data/constants";

export default function MovementsPage() {
  const movements = useBoundStore((s) => s.movements);
  const items = useBoundStore((s) => s.items);

  const itemMap = useMemo(
    () => new Map(items.map((i) => [i.id, i])),
    [items],
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const movementRows: MovementRow[] = useMemo(() => {
    let filtered = movements.map((m) => {
      const item = itemMap.get(m.itemId);
      return {
        movement: m,
        itemName: item?.name ?? m.itemId,
        itemUnit: item?.unit ?? "",
      };
    });
    if (typeFilter !== "all") {
      filtered = filtered.filter((r) => r.movement.type === typeFilter);
    }
    return filtered;
  }, [movements, itemMap, typeFilter]);

  const columns = useMemo(() => getMovementColumns(), []);

  const table = useReactTable({
    data: movementRows,
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

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <>
      <Header title="Lịch sử xuất/nhập" />

      <div className="flex items-center gap-3 border-b border-border pb-3 mb-0">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v ?? "all")}
        >
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {(
              Object.entries(MOVEMENT_TYPES) as [string, string][]
            ).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
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
    </>
  );
}
