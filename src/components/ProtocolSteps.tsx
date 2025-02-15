"use client";

import { useProtocolStore } from "@/store/protocolStore";
import { Tab } from "@headlessui/react";
import {
  BeakerIcon,
  ViewColumnsIcon,
  PlayIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  ClockIcon,
  FireIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import type { ProtocolStep } from "@/store/protocolStore";

interface ProtocolStepsProps {
  activeStep: string | null;
  onStepSelect: (stepId: string | null) => void;
  currentTab: "setup" | "deck" | "protocol";
  onTabChange: (tab: "setup" | "deck" | "protocol") => void;
}

const tabs = [
  { name: "Setup", value: "setup", icon: BeakerIcon },
  { name: "Deck", value: "deck", icon: ViewColumnsIcon },
  { name: "Protocol", value: "protocol", icon: PlayIcon },
];

const stepTypes = [
  { type: "transfer", icon: ArrowsRightLeftIcon, label: "Transfer" },
  { type: "mix", icon: ArrowPathIcon, label: "Mix" },
  { type: "pause", icon: ClockIcon, label: "Pause" },
  { type: "temperature", icon: FireIcon, label: "Temperature" },
  { type: "shake", icon: ArrowsUpDownIcon, label: "Shake" },
] as const;

export default function ProtocolSteps({
  activeStep,
  onStepSelect,
  currentTab,
  onTabChange,
}: ProtocolStepsProps) {
  const { steps, addStep } = useProtocolStore();

  const handleAddStep =
    (type: ProtocolStep["type"]) => (event: React.MouseEvent) => {
      event.preventDefault();
      const newStep: ProtocolStep = {
        id: `step-${Date.now()}`,
        type,
      };
      addStep(newStep);
      onStepSelect(newStep.id);
    };

  const renderStepContent = (step: ProtocolStep) => {
    const StepIcon =
      stepTypes.find((t) => t.type === step.type)?.icon || BeakerIcon;

    switch (step.type) {
      case "transfer":
        return (
          <>
            <div className="flex items-center gap-2">
              <StepIcon className="w-5 h-5 text-blue-600" />
              <div className="font-medium">Transfer</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {step.volume ? `${step.volume}µL` : "Volume not set"} from{" "}
              {step.sourceLabware || "source"} to{" "}
              {step.destinationLabware || "destination"}
            </div>
          </>
        );
      case "mix":
        return (
          <>
            <div className="flex items-center gap-2">
              <StepIcon className="w-5 h-5 text-purple-600" />
              <div className="font-medium">Mix</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {step.volume ? `${step.volume}µL` : "Volume not set"} in{" "}
              {step.sourceLabware || "labware"}
            </div>
          </>
        );
      case "pause":
        return (
          <>
            <div className="flex items-center gap-2">
              <StepIcon className="w-5 h-5 text-yellow-600" />
              <div className="font-medium">Pause</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {step.duration ? `${step.duration} seconds` : "Duration not set"}
            </div>
          </>
        );
      case "temperature":
        return (
          <>
            <div className="flex items-center gap-2">
              <StepIcon className="w-5 h-5 text-red-600" />
              <div className="font-medium">Temperature</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {step.temperature
                ? `${step.temperature}°C`
                : "Temperature not set"}{" "}
              for{" "}
              {step.duration ? `${step.duration} seconds` : "duration not set"}
            </div>
          </>
        );
      case "shake":
        return (
          <>
            <div className="flex items-center gap-2">
              <StepIcon className="w-5 h-5 text-green-600" />
              <div className="font-medium">Shake</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {step.speed ? `${step.speed} rpm` : "Speed not set"} for{" "}
              {step.duration ? `${step.duration} seconds` : "duration not set"}
            </div>
          </>
        );
      default:
        return <div className="font-medium">{step.type}</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tab.Group
        selectedIndex={tabs.findIndex((tab) => tab.value === currentTab)}
        onChange={(index) =>
          onTabChange(tabs[index].value as typeof currentTab)
        }
      >
        <Tab.List className="flex p-1 space-x-1 bg-gray-100">
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              className={({ selected }) =>
                `flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md
                ${
                  selected
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="flex-1 overflow-auto">
          <Tab.Panel className="h-full p-4">
            <h2 className="text-lg font-medium mb-4">Instrument Setup</h2>
            {/* Add instrument setup content */}
          </Tab.Panel>

          <Tab.Panel className="h-full p-4">
            <h2 className="text-lg font-medium mb-4">Deck Configuration</h2>
            {/* Add deck configuration content */}
          </Tab.Panel>

          <Tab.Panel className="h-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Protocol Steps</h2>
              <div className="flex gap-2">
                {stepTypes.map(({ type, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={handleAddStep(type)}
                    className="p-2 rounded-full hover:bg-gray-100 group"
                    title={`Add ${type} step`}
                  >
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {steps.map((step) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`protocol-step ${
                      activeStep === step.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => onStepSelect(step.id)}
                  >
                    {renderStepContent(step)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
