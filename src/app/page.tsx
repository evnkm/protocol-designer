"use client";

import { useState } from "react";
import DeckDesigner from "@/components/DeckDesigner";
import ProtocolSteps from "@/components/ProtocolSteps";
import ConfigurationPanel from "@/components/ConfigurationPanel";

export default function Home() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<"setup" | "deck" | "protocol">(
    "setup"
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Panel - Protocol Steps */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <ProtocolSteps
          activeStep={activeStep}
          onStepSelect={setActiveStep}
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>

      {/* Center Panel - Deck Designer */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <DeckDesigner currentTab={currentTab} activeStep={activeStep} />
      </div>

      {/* Right Panel - Configuration */}
      <div className="w-96 border-l border-gray-200 bg-white">
        <ConfigurationPanel currentTab={currentTab} activeStep={activeStep} />
      </div>
    </div>
  );
}
