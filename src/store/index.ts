import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createItemSlice, type ItemSlice } from "./slices/item-slice";
import { createBomSlice, type BomSlice } from "./slices/bom-slice";
import {
  createMovementSlice,
  type MovementSlice,
} from "./slices/movement-slice";
import {
  createSupplierSlice,
  type SupplierSlice,
} from "./slices/supplier-slice";
import {
  createPurchaseOrderSlice,
  type PurchaseOrderSlice,
} from "./slices/purchase-order-slice";
import { createUiSlice, type UiSlice } from "./slices/ui-slice";
import {
  seedItems,
  seedBOMs,
  seedMovements,
  seedSuppliers,
  seedPurchaseOrders,
} from "@/data/seed";
import { STORAGE_KEY } from "@/data/constants";

export type BoundStore = ItemSlice &
  BomSlice &
  MovementSlice &
  SupplierSlice &
  PurchaseOrderSlice &
  UiSlice & {
    resetToSeedData: () => void;
    _hasHydrated: boolean;
    _setHasHydrated: (v: boolean) => void;
  };

export const useBoundStore = create<BoundStore>()(
  persist(
    (set, get, api) => ({
      ...createItemSlice(set, get, api),
      ...createBomSlice(set, get, api),
      ...createMovementSlice(set, get, api),
      ...createSupplierSlice(set, get, api),
      ...createPurchaseOrderSlice(set, get, api),
      ...createUiSlice(set, get, api),

      _hasHydrated: false,
      _setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),

      resetToSeedData: () => {
        set({
          items: seedItems,
          boms: seedBOMs,
          movements: seedMovements,
          suppliers: seedSuppliers,
          purchaseOrders: seedPurchaseOrders,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        items: state.items,
        boms: state.boms,
        movements: state.movements,
        suppliers: state.suppliers,
        purchaseOrders: state.purchaseOrders,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    },
  ),
);
