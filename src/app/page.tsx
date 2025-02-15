// "use client";

// import { useState } from "react";
// import DeckDesigner from "@/components/DeckDesigner";
// import ProtocolSteps from "@/components/ProtocolSteps";
// import ConfigurationPanel from "@/components/ConfigurationPanel";

// export default function Home() {
//   const [activeStep, setActiveStep] = useState<string | null>(null);
//   const [currentTab, setCurrentTab] = useState<"setup" | "deck" | "protocol">(
//     "setup"
//   );

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Left Panel - Protocol Steps */}
//       <div className="w-80 border-r border-gray-200 bg-white">
//         <ProtocolSteps
//           activeStep={activeStep}
//           onStepSelect={setActiveStep}
//           currentTab={currentTab}
//           onTabChange={setCurrentTab}
//         />
//       </div>

//       {/* Center Panel - Deck Designer */}
//       <div className="flex-1 bg-gray-50 overflow-auto">
//         <DeckDesigner currentTab={currentTab} activeStep={activeStep} />
//       </div>

//       {/* Right Panel - Configuration */}
//       <div className="w-96 border-l border-gray-200 bg-white">
//         <ConfigurationPanel currentTab={currentTab} activeStep={activeStep} />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Timeline from "@/components/timeline";
import DeckVisualization from "@/components/deck-visualization";
import StepSettings from "@/components/step-settings";
import AddStepMenu from "@/components/add-step-menu";

export default function ProtocolEditor() {
  const [showAddStepMenu, setShowAddStepMenu] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  // REMOVE LATER: add a sample timeline consisting of 20 steps
  const sampleSteps = Array.from({ length: 20 }, (_, i) => `Step ${i + 1}`);

  const handleAddStep = (stepType: string) => {
    setSteps([...steps, stepType]);
    setSelectedStep(stepType);
    setShowAddStepMenu(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-secondary/20">
        <div className="flex gap-2">
          <Button variant="secondary" className="bg-secondary/40">
            Protocol starting deck
          </Button>
          <Button variant="secondary">Protocol steps</Button>
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
        <div className="border-r-2 resize-x min-w-[240px] max-w-[480px] w-[320px] overflow-y-auto">
          <Timeline
            // REMOVE LATER: add a sample timeline consisting of 20 steps
            steps={sampleSteps}
            selectedStep={selectedStep}
            onStepSelect={setSelectedStep}
            onAddStepClick={() => setShowAddStepMenu(true)}
          />
        </div>

        <div className="flex-1 relative">
          <DeckVisualization />

          {showAddStepMenu && (
            <AddStepMenu
              onSelect={handleAddStep}
              onClose={() => setShowAddStepMenu(false)}
            />
          )}
        </div>

        {selectedStep && (
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
