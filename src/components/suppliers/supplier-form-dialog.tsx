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
import { Textarea } from "@/components/ui/textarea";
import type { Supplier } from "@/types";

interface SupplierFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  taxId: string;
  note: string;
}

interface SupplierFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onSubmit: (values: SupplierFormValues) => void;
}

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSubmit,
}: SupplierFormDialogProps) {
  const isEditing = supplier !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      taxId: "",
      note: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (supplier) {
        reset({
          name: supplier.name,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address,
          taxId: supplier.taxId,
          note: supplier.note,
        });
      } else {
        reset({
          name: "",
          phone: "",
          email: "",
          address: "",
          taxId: "",
          note: "",
        });
      }
    }
  }, [open, supplier, reset]);

  function onFormSubmit(data: SupplierFormValues) {
    if (!data.name.trim()) return;
    onSubmit({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      address: data.address.trim(),
      taxId: data.taxId.trim(),
      note: data.note.trim(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Chỉnh sửa thông tin nhà cung cấp ${supplier.id}`
              : "Nhập thông tin nhà cung cấp vào hệ thống"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Tên nhà cung cấp</Label>
            <Input
              id="name"
              placeholder="VD: Công ty TNHH Phụ tùng Hà Nội"
              {...register("name", {
                required: "Tên nhà cung cấp không được để trống",
              })}
            />
            {errors.name && (
              <p className="text-small text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Điện thoại</Label>
              <Input
                id="phone"
                placeholder="024 3825 1234"
                {...register("phone")}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="taxId">MST</Label>
              <Input
                id="taxId"
                placeholder="0101234567"
                {...register("taxId")}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="sales@example.vn"
              {...register("email")}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="Số nhà, đường, quận, thành phố"
              {...register("address")}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              rows={2}
              placeholder="Mô tả ngắn về lĩnh vực cung cấp, điều khoản..."
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
            <Button type="submit">{isEditing ? "Lưu" : "Thêm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
