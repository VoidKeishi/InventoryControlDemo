"use client";

import { Header } from "@/components/layout/header";
import { ScanViewport } from "@/components/ocr/scan-viewport";
import { OcrResultsCard, BomPreviewCard } from "@/components/ocr/ocr-results";

export default function OcrPage() {
  return (
    <>
      <Header title="Scan hoá đơn (OCR)" />
      <p className="text-sm text-muted-foreground mb-6">
        Mô phỏng tính năng scan hoá đơn nhà cung cấp bằng camera. Hệ thống tự
        động nhận dạng vật liệu và tạo BOM mua hàng.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ScanViewport />
        <OcrResultsCard />
      </div>
      <BomPreviewCard />
    </>
  );
}
