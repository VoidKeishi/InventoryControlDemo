"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { IssueByBom } from "@/components/issue/issue-by-bom";
import { IssueIndividual } from "@/components/issue/issue-individual";
import { cn } from "@/lib/utils";

type IssueMode = "bom" | "individual";

export default function IssuePage() {
  const [mode, setMode] = useState<IssueMode>("bom");

  return (
    <>
      <Header title="Xuất kho" />

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
          Theo BOM sản xuất
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

      {mode === "bom" ? <IssueByBom /> : <IssueIndividual />}
    </>
  );
}
