import { create } from "zustand";

export type LabwareType = "plate" | "reservoir" | "tiprack" | "module";
export type ModuleType = "heater-shaker" | "magnetic" | "temperature";
export type LiquidType = {
  id: string;
  name: string;
  color: string;
};

export type Labware = {
  id: string;
  type: LabwareType;
  position: { x: number; y: number };
  name: string;
  moduleType?: ModuleType;
  wells?: number;
  contents?: { [wellId: string]: LiquidType };
};

export type ProtocolStep = {
  id: string;
  type: "transfer" | "mix" | "pause" | "temperature" | "shake";
  sourceLabware?: string;
  destinationLabware?: string;
  volume?: number;
  liquid?: string;
  duration?: number;
  temperature?: number;
  speed?: number;
};

type ProtocolStore = {
  labware: Labware[];
  liquids: LiquidType[];
  steps: ProtocolStep[];
  selectedLabware: string | null;
  selectedStep: string | null;

  // Actions
  addLabware: (labware: Labware) => void;
  removeLabware: (id: string) => void;
  updateLabware: (id: string, labware: Partial<Labware>) => void;
  addLiquid: (liquid: LiquidType) => void;
  removeLiquid: (id: string) => void;
  addStep: (step: ProtocolStep) => void;
  removeStep: (id: string) => void;
  updateStep: (id: string, step: Partial<ProtocolStep>) => void;
  setSelectedLabware: (id: string | null) => void;
  setSelectedStep: (id: string | null) => void;
};

export const useProtocolStore = create<ProtocolStore>((set) => ({
  labware: [],
  liquids: [],
  steps: [],
  selectedLabware: null,
  selectedStep: null,

  addLabware: (labware) =>
    set((state) => ({ labware: [...state.labware, labware] })),

  removeLabware: (id) =>
    set((state) => ({
      labware: state.labware.filter((l) => l.id !== id),
    })),

  updateLabware: (id, updatedLabware) =>
    set((state) => ({
      labware: state.labware.map((labware) =>
        labware.id === id ? { ...labware, ...updatedLabware } : labware
      ),
    })),

  addLiquid: (liquid) =>
    set((state) => ({ liquids: [...state.liquids, liquid] })),

  removeLiquid: (id) =>
    set((state) => ({
      liquids: state.liquids.filter((l) => l.id !== id),
    })),

  addStep: (step) => set((state) => ({ steps: [...state.steps, step] })),

  removeStep: (id) =>
    set((state) => ({
      steps: state.steps.filter((s) => s.id !== id),
    })),

  updateStep: (id, updatedStep) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === id ? { ...step, ...updatedStep } : step
      ),
    })),

  setSelectedLabware: (id) => set({ selectedLabware: id }),

  setSelectedStep: (id) => set({ selectedStep: id }),
}));
