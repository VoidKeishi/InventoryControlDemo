"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  subMonths,
} from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeFilterProps {
  range: DateRange;
  onChange: (range: DateRange) => void;
}

function toInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromInput(v: string, endOfDay: boolean): Date {
  const d = new Date(v);
  if (isNaN(d.getTime())) return new Date();
  if (endOfDay) {
    d.setHours(23, 59, 59, 999);
  } else {
    d.setHours(0, 0, 0, 0);
  }
  return d;
}

export function DateRangeFilter({ range, onChange }: DateRangeFilterProps) {
  function applyPreset(preset: "this-month" | "last-month" | "this-quarter" | "all") {
    const now = new Date();
    if (preset === "this-month") {
      onChange({ from: startOfMonth(now), to: endOfDay(now) });
    } else if (preset === "last-month") {
      const lm = subMonths(now, 1);
      onChange({ from: startOfMonth(lm), to: endOfMonth(lm) });
    } else if (preset === "this-quarter") {
      onChange({ from: startOfQuarter(now), to: endOfDay(now) });
    } else {
      onChange({
        from: new Date("2020-01-01T00:00:00.000Z"),
        to: endOfDay(now),
      });
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground">Từ ngày</Label>
        <Input
          type="date"
          value={toInput(range.from)}
          onChange={(e) =>
            onChange({ ...range, from: fromInput(e.target.value, false) })
          }
          className="h-9 w-40"
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs uppercase text-muted-foreground">Đến ngày</Label>
        <Input
          type="date"
          value={toInput(range.to)}
          onChange={(e) =>
            onChange({ ...range, to: fromInput(e.target.value, true) })
          }
          className="h-9 w-40"
        />
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("this-month")}
        >
          Tháng này
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("last-month")}
        >
          Tháng trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("this-quarter")}
        >
          Quý này
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => applyPreset("all")}
        >
          Tất cả
        </Button>
      </div>
    </div>
  );
}

function endOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(23, 59, 59, 999);
  return copy;
}
