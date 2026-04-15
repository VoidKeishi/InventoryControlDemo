"use client";

import { useState } from "react";
import { ClipboardList, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const PICK_LIST_ITEMS = [
  { id: "DC-001", name: "Vách máy phải, phớt NJK", qty: 5, unit: "Bộ" },
  { id: "DC-002", name: "Vách máy giữa", qty: 5, unit: "Bộ" },
  { id: "DC-004", name: "Xi lanh cao 60 mm nghiêng", qty: 5, unit: "Chiếc" },
  { id: "OV-001", name: "Bu lông lục giác M6x20", qty: 30, unit: "Chiếc" },
  { id: "OV-003", name: "Ê cu hãm M6", qty: 30, unit: "Chiếc" },
  { id: "DD-001", name: "Cụm đèn pha LED PASSION", qty: 5, unit: "Bộ" },
  { id: "KS-001", name: "Khung sườn chính PASSION", qty: 5, unit: "Chiếc" },
  { id: "PK-001", name: "Tem logo Victoria Motors", qty: 5, unit: "Bộ" },
];

const INITIAL_CHECKED = new Set(["DC-001", "DC-002", "DC-004", "OV-001", "OV-003"]);

export function PickListMockup() {
  const [checked, setChecked] = useState<Set<string>>(INITIAL_CHECKED);
  const [completed, setCompleted] = useState(false);

  const checkedCount = checked.size;
  const total = PICK_LIST_ITEMS.length;
  const allChecked = checkedCount === total;
  const progressPercent = (checkedCount / total) * 100;

  function toggleItem(id: string) {
    if (completed) return;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Mobile app header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList size={16} />
          <span className="text-sm font-semibold">PHIẾU XUẤT KHO</span>
        </div>
        <p className="text-xs opacity-80">PASSION — 5 chiếc | 15/04/2026</p>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-outline-variant shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {checkedCount}/{total} đã lấy
          </span>
          {allChecked && !completed && (
            <span className="text-xs text-[#1e8e3e] font-medium">Đủ hàng!</span>
          )}
          {completed && (
            <span className="text-xs text-[#1e8e3e] font-medium flex items-center gap-1">
              <Check size={12} />
              Hoàn thành
            </span>
          )}
        </div>
        <div className="h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto">
        {PICK_LIST_ITEMS.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={`w-full text-left px-4 py-3 border-b border-outline-variant flex items-start gap-3 transition-colors duration-150 ${
                isChecked ? "bg-success-container/30" : ""
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-0.5 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isChecked ? "text-muted-foreground/60 line-through" : ""
                    }`}
                  >
                    {item.id}
                  </span>
                  {isChecked && <Check size={14} className="text-[#1e8e3e] shrink-0" />}
                </div>
                <p
                  className={`text-sm truncate ${
                    isChecked
                      ? "text-muted-foreground/50 line-through"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  SL: {item.qty} {item.unit}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom action */}
      <div className="border-t border-outline-variant p-4 shrink-0">
        {completed ? (
          <Button className="w-full" disabled>
            <Check size={16} className="mr-2" />
            Đã hoàn thành
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={!allChecked}
            onClick={() => setCompleted(true)}
          >
            Hoàn thành phiếu xuất
          </Button>
        )}
      </div>
    </div>
  );
}
