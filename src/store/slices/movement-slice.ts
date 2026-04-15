import type { StateCreator } from "zustand";
import type { StockMovement } from "@/types";

export interface MovementSlice {
  movements: StockMovement[];
  addMovement: (movement: StockMovement) => void;
  addBulkMovements: (movements: StockMovement[]) => void;
  setMovements: (movements: StockMovement[]) => void;
}

export const createMovementSlice: StateCreator<
  MovementSlice,
  [],
  [],
  MovementSlice
> = (set) => ({
  movements: [],
  addMovement: (movement) =>
    set((state) => ({
      movements: [...state.movements, movement],
    })),
  addBulkMovements: (newMovements) =>
    set((state) => ({
      movements: [...state.movements, ...newMovements],
    })),
  setMovements: (movements) => set({ movements }),
});
