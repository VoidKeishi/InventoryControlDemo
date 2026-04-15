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
import type { BOM, BOMLine, Item } from "@/types";

interface BomVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bom: BOM | null;
  items: Item[];
  onSubmit: (bomId: string, note: string, lines: BOMLine[]) => void;
}

export function BomVersionDialog({
  open,
  onOpenChange,
  bom,
  items,
  onSubmit,
}: BomVersionDialogProps) {
  const { register, handleSubmit, reset } = useForm<{ note: string }>({
    defaultValues: { note: "" },
  });

  const [lines, setLines] = useState<BOMLine[]>([]);

  useEffect(() => {
    if (open && bom) {
      reset({ note: "" });
      const currentVersion = bom.versions.find(
        (v) => v.version === bom.currentVersion,
      );
      setLines(currentVersion ? [...currentVersion.lines.map((l) => ({ ...l }))] : []);
    }
  }, [open, bom, reset]);

  if (!bom) return null;

  const nextVersion = bom.currentVersion + 1;

  function onFormSubmit(data: { note: string }) {
    const validLines = lines.filter((l) => l.itemId && l.quantity > 0);
    onSubmit(bom!.id, data.note.trim(), validLines);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bom.name} — Phiên bản v{nextVersion}
          </DialogTitle>
          <DialogDescription>
            Tạo phiên bản mới dựa trên v{bom.currentVersion}. Chỉnh sửa danh
            sách vật liệu bên dưới.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="version-note">Lý do thay đổi</Label>
            <Input
              id="version-note"
              placeholder="VD: Cập nhật định mức ốc M6"
              {...register("note")}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Danh sách vật liệu</Label>
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
            <Button type="submit">Tạo v{nextVersion}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
