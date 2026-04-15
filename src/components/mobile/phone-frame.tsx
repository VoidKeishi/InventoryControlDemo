"use client";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="w-[375px] h-[720px] mx-auto rounded-[40px] border-[8px] border-[#202124] bg-background overflow-hidden relative flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[24px] rounded-b-2xl bg-[#202124] z-10" />
      {/* Content below notch */}
      <div className="flex-1 flex flex-col overflow-hidden pt-[24px]">
        {children}
      </div>
    </div>
  );
}
