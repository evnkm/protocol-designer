"use client";

import React from "react";
import {
  Move,
  Droplet,
  RefreshCw,
  Pause,
  ThermometerSun,
  Magnet,
  Thermometer,
  Activity,
  Pipette,
  Beaker,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtocolStep } from "@/types/protocol";
import { DeckResource } from "@/components/lab-visualization/types";
import { LucideIcon } from "lucide-react";

export const stepToIcon: Record<string, LucideIcon> = {
  transfer: Pipette,
  load_tips: Droplet,
  drop_tips: Droplet,
  mix: Beaker,
};

interface AddStepMenuProps {
  onAddStep: (step: ProtocolStep) => void;
}

const emptyDeckState: DeckResource = {
  id: "deck",
  name: "Main Deck",
  type: "deck",
  position: { x: 0, y: 0, z: 0 },
  dimensions: { width: 10, height: 1, depth: 10 },
  children: [],
};

export default function AddStepMenu({ onAddStep }: AddStepMenuProps) {
  const createStep = (
    type: ProtocolStep["type"],
    description: string
  ): ProtocolStep => {
    const baseStep = {
      id: crypto.randomUUID(),
      type,
      description,
      deckState: emptyDeckState,
    };

    switch (type) {
      case "transfer":
        return {
          ...baseStep,
          type: "transfer",
          source: {
            labwareId: "",
            wellId: "",
            volume: 0,
            liquidId: "",
          },
          destination: {
            labwareId: "",
            wellId: "",
          },
          pyLabCode: "",
        };

      case "load_tips":
        return {
          ...baseStep,
          type: "load_tips",
          tipRackId: "",
          wellIds: [],
          pyLabCode: "",
        };

      case "drop_tips":
        return {
          ...baseStep,
          type: "drop_tips",
          tipRackId: "",
          wellIds: [],
          pyLabCode: "",
        };

      case "mix":
        return {
          ...baseStep,
          type: "mix",
          labwareId: "",
          wellId: "",
          volume: 0,
          repetitions: 1,
          pyLabCode: "",
        };

      default:
        throw new Error(`Unknown step type: ${type}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-medium mb-4">Add Step</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => {
              const step = createStep("transfer", "Transfer liquid");
              onAddStep(step);
            }}
          >
            <Pipette className="h-8 w-8" />
            Transfer
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => {
              const step = createStep("load_tips", "Load tips");
              onAddStep(step);
            }}
          >
            <Droplet className="h-8 w-8" />
            Load Tips
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => {
              const step = createStep("drop_tips", "Drop tips");
              onAddStep(step);
            }}
          >
            <Droplet className="h-8 w-8" />
            Drop Tips
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => {
              const step = createStep("mix", "Mix liquid");
              onAddStep(step);
            }}
          >
            <Beaker className="h-8 w-8" />
            Mix
          </Button>
        </div>
      </div>
    </div>
  );
}
