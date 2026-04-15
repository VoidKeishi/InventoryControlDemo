import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createItemSlice, type ItemSlice } from "./slices/item-slice";
import { createBomSlice, type BomSlice } from "./slices/bom-slice";
import {
  createMovementSlice,
  type MovementSlice,
} from "./slices/movement-slice";
import { createUiSlice, type UiSlice } from "./slices/ui-slice";
import { seedItems, seedBOMs, seedMovements } from "@/data/seed";
import { STORAGE_KEY } from "@/data/constants";

export type BoundStore = ItemSlice & BomSlice & MovementSlice & UiSlice & {
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
      ...createUiSlice(set, get, api),

      _hasHydrated: false,
      _setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),

      resetToSeedData: () => {
        set({
          items: seedItems,
          boms: seedBOMs,
          movements: seedMovements,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        items: state.items,
        boms: state.boms,
        movements: state.movements,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    },
  ),
);
