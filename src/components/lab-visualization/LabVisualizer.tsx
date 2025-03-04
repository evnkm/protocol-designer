import React, { useEffect, useState } from "react";
import { DeckState } from "./DeckState";
import { DeckResource } from "./types";
import { ProtocolStep } from "../../types/protocol";

interface LabVisualizerProps {
  steps: ProtocolStep[];
  currentStepIndex: number;
  onStepComplete?: (stepIndex: number) => void;
}

export const LabVisualizer: React.FC<LabVisualizerProps> = ({
  steps,
  currentStepIndex,
  onStepComplete,
}) => {
  const [currentDeckState, setCurrentDeckState] = useState<DeckResource | null>(
    null
  );
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (steps[currentStepIndex]) {
      setCurrentDeckState(steps[currentStepIndex].deckState);
    }
  }, [currentStepIndex, steps]);

  const handleStateChange = (newState: DeckResource) => {
    setCurrentDeckState(newState);
    if (onStepComplete) {
      onStepComplete(currentStepIndex);
    }
  };

  if (!currentDeckState) {
    return <div>Loading deck visualization...</div>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 right-0 p-4 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <h3 className="text-sm font-semibold">Current Step</h3>
          <p className="text-xs">{steps[currentStepIndex]?.description}</p>
        </div>
      </div>

      <DeckState
        deckState={currentDeckState}
        stepIndex={currentStepIndex}
        onStateChange={handleStateChange}
      />

      {isSimulating && (
        <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full">
          Simulating...
        </div>
      )}
    </div>
  );
};
