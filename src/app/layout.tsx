"use client";

import { Be_Vietnam_Pro } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { HydrationGuard } from "@/components/layout/hydration-guard";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full`}>
      <head>
        <title>Victoria Motors — Quản lý kho & BOM</title>
        <meta
          name="description"
          content="Hệ thống quản lý kho và BOM cho Victoria Motors"
        />
      </head>
      <body className="h-full">
        <TooltipProvider>
          <HydrationGuard>
            <div className="flex h-full">
              <Sidebar />
              <main className="flex-1 overflow-y-auto pt-[24px] px-[32px]">
                {children}
              </main>
            </div>
            <Toaster position="bottom-right" richColors />
          </HydrationGuard>
        </TooltipProvider>
      </body>
    </html>
  );
}
