import type { StateCreator } from "zustand";
import type { Supplier } from "@/types";

export interface SupplierSlice {
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (
    id: string,
    updates: Partial<Omit<Supplier, "id">>,
  ) => void;
  deleteSupplier: (id: string) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
}

export const createSupplierSlice: StateCreator<
  SupplierSlice,
  [],
  [],
  SupplierSlice
> = (set) => ({
  suppliers: [],
  addSupplier: (supplier) =>
    set((state) => ({ suppliers: [...state.suppliers, supplier] })),
  updateSupplier: (id, updates) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    })),
  deleteSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id),
    })),
  setSuppliers: (suppliers) => set({ suppliers }),
});
