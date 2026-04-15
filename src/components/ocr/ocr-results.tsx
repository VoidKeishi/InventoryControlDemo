"use client";

import { FileText, Check, ArrowRight, ListTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OCR_DATA = [
  { stt: 1, name: "Vách máy phải, phớt NJK TC 16.4x30x5", matchedId: "DC-001", qty: 50, unit: "Bộ" },
  { stt: 2, name: "Vách máy giữa", matchedId: "DC-002", qty: 50, unit: "Bộ" },
  { stt: 3, name: "Vách máy trái liền vòng bi", matchedId: "DC-003", qty: 50, unit: "Bộ" },
  { stt: 4, name: "Xi lanh cao 60mm nghiêng 49cm3", matchedId: "DC-004", qty: 60, unit: "Chiếc" },
  { stt: 5, name: "Bộ xéc măng", matchedId: "DC-005", qty: 120, unit: "Bộ" },
  { stt: 6, name: "Quả pít tông phi 37,5mm", matchedId: "DC-006", qty: 120, unit: "Chiếc" },
  { stt: 7, name: "Trục cam", matchedId: "DC-007", qty: 80, unit: "Chiếc" },
  { stt: 8, name: "Bánh răng cam", matchedId: "DC-008", qty: 80, unit: "Chiếc" },
  { stt: 9, name: "Phanh gài chốt pít tông", matchedId: "OV-006", qty: 300, unit: "Chiếc" },
  { stt: 10, name: "Gioăng giấy đáy xi lanh", matchedId: "GP-002", qty: 200, unit: "Chiếc" },
  { stt: 11, name: "Gioăng cao su viền đầu xi lanh", matchedId: "GP-004", qty: 200, unit: "Chiếc" },
  { stt: 12, name: "Quạt gió làm mát động cơ", matchedId: "KH-004", qty: 60, unit: "Chiếc" },
];

export function OcrResultsCard() {
  return (
    <div className="rounded-md border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <FileText size={18} className="text-muted-foreground" />
        <h2 className="text-section-title">2. Kết quả nhận dạng (OCR)</h2>
      </div>

      <div className="p-4">
        {/* Invoice info */}
        <div className="space-y-1 text-sm mb-4">
          <p>
            <span className="text-muted-foreground">NCC:</span>{" "}
            Công ty TNHH Phụ tùng Hà Nội
          </p>
          <p>
            <span className="text-muted-foreground">Ngày:</span> 10/04/2026
          </p>
          <p>
            <span className="text-muted-foreground">Số HĐ:</span> HD-2026-0412
          </p>
        </div>

        {/* OCR result table */}
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-dim">
                <TableHead className="text-label uppercase text-muted-foreground w-10">
                  STT
                </TableHead>
                <TableHead className="text-label uppercase text-muted-foreground">
                  Tên vật liệu (OCR)
                </TableHead>
                <TableHead className="text-label uppercase text-muted-foreground text-right w-16">
                  SL
                </TableHead>
                <TableHead className="text-label uppercase text-muted-foreground w-16">
                  ĐV
                </TableHead>
                <TableHead className="text-label uppercase text-muted-foreground w-20">
                  Khớp mã
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OCR_DATA.map((item) => (
                <TableRow key={item.stt}>
                  <TableCell className="tabular-nums">{item.stt}</TableCell>
                  <TableCell className="truncate max-w-[180px]">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {item.qty}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <Check size={14} className="text-[#1e8e3e]" />
                      <span className="text-xs text-muted-foreground">
                        {item.matchedId}
                      </span>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <Badge className="bg-success-container text-[#1e8e3e] border-0">
            Nhận dạng 12/12 vật liệu
          </Badge>
          <Button size="sm">
            Tạo BOM mua hàng
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BomPreviewCard() {
  return (
    <div className="rounded-md border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <ListTree size={18} className="text-muted-foreground" />
        <h2 className="text-section-title">3. Xem trước BOM mua hàng</h2>
      </div>

      <div className="p-4">
        {/* BOM info */}
        <div className="space-y-1 text-sm mb-4">
          <p>
            <span className="text-muted-foreground">Tên BOM:</span>{" "}
            Đơn mua linh kiện động cơ AT88
          </p>
          <p>
            <span className="text-muted-foreground">NCC:</span>{" "}
            Công ty TNHH Phụ tùng Hà Nội
          </p>
          <p>
            <span className="text-muted-foreground">Ngày tạo:</span> 10/04/2026
          </p>
        </div>

        {/* BOM preview table */}
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-dim">
                <TableHead className="text-label uppercase text-muted-foreground w-20">
                  Mã
                </TableHead>
                <TableHead className="text-label uppercase text-muted-foreground">
                  Tên vật liệu
                </TableHead>
                <TableHead className="text-label uppercase text-muted-foreground text-right w-20">
                  Số lượng
                </TableHead>
                <TableHead className="text-label uppercase text-muted-foreground w-16">
                  Đơn vị
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OCR_DATA.map((item) => (
                <TableRow key={item.matchedId}>
                  <TableCell className="font-medium">
                    {item.matchedId}
                  </TableCell>
                  <TableCell className="truncate max-w-[300px]">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {item.qty}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Badge className="bg-success-container text-[#1e8e3e] border-0">
            Sẵn sàng nhập
          </Badge>
        </div>
      </div>
    </div>
  );
}
