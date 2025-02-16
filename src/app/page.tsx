"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Timeline from "@/components/timeline";
import DeckVisualization from "@/components/deck-visualization";
import StepSettings from "@/components/step-settings";
import AddStepMenu from "@/components/add-step-menu";
import { cn } from "@/lib/utils";

type Tab = "starting-deck" | "protocol-steps";

export default function ProtocolEditor() {
  const [showAddStepMenu, setShowAddStepMenu] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("protocol-steps");

  // REMOVE LATER: add a sample timeline consisting of 20 steps
  const sampleSteps = Array.from({ length: 20 }, (_, i) => `Step ${i + 1}`);

  useEffect(() => {
    setSteps(sampleSteps);
  }, []);

  const handleAddStep = (stepType: string) => {
    setSteps([...steps, stepType]);
    setSelectedStep(stepType);
    setShowAddStepMenu(false);
  };

  return (
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
            Protocol starting deck
          </Button>
          <Button
            variant="secondary"
            className={cn(
              "transition-colors",
              activeTab === "protocol-steps" && "bg-secondary/40"
            )}
            onClick={() => setActiveTab("protocol-steps")}
          >
            Protocol steps
          </Button>
        </div>

        {/* <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2">
          Test
        </h1> */}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Liquid
          </Button>
          <Button size="sm">Done</Button>
        </div>
      </header>

      <div className="flex flex-1">
        {activeTab === "protocol-steps" && (
          <div className="border-r-2 resize-x min-w-[240px] max-w-[480px] w-[320px] overflow-y-auto">
            <Timeline
              steps={steps}
              selectedStep={selectedStep}
              onStepSelect={setSelectedStep}
              onAddStepClick={() => setShowAddStepMenu(true)}
            />
          </div>
        )}

        <div className="flex-1 relative">
          <DeckVisualization />

          {showAddStepMenu && (
            <AddStepMenu
              onSelect={handleAddStep}
              onClose={() => setShowAddStepMenu(false)}
            />
          )}
        </div>

        {selectedStep && activeTab === "protocol-steps" && (
          <div className="w-96 border-l">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <span>Part 1/2</span>
                <span className="font-medium">{selectedStep}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedStep(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <StepSettings stepType={selectedStep} />
          </div>
        )}
      </div>
    </div>
  );
}
