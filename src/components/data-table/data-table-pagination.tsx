"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  className?: string
}

export function DataTablePagination<TData>({
  table,
  className,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const totalRows = table.getFilteredRowModel().rows.length
  
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-outline-variant px-4 py-3",
        className
      )}
    >
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span>Hiển thị</span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <span>
            {startRow}-{endRow} / {totalRows}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Trước</span>
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex w-[60px] items-center justify-center text-sm font-medium">
          Trang {table.getPageCount() > 0 ? pageIndex + 1 : 0}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Tiếp</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
