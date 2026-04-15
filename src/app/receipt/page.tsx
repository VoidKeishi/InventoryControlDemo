"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ReceiptByBom } from "@/components/receipt/receipt-by-bom";
import { ReceiptIndividual } from "@/components/receipt/receipt-individual";
import { cn } from "@/lib/utils";

type ReceiptMode = "bom" | "individual";

export default function ReceiptPage() {
  const [mode, setMode] = useState<ReceiptMode>("bom");

  return (
    <>
      <Header title="Nhập kho" />

      <div className="flex gap-1 border-b border-border mb-6">
        <button
          onClick={() => setMode("bom")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            mode === "bom"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Theo BOM
        </button>
        <button
          onClick={() => setMode("individual")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            mode === "individual"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Lẻ
        </button>
      </div>

      {mode === "bom" ? <ReceiptByBom /> : <ReceiptIndividual />}
    </>
  );
}
