"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemSelect } from "@/components/shared/item-select";
import type { Item, BOMLine } from "@/types";

interface BomLineEditorProps {
  lines: BOMLine[];
  onChange: (lines: BOMLine[]) => void;
  items: Item[];
  readOnly?: boolean;
}

export function BomLineEditor({
  lines,
  onChange,
  items,
  readOnly = false,
}: BomLineEditorProps) {
  const usedItemIds = lines.map((l) => l.itemId);

  function addLine() {
    onChange([
      ...lines,
      { itemId: "", quantity: 1, unit: "", note: "" },
    ]);
  }

  function updateLine(index: number, updates: Partial<BOMLine>) {
    const updated = lines.map((line, i) => {
      if (i !== index) return line;
      const newLine = { ...line, ...updates };
      if (updates.itemId) {
        const item = items.find((it) => it.id === updates.itemId);
        if (item) newLine.unit = item.unit;
      }
      return newLine;
    });
    onChange(updated);
  }

  function removeLine(index: number) {
    onChange(lines.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-dim">
              <th className="h-9 px-3 text-left text-label uppercase text-muted-foreground">
                Vật liệu
              </th>
              <th className="h-9 w-24 px-3 text-right text-label uppercase text-muted-foreground">
                Số lượng
              </th>
              <th className="h-9 w-16 px-3 text-center text-label uppercase text-muted-foreground">
                ĐVT
              </th>
              <th className="h-9 w-40 px-3 text-left text-label uppercase text-muted-foreground">
                Ghi chú
              </th>
              {!readOnly && (
                <th className="h-9 w-12 px-3" />
              )}
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 && (
              <tr>
                <td
                  colSpan={readOnly ? 4 : 5}
                  className="h-16 text-center text-muted-foreground"
                >
                  Chưa có vật liệu nào
                </td>
              </tr>
            )}
            {lines.map((line, index) => (
              <tr
                key={index}
                className="border-t border-outline-variant"
              >
                <td className="px-3 py-1.5">
                  {readOnly ? (
                    <span>
                      <span className="font-medium">{line.itemId}</span>
                      {" — "}
                      {items.find((i) => i.id === line.itemId)?.name ?? line.itemId}
                    </span>
                  ) : (
                    <ItemSelect
                      items={items}
                      value={line.itemId || null}
                      onSelect={(id) => updateLine(index, { itemId: id })}
                      excludeIds={usedItemIds.filter((_, i) => i !== index)}
                    />
                  )}
                </td>
                <td className="px-3 py-1.5">
                  {readOnly ? (
                    <div className="text-right tabular-nums font-medium">
                      {line.quantity}
                    </div>
                  ) : (
                    <Input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) =>
                        updateLine(index, {
                          quantity: parseInt(e.target.value, 10) || 1,
                        })
                      }
                      className="h-8 text-right tabular-nums"
                    />
                  )}
                </td>
                <td className="px-3 py-1.5 text-center text-muted-foreground">
                  {line.unit || "—"}
                </td>
                <td className="px-3 py-1.5">
                  {readOnly ? (
                    <span className="text-muted-foreground">
                      {line.note || "—"}
                    </span>
                  ) : (
                    <Input
                      value={line.note}
                      onChange={(e) =>
                        updateLine(index, { note: e.target.value })
                      }
                      placeholder="Ghi chú"
                      className="h-8"
                    />
                  )}
                </td>
                {!readOnly && (
                  <td className="px-3 py-1.5 text-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeLine(index)}
                    >
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!readOnly && (
        <Button variant="outline" size="sm" onClick={addLine}>
          <Plus size={14} />
          Thêm vật liệu
        </Button>
      )}
    </div>
  );
}
