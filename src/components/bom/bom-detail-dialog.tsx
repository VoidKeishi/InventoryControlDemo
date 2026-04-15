"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BomLineEditor } from "./bom-line-editor";
import type { BOM, Item } from "@/types";
import { formatDate } from "@/lib/format";

interface BomDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bom: BOM | null;
  items: Item[];
}

export function BomDetailDialog({
  open,
  onOpenChange,
  bom,
  items,
}: BomDetailDialogProps) {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  if (!bom) return null;

  const versionNum = selectedVersion ?? bom.currentVersion;
  const version = bom.versions.find((v) => v.version === versionNum);
  const isCurrent = versionNum === bom.currentVersion;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setSelectedVersion(null);
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {bom.name}
            <Badge variant="secondary">
              {bom.type === "production" ? "Sản xuất" : "Mua hàng"}
            </Badge>
          </DialogTitle>
          <DialogDescription>{bom.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Phiên bản:</span>
            <Select
              value={String(versionNum)}
              onValueChange={(v) => {
                if (v) setSelectedVersion(Number(v));
              }}
            >
              <SelectTrigger size="sm" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bom.versions
                  .slice()
                  .sort((a, b) => b.version - a.version)
                  .map((v) => (
                    <SelectItem key={v.version} value={String(v.version)}>
                      v{v.version}
                      {v.version === bom.currentVersion ? " (hiện tại)" : ""}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {isCurrent && (
              <Badge variant="default" className="text-xs">Hiện tại</Badge>
            )}
          </div>
          {version && (
            <span className="text-small text-muted-foreground">
              {formatDate(version.createdAt)}
            </span>
          )}
        </div>

        {version?.note && (
          <p className="text-sm text-muted-foreground italic">
            {version.note}
          </p>
        )}

        {version && (
          <BomLineEditor
            lines={version.lines}
            onChange={() => {}}
            items={items}
            readOnly
          />
        )}

        <div className="text-small text-muted-foreground text-right">
          {version ? `${version.lines.length} vật liệu` : ""}
        </div>
      </DialogContent>
    </Dialog>
  );
}
