"use client";

import { ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScanViewport() {
  return (
    <div className="rounded-md border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <ScanLine size={18} className="text-muted-foreground" />
        <h2 className="text-section-title">1. Ảnh chụp hoá đơn</h2>
      </div>

      {/* Viewport */}
      <div className="p-4">
        <div className="aspect-[3/4] bg-surface-dim rounded-lg border-2 border-dashed border-primary/30 relative overflow-hidden">
          {/* Scanning line animation */}
          <div className="absolute left-0 w-full h-0.5 bg-primary/50 z-10 animate-[scan-line_3s_ease-in-out_infinite]" />

          {/* Simulated document */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="bg-white rounded-md shadow-sm p-4 w-full -rotate-1 border border-outline-variant">
              <p className="text-xs font-semibold text-center mb-2">
                HÓA ĐƠN MUA HÀNG
              </p>
              <p className="text-[10px] text-muted-foreground text-center mb-3">
                Linh kiện động cơ AT88
              </p>
              <div className="space-y-1.5 text-[10px] text-muted-foreground">
                <p>NCC: Công ty TNHH Phụ tùng Hà Nội</p>
                <p>Ngày: 10/04/2026</p>
                <p>Số HĐ: HD-2026-0412</p>
              </div>
              <div className="mt-3 space-y-1.5">
                {/* Simulated table rows */}
                <div className="h-[1px] bg-muted-foreground/30" />
                <div className="flex gap-2 text-[9px] text-muted-foreground">
                  <span className="w-4">STT</span>
                  <span className="flex-1">Tên vật liệu</span>
                  <span className="w-6 text-right">SL</span>
                  <span className="w-6 text-right">ĐV</span>
                </div>
                <div className="h-[1px] bg-muted-foreground/30" />
                {[
                  ["1", "Vách máy phải...", "50", "Bộ"],
                  ["2", "Vách máy giữa", "50", "Bộ"],
                  ["3", "Vách máy trái...", "50", "Bộ"],
                  ["4", "Xi lanh 60mm", "60", "C."],
                  ["5", "Bộ xéc măng", "120", "Bộ"],
                ].map(([stt, name, qty, unit]) => (
                  <div
                    key={stt}
                    className="flex gap-2 text-[9px] text-muted-foreground/70"
                  >
                    <span className="w-4">{stt}</span>
                    <span className="flex-1 truncate">{name}</span>
                    <span className="w-6 text-right">{qty}</span>
                    <span className="w-6 text-right">{unit}</span>
                  </div>
                ))}
                {/* Faded "more rows" */}
                <div className="h-1.5 bg-muted-foreground/10 rounded w-5/6 mt-1" />
                <div className="h-1.5 bg-muted-foreground/10 rounded w-4/6" />
                <div className="h-1.5 bg-muted-foreground/10 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-3" disabled>
          Chụp lại
        </Button>
      </div>
    </div>
  );
}
