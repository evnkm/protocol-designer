import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stepToIcon } from "./add-step-menu";
import React from "react";

interface TimelineProps {
  steps: string[];
  selectedStep: string | null;
  onStepSelect: (step: string) => void;
  onAddStepClick: () => void;
}

export default function Timeline({
  steps,
  selectedStep,
  onStepSelect,
  onAddStepClick,
}: TimelineProps) {
  return (
    <div className="flex flex-col h-full">
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
            onClick={() => onStepSelect("Starting deck")}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Starting deck
          </Button>

          {steps.map((step, index) => (
            <Button
              key={index}
              variant={selectedStep === step ? "default" : "secondary"}
              className="w-full justify-start"
              onClick={() => onStepSelect(step)}
            >
              {stepToIcon[step] &&
                React.createElement(stepToIcon[step], {
                  className: "mr-2 h-4 w-4",
                })}
              {index + 1}. {step}
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
