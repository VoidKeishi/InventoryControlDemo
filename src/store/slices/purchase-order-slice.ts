import type { StateCreator } from "zustand";
import type {
  PurchaseOrder,
  PurchaseOrderStatus,
  StockMovement,
} from "@/types";
import type { MovementSlice } from "./movement-slice";

export interface PurchaseOrderSlice {
  purchaseOrders: PurchaseOrder[];
  addPO: (po: PurchaseOrder) => void;
  updatePO: (
    id: string,
    updates: Partial<Omit<PurchaseOrder, "id" | "createdAt">>,
  ) => void;
  confirmPO: (id: string) => void;
  cancelPO: (id: string) => void;
  receivePO: (
    id: string,
    receipts: { itemId: string; quantity: number }[],
    createdBy: string,
  ) => void;
  setPurchaseOrders: (pos: PurchaseOrder[]) => void;
}

type RequiredState = PurchaseOrderSlice & MovementSlice;

export const createPurchaseOrderSlice: StateCreator<
  RequiredState,
  [],
  [],
  PurchaseOrderSlice
> = (set) => ({
  purchaseOrders: [],
  addPO: (po) =>
    set((state) => ({ purchaseOrders: [...state.purchaseOrders, po] })),
  updatePO: (id, updates) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id
          ? { ...po, ...updates, updatedAt: new Date().toISOString() }
          : po,
      ),
    })),
  confirmPO: (id) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id && po.status === "draft"
          ? { ...po, status: "ordered", updatedAt: new Date().toISOString() }
          : po,
      ),
    })),
  cancelPO: (id) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id &&
        (po.status === "draft" || po.status === "ordered")
          ? { ...po, status: "cancelled", updatedAt: new Date().toISOString() }
          : po,
      ),
    })),
  receivePO: (id, receipts, createdBy) =>
    set((state) => {
      const po = state.purchaseOrders.find((p) => p.id === id);
      if (!po) return state;
      if (po.status !== "ordered" && po.status !== "partial") return state;

      const receiptMap = new Map(receipts.map((r) => [r.itemId, r.quantity]));
      const timestamp = new Date().toISOString();

      const updatedLines = po.lines.map((line) => {
        const qty = receiptMap.get(line.itemId) ?? 0;
        if (qty <= 0) return line;
        const remaining = line.quantity - line.receivedQuantity;
        const applied = Math.min(qty, Math.max(0, remaining));
        return {
          ...line,
          receivedQuantity: line.receivedQuantity + applied,
        };
      });

      const allReceived = updatedLines.every(
        (l) => l.receivedQuantity >= l.quantity,
      );
      const anyReceived = updatedLines.some((l) => l.receivedQuantity > 0);
      const newStatus: PurchaseOrderStatus = allReceived
        ? "received"
        : anyReceived
          ? "partial"
          : po.status;

      const newMovements: StockMovement[] = [];
      for (const line of po.lines) {
        const requested = receiptMap.get(line.itemId) ?? 0;
        if (requested <= 0) continue;
        const remaining = line.quantity - line.receivedQuantity;
        const applied = Math.min(requested, Math.max(0, remaining));
        if (applied <= 0) continue;
        newMovements.push({
          id: `mv_po_${id}_${line.itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          itemId: line.itemId,
          type: "receipt",
          quantity: applied,
          bomId: null,
          bomVersion: null,
          poId: id,
          unitPrice: line.unitPrice,
          reason: `Nhập theo ${po.code}`,
          createdAt: timestamp,
          createdBy,
        });
      }

      return {
        purchaseOrders: state.purchaseOrders.map((p) =>
          p.id === id
            ? {
                ...p,
                lines: updatedLines,
                status: newStatus,
                updatedAt: timestamp,
              }
            : p,
        ),
        movements: [...state.movements, ...newMovements],
      };
    }),
  setPurchaseOrders: (purchaseOrders) => set({ purchaseOrders }),
});
