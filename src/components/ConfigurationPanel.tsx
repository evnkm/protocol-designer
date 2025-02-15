"use client";

import { useProtocolStore } from "@/store/protocolStore";
import type { Labware, LabwareType, ModuleType } from "@/store/protocolStore";
import { useState } from "react";

interface ConfigurationPanelProps {
  currentTab: "setup" | "deck" | "protocol";
  activeStep: string | null;
}

const LABWARE_TYPES: LabwareType[] = [
  "plate",
  "reservoir",
  "tiprack",
  "module",
];
const MODULE_TYPES: ModuleType[] = ["heater-shaker", "magnetic", "temperature"];

export default function ConfigurationPanel({
  currentTab,
  activeStep,
}: ConfigurationPanelProps) {
  const { selectedLabware, labware, steps, updateStep, addLabware } =
    useProtocolStore();

  const [newLabwareName, setNewLabwareName] = useState("");
  const [selectedLabwareType, setSelectedLabwareType] =
    useState<LabwareType>("plate");
  const [selectedModuleType, setSelectedModuleType] =
    useState<ModuleType>("heater-shaker");

  const selectedStep = steps.find((s) => s.id === activeStep);
  const currentLabware = labware.find((l) => l.id === selectedLabware);

  const handleAddLabware = () => {
    if (!newLabwareName) return;

    const newLabware: Labware = {
      id: `labware-${Date.now()}`,
      name: newLabwareName,
      type: selectedLabwareType,
      position: { x: 0, y: 0 }, // Default position, will be updated when placed
      moduleType:
        selectedLabwareType === "module" ? selectedModuleType : undefined,
      wells:
        selectedLabwareType === "plate"
          ? 96
          : selectedLabwareType === "reservoir"
          ? 12
          : 96,
    };

    addLabware(newLabware);
    setNewLabwareName("");
  };

  const renderSetupPanel = () => (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Instrument Configuration</h2>
      {/* Add instrument configuration options */}
    </div>
  );

  const renderDeckPanel = () => (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Add Labware</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={newLabwareName}
            onChange={(e) => setNewLabwareName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={selectedLabwareType}
            onChange={(e) =>
              setSelectedLabwareType(e.target.value as LabwareType)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {LABWARE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {selectedLabwareType === "module" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Module Type
            </label>
            <select
              value={selectedModuleType}
              onChange={(e) =>
                setSelectedModuleType(e.target.value as ModuleType)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {MODULE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleAddLabware}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Labware
        </button>
      </div>

      {currentLabware && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Selected Labware</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium">{currentLabware.name}</div>
            <div className="text-sm text-gray-500">{currentLabware.type}</div>
            {currentLabware.moduleType && (
              <div className="text-sm text-blue-600">
                {currentLabware.moduleType}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderProtocolPanel = () => {
    if (!selectedStep) return null;

    return (
      <div className="p-4">
        <h2 className="text-lg font-medium mb-4">Step Configuration</h2>

        <div className="space-y-4">
          {selectedStep.type === "transfer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Source
                </label>
                <select
                  value={selectedStep.sourceLabware || ""}
                  onChange={(e) =>
                    updateStep(selectedStep.id, {
                      sourceLabware: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select source</option>
                  {labware.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Destination
                </label>
                <select
                  value={selectedStep.destinationLabware || ""}
                  onChange={(e) =>
                    updateStep(selectedStep.id, {
                      destinationLabware: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select destination</option>
                  {labware.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Volume (µL)
                </label>
                <input
                  type="number"
                  value={selectedStep.volume || ""}
                  onChange={(e) =>
                    updateStep(selectedStep.id, {
                      volume: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Add more step type configurations */}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      {currentTab === "setup" && renderSetupPanel()}
      {currentTab === "deck" && renderDeckPanel()}
      {currentTab === "protocol" && renderProtocolPanel()}
    </div>
  );
}
