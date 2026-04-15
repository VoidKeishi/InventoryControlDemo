import type { StateCreator } from "zustand";
import type { BOM, BOMVersion } from "@/types";

export interface BomSlice {
  boms: BOM[];
  addBOM: (bom: BOM) => void;
  updateBOM: (
    id: string,
    updates: Partial<Omit<BOM, "id" | "versions">>,
  ) => void;
  addBOMVersion: (bomId: string, version: BOMVersion) => void;
  deleteBOM: (id: string) => void;
  setBOMs: (boms: BOM[]) => void;
}

export const createBomSlice: StateCreator<BomSlice, [], [], BomSlice> = (
  set,
) => ({
  boms: [],
  addBOM: (bom) =>
    set((state) => ({ boms: [...state.boms, bom] })),
  updateBOM: (id, updates) =>
    set((state) => ({
      boms: state.boms.map((bom) =>
        bom.id === id ? { ...bom, ...updates } : bom,
      ),
    })),
  addBOMVersion: (bomId, version) =>
    set((state) => ({
      boms: state.boms.map((bom) =>
        bom.id === bomId
          ? {
              ...bom,
              currentVersion: version.version,
              versions: [...bom.versions, version],
            }
          : bom,
      ),
    })),
  deleteBOM: (id) =>
    set((state) => ({
      boms: state.boms.filter((bom) => bom.id !== id),
    })),
  setBOMs: (boms) => set({ boms }),
});
