import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stepToIcon } from "./add-step-menu";
import React from "react";
import { ProtocolStep } from "@/types/protocol";

interface TimelineProps {
  steps: ProtocolStep[];
  selectedStepIndex: number | null;
  onStepSelect: (index: number) => void;
  onAddStepClick: () => void;
}

export default function Timeline({
  steps,
  selectedStepIndex,
  onStepSelect,
  onAddStepClick,
}: TimelineProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Fixed Header */}
      <div className="sticky top-0 p-4 border-b bg-background z-10">
        <h2 className="font-medium">Timeline</h2>
      </div>

      {/* Scrollable Steps Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => onStepSelect(-1)}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Starting deck
          </Button>

          {steps.map((step, index) => (
            <Button
              key={step.id}
              variant={selectedStepIndex === index ? "default" : "secondary"}
              className="w-full justify-start"
              onClick={() => onStepSelect(index)}
            >
              {stepToIcon[step.type] &&
                React.createElement(stepToIcon[step.type], {
                  className: "mr-2 h-4 w-4",
                })}
              {index + 1}. {step.description}
            </Button>
          ))}

          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => onStepSelect("Ending deck")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ending deck
          </Button>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="sticky bottom-0 p-4 border-t bg-background z-10">
        <Button variant="outline" className="w-full" onClick={onAddStepClick}>
          + Add Step
        </Button>
      </div>
    </div>
  );
}
