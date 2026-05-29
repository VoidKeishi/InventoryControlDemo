"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POLineEditor } from "./po-line-editor";
import type { Item, PurchaseOrder, PurchaseOrderLine, Supplier } from "@/types";

interface POFormValues {
  supplierId: string;
  orderDate: string;
  expectedDate: string;
  note: string;
}

interface POFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: PurchaseOrder | null;
  suppliers: Supplier[];
  items: Item[];
  onSubmit: (values: {
    supplierId: string;
    orderDate: string;
    expectedDate: string | null;
    note: string;
    lines: PurchaseOrderLine[];
  }) => void;
}

function toDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromDateInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function POFormDialog({
  open,
  onOpenChange,
  po,
  suppliers,
  items,
  onSubmit,
}: POFormDialogProps) {
  const isEditing = po !== null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<POFormValues>({
    defaultValues: {
      supplierId: "",
      orderDate: toDateInput(new Date().toISOString()),
      expectedDate: "",
      note: "",
    },
  });

  const [lines, setLines] = useState<PurchaseOrderLine[]>([]);

  useEffect(() => {
    if (open) {
      if (po) {
        reset({
          supplierId: po.supplierId,
          orderDate: toDateInput(po.orderDate),
          expectedDate: toDateInput(po.expectedDate),
          note: po.note,
        });
        setLines(po.lines.map((l) => ({ ...l })));
      } else {
        reset({
          supplierId: "",
          orderDate: toDateInput(new Date().toISOString()),
          expectedDate: "",
          note: "",
        });
        setLines([]);
      }
    }
  }, [open, po, reset]);

  const supplierValue = watch("supplierId");

  function onFormSubmit(data: POFormValues) {
    if (!data.supplierId) return;
    const validLines = lines.filter(
      (l) => l.itemId && l.quantity > 0 && l.unitPrice >= 0,
    );
    if (validLines.length === 0) return;
    onSubmit({
      supplierId: data.supplierId,
      orderDate: fromDateInput(data.orderDate) ?? new Date().toISOString(),
      expectedDate: fromDateInput(data.expectedDate),
      note: data.note.trim(),
      lines: validLines,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Sửa đơn ${po.code}` : "Tạo đơn mua hàng mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Chỉnh sửa đơn mua hàng ở trạng thái nháp"
              : "Nhập thông tin đơn mua hàng. Đơn sẽ được lưu ở trạng thái nháp."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Nhà cung cấp</Label>
              <Select
                value={supplierValue}
                onValueChange={(v) => setValue("supplierId", v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.id} — {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!supplierValue && errors.supplierId && (
                <p className="text-small text-destructive">
                  Chưa chọn nhà cung cấp
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="orderDate">Ngày đặt</Label>
                <Input
                  id="orderDate"
                  type="date"
                  {...register("orderDate", { required: true })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="expectedDate">Dự kiến nhận</Label>
                <Input
                  id="expectedDate"
                  type="date"
                  {...register("expectedDate")}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Danh sách dòng đặt hàng</Label>
            <POLineEditor lines={lines} onChange={setLines} items={items} />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              rows={2}
              placeholder="Ghi chú về đơn hàng..."
              {...register("note")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              disabled={!supplierValue || lines.length === 0}
            >
              {isEditing ? "Lưu" : "Tạo đơn nháp"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
