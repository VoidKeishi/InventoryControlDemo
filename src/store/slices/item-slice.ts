import type { StateCreator } from "zustand";
import type { Item } from "@/types";

export interface ItemSlice {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Omit<Item, "id">>) => void;
  deleteItem: (id: string) => void;
  setItems: (items: Item[]) => void;
}

export const createItemSlice: StateCreator<ItemSlice, [], [], ItemSlice> = (
  set,
) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  setItems: (items) => set({ items }),
});
