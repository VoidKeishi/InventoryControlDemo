"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Item } from "@/types";
import { CATEGORIES, UNITS } from "@/data/constants";

interface ItemFormValues {
  name: string;
  unit: string;
  category: string;
  minStock: string;
}

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onSubmit: (values: {
    name: string;
    unit: string;
    category: string;
    minStock: number | null;
  }) => void;
}

export function ItemFormDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
}: ItemFormDialogProps) {
  const isEditing = item !== null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormValues>({
    defaultValues: {
      name: "",
      unit: "",
      category: "",
      minStock: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (item) {
        reset({
          name: item.name,
          unit: item.unit,
          category: item.category,
          minStock: item.minStock !== null ? String(item.minStock) : "",
        });
      } else {
        reset({ name: "", unit: "", category: "", minStock: "" });
      }
    }
  }, [open, item, reset]);

  const unitValue = watch("unit");
  const categoryValue = watch("category");

  function onFormSubmit(data: ItemFormValues) {
    if (!data.name.trim()) return;
    if (!data.unit) return;
    if (!data.category) return;

    const minStockNum = data.minStock ? parseInt(data.minStock, 10) : null;
    onSubmit({
      name: data.name.trim(),
      unit: data.unit,
      category: data.category,
      minStock: minStockNum !== null && !isNaN(minStockNum) ? minStockNum : null,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa vật liệu" : "Thêm vật liệu mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Chỉnh sửa thông tin vật liệu ${item.id}`
              : "Nhập thông tin vật liệu mới vào hệ thống"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Tên vật liệu</Label>
            <Input
              id="name"
              placeholder="VD: Ốc lục giác M6x14"
              {...register("name", { required: "Tên vật liệu không được để trống" })}
            />
            {errors.name && (
              <p className="text-small text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Nhóm</Label>
              <Select
                value={categoryValue}
                onValueChange={(v) => setValue("category", v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-small text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label>Đơn vị tính</Label>
              <Select
                value={unitValue}
                onValueChange={(v) => setValue("unit", v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn ĐVT" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-small text-destructive">
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="minStock">Tồn kho tối thiểu (tuỳ chọn)</Label>
            <Input
              id="minStock"
              type="number"
              min={0}
              placeholder="VD: 50"
              {...register("minStock")}
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
            <Button type="submit">{isEditing ? "Lưu" : "Thêm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
