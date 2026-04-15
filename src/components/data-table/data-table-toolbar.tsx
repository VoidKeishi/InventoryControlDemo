"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DataTableToolbarProps {
  searchKey?: string
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  children?: React.ReactNode
  className?: string
}

export function DataTableToolbar({
  searchKey,
  searchPlaceholder = "Tìm kiếm...",
  searchValue,
  onSearchChange,
  children,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center justify-between border-b border-outline-variant px-4 py-3",
        className
      )}
    >
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-8"
            />
          </div>
        )}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  )
}
