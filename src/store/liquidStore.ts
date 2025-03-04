import { create } from "zustand";

interface Liquid {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface LiquidStore {
  liquids: Liquid[];
  addLiquid: (liquid: Omit<Liquid, "id">) => void;
  removeLiquid: (id: string) => void;
}

export const useLiquidStore = create<LiquidStore>((set) => ({
  liquids: [],
  addLiquid: (liquid) =>
    set((state) => ({
      liquids: [
        ...state.liquids,
        { ...liquid, id: Math.random().toString(36).substring(7) },
      ],
    })),
  removeLiquid: (id) =>
    set((state) => ({
      liquids: state.liquids.filter((liquid) => liquid.id !== id),
    })),
}));
