import type { StateCreator } from "zustand";

export interface UiSlice {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (
  set,
) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
});
