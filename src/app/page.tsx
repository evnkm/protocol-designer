"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Timeline from "@/components/timeline";
import DeckVisualization from "@/components/deck-visualization/DeckVisualization";
import StepSettings from "@/components/step-settings";
import AddStepMenu from "@/components/add-step-menu";
import { cn } from "@/lib/utils";
import LiquidSelector from "@/components/LiquidSelector";
import { ProtocolStep } from "@/types/protocol";
import { DeckResource } from "@/components/lab-visualization/types";
import { VisualizerProvider } from "@/lib/state-sync/state-context";

type Tab = "setup" | "starting-deck" | "protocol-steps";

// Initial deck state with some example labware
const initialDeckState: DeckResource = {
  id: "deck-1",
  name: "Main Deck",
  type: "deck",
  position: { x: 0, y: 0, z: 0 },
  dimensions: { width: 10, height: 1, depth: 10 },
  children: [
    {
      id: "plate1",
      name: "Source Plate",
      type: "plate",
      position: { x: 1, y: 0, z: 1 },
      dimensions: { width: 1, height: 0.5, depth: 1 },
      contents: {
        A1: { volume: 1000, liquid_id: "sample1" },
      },
    },
    {
      id: "plate2",
      name: "Destination Plate",
      type: "plate",
      position: { x: 3, y: 0, z: 1 },
      dimensions: { width: 1, height: 0.5, depth: 1 },
      contents: {},
    },
    {
      id: "tiprack1",
      name: "Tip Rack",
      type: "tip_rack",
      position: { x: 5, y: 0, z: 1 },
      dimensions: { width: 1, height: 0.5, depth: 1 },
      contents: {
        A1: { volume: 0, liquid_id: undefined },
      },
    },
  ],
};

export default function ProtocolEditor() {
  const [showAddStepMenu, setShowAddStepMenu] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(
    null
  );
  const [steps, setSteps] = useState<ProtocolStep[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("protocol-steps");
  const [deckType, setDeckType] = useState<"HamiltonSTARDeck" | "OTDeck">(
    "HamiltonSTARDeck"
  );

  const handleAddStep = (step: ProtocolStep) => {
    setSteps([...steps, step]);
    setSelectedStepIndex(steps.length);
    setShowAddStepMenu(false);
  };

  return (
    <VisualizerProvider initialState={initialDeckState}>
      <div className="flex flex-col h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b bg-secondary/20">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className={cn(
                "transition-colors",
                activeTab === "starting-deck" && "bg-secondary/40"
              )}
              onClick={() => setActiveTab("starting-deck")}
            >
              Starting Deck
            </Button>
            <Button
              variant="secondary"
              className={cn(
                "transition-colors",
                activeTab === "protocol-steps" && "bg-secondary/40"
              )}
              onClick={() => setActiveTab("protocol-steps")}
            >
              Protocol Steps
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {deckType}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDeckType("HamiltonSTARDeck")}>
                HamiltonSTARDeck
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeckType("OTDeck")}>
                OTDeck
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <LiquidSelector />
            <Button size="sm">Done</Button>
          </div>
        </header>

        <main className="flex-1 flex">
          <div className="w-80 border-r">
            <Timeline
              steps={steps}
              selectedStepIndex={selectedStepIndex}
              onStepSelect={setSelectedStepIndex}
              onAddStepClick={() => setShowAddStepMenu(true)}
            />
          </div>

          <div className="flex-1 relative">
            <DeckVisualization deckType={deckType} />
            {showAddStepMenu && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
                <div className="relative h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setShowAddStepMenu(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <AddStepMenu onAddStep={handleAddStep} />
                </div>
              </div>
            )}
          </div>

          {selectedStepIndex !== null && (
            <div className="w-80 border-l">
              <StepSettings
                step={steps[selectedStepIndex]}
                onStepChange={(updatedStep) => {
                  const newSteps = [...steps];
                  newSteps[selectedStepIndex] = updatedStep;
                  setSteps(newSteps);
                }}
              />
            </div>
          )}
        </main>
      </div>
    </VisualizerProvider>
  );
}
