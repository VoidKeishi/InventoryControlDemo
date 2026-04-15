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
import { BomLineEditor } from "./bom-line-editor";
import type { Item, BOMLine } from "@/types";

interface BomFormValues {
  name: string;
  description: string;
}

interface BomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Item[];
  onSubmit: (values: {
    name: string;
    description: string;
    lines: BOMLine[];
  }) => void;
}

export function BomFormDialog({
  open,
  onOpenChange,
  items,
  onSubmit,
}: BomFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BomFormValues>({
    defaultValues: { name: "", description: "" },
  });

  const [lines, setLines] = useState<BOMLine[]>([]);

  useEffect(() => {
    if (open) {
      reset({ name: "", description: "" });
      setLines([]);
    }
  }, [open, reset]);

  function onFormSubmit(data: BomFormValues) {
    if (!data.name.trim()) return;
    const validLines = lines.filter((l) => l.itemId && l.quantity > 0);
    onSubmit({
      name: data.name.trim(),
      description: data.description.trim(),
      lines: validLines,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo BOM sản xuất mới</DialogTitle>
          <DialogDescription>
            Tạo định mức sản xuất cho mẫu xe mới
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="bom-name">Tên mẫu xe</Label>
              <Input
                id="bom-name"
                placeholder="VD: PASSION"
                {...register("name", { required: "Tên không được để trống" })}
              />
              {errors.name && (
                <p className="text-small text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="bom-desc">Mô tả</Label>
              <Input
                id="bom-desc"
                placeholder="VD: BOM sản xuất mẫu PASSION"
                {...register("description")}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Danh sách vật liệu (phiên bản 1)</Label>
            <BomLineEditor lines={lines} onChange={setLines} items={items} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button type="submit">Tạo BOM</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
