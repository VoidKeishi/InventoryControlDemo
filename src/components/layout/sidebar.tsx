"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  History,
  Package,
  Factory,
  ShoppingCart,
  ClipboardList,
  Truck,
  FileSpreadsheet,
  Gauge,
  Smartphone,
  ScanLine,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useBoundStore } from "@/store";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "TỔNG QUAN",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "KHO HÀNG",
    items: [
      { href: "/stock", label: "Tồn kho hiện tại", icon: Warehouse },
      { href: "/receipt", label: "Nhập kho", icon: ArrowDownToLine },
      { href: "/issue", label: "Xuất kho", icon: ArrowUpFromLine },
      { href: "/adjustment", label: "Điều chỉnh kho", icon: SlidersHorizontal },
      { href: "/movements", label: "Lịch sử xuất/nhập", icon: History },
    ],
  },
  {
    title: "VẬT LIỆU & BOM",
    items: [
      { href: "/items", label: "Danh sách vật liệu", icon: Package },
      { href: "/bom/production", label: "BOM Sản xuất", icon: Factory },
      { href: "/bom/purchase", label: "BOM Mua hàng", icon: ShoppingCart },
    ],
  },
  {
    title: "MUA HÀNG",
    items: [
      { href: "/purchase-orders", label: "Đơn mua hàng", icon: ClipboardList },
      { href: "/suppliers", label: "Nhà cung cấp", icon: Truck },
    ],
  },
  {
    title: "BÁO CÁO",
    items: [
      { href: "/reports/stock-summary", label: "Nhập-Xuất-Tồn", icon: FileSpreadsheet },
    ],
  },
  {
    title: "CÔNG CỤ",
    items: [
      { href: "/capacity", label: "Tính năng lực sản xuất", icon: Gauge, highlight: true },
    ],
  },
  {
    title: "DEMO",
    items: [
      { href: "/mobile", label: "Giao diện mobile", icon: Smartphone },
      { href: "/ocr", label: "Scan hoá đơn (OCR)", icon: ScanLine },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const resetToSeedData = useBoundStore((s) => s.resetToSeedData);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <span className="text-section-title font-semibold text-sidebar-foreground">
            VM
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-surface-container"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {navigation.map((section) => (
          <div key={section.title} className="mt-6 first:mt-2">
            {!collapsed && (
              <span className="mb-2 block px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </span>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-9 items-center gap-2.5 rounded-sm px-3 text-sm transition-colors duration-150",
                        isActive
                          ? "border-l-[3px] border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-surface-container",
                        collapsed && "justify-center px-0",
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!collapsed && (
                        <span className="truncate">
                          {item.label}
                          {item.highlight && (
                            <Star size={12} className="ml-1 inline text-warning" />
                          )}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setResetOpen(true)}
          className={cn(
            "flex h-9 w-full items-center gap-2.5 rounded-sm px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-error-container hover:text-destructive",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Reset dữ liệu demo" : undefined}
        >
          <RotateCcw size={18} className="shrink-0" />
          {!collapsed && <span>Reset dữ liệu demo</span>}
        </button>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset dữ liệu demo?"
        description="Toàn bộ dữ liệu (vật liệu, BOM, lịch sử kho) sẽ được khôi phục về trạng thái ban đầu. Hành động này không thể hoàn tác."
        confirmLabel="Reset"
        destructive
        onConfirm={() => {
          resetToSeedData();
          toast.info("Đã reset dữ liệu demo");
        }}
      />
    </aside>
  );
}
