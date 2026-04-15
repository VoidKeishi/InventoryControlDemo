"use client";

import { Header } from "@/components/layout/header";
import { PhoneFrame } from "@/components/mobile/phone-frame";
import { PickListMockup } from "@/components/mobile/pick-list-mockup";

export default function MobilePage() {
  return (
    <>
      <Header title="Giao diện mobile" />
      <p className="text-sm text-muted-foreground mb-6">
        Mô phỏng giao diện nhân viên kho trên điện thoại. Nhấn vào các mục để
        đánh dấu đã lấy hàng.
      </p>
      <div className="flex justify-center pb-8">
        <PhoneFrame>
          <PickListMockup />
        </PhoneFrame>
      </div>
    </>
  );
}
