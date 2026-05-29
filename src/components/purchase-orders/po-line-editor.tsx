"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemSelect } from "@/components/shared/item-select";
import { formatCurrency } from "@/lib/format";
import type { Item, PurchaseOrderLine } from "@/types";

interface POLineEditorProps {
  lines: PurchaseOrderLine[];
  onChange: (lines: PurchaseOrderLine[]) => void;
  items: Item[];
}

export function POLineEditor({ lines, onChange, items }: POLineEditorProps) {
  const usedItemIds = lines.map((l) => l.itemId);
  const itemMap = new Map(items.map((i) => [i.id, i]));

  function addLine() {
    onChange([
      ...lines,
      {
        itemId: "",
        quantity: 1,
        unitPrice: 0,
        receivedQuantity: 0,
        note: "",
      },
    ]);
  }

  function updateLine(index: number, updates: Partial<PurchaseOrderLine>) {
    onChange(
      lines.map((line, i) => {
        if (i !== index) return line;
        const next = { ...line, ...updates };
        if (updates.itemId) {
          const item = itemMap.get(updates.itemId);
          if (item && next.unitPrice === 0) {
            next.unitPrice = item.standardCost ?? 0;
          }
        }
        return next;
      }),
    );
  }

  function removeLine(index: number) {
    onChange(lines.filter((_, i) => i !== index));
  }

  const grandTotal = lines.reduce(
    (sum, l) => sum + l.quantity * l.unitPrice,
    0,
  );

  return (
    <div className="space-y-2">
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-dim">
              <th className="h-9 px-3 text-left text-label uppercase text-muted-foreground">
                Vật liệu
              </th>
              <th className="h-9 w-20 px-3 text-right text-label uppercase text-muted-foreground">
                SL
              </th>
              <th className="h-9 w-14 px-3 text-center text-label uppercase text-muted-foreground">
                ĐVT
              </th>
              <th className="h-9 w-36 px-3 text-right text-label uppercase text-muted-foreground">
                Đơn giá
              </th>
              <th className="h-9 w-36 px-3 text-right text-label uppercase text-muted-foreground">
                Thành tiền
              </th>
              <th className="h-9 w-12 px-3" />
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="h-16 text-center text-muted-foreground"
                >
                  Chưa có dòng nào
                </td>
              </tr>
            )}
            {lines.map((line, index) => {
              const item = itemMap.get(line.itemId);
              const lineTotal = line.quantity * line.unitPrice;
              return (
                <tr key={index} className="border-t border-outline-variant">
                  <td className="px-3 py-1.5">
                    <ItemSelect
                      items={items}
                      value={line.itemId || null}
                      onSelect={(id) => updateLine(index, { itemId: id })}
                      excludeIds={usedItemIds.filter((_, i) => i !== index)}
                    />
                  </td>
                  <td className="px-3 py-1.5">
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
                  </td>
                  <td className="px-3 py-1.5 text-center text-muted-foreground">
                    {item?.unit ?? "—"}
                  </td>
                  <td className="px-3 py-1.5">
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      value={line.unitPrice}
                      onChange={(e) =>
                        updateLine(index, {
                          unitPrice: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="h-8 text-right tabular-nums"
                    />
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums font-medium">
                    {formatCurrency(lineTotal)}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeLine(index)}
                    >
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {lines.length > 0 && (
            <tfoot>
              <tr className="border-t border-outline-variant bg-surface-dim">
                <td
                  colSpan={4}
                  className="h-9 px-3 text-right text-label uppercase text-muted-foreground"
                >
                  Tổng cộng
                </td>
                <td className="px-3 text-right tabular-nums font-semibold">
                  {formatCurrency(grandTotal)}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <Button variant="outline" size="sm" onClick={addLine} type="button">
        <Plus size={14} />
        Thêm dòng
      </Button>
    </div>
  );
}
