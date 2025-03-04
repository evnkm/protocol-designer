import React from "react";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { DeckResource } from "./types";
import { Labware } from "./resources/Labware";

interface DeckStateProps {
  deckState: DeckResource;
  stepIndex: number;
  onStateChange?: (newState: DeckResource) => void;
}

export const DeckState: React.FC<DeckStateProps> = ({
  deckState,
  stepIndex,
  onStateChange,
}) => {
  const [selectedLabware, setSelectedLabware] = useState<string | null>(null);
  const [resources, setResources] = useState<DeckResource>(deckState);

  useEffect(() => {
    setResources(deckState);
  }, [deckState, stepIndex]);

  const handleLabwareClick = (labwareId: string) => {
    setSelectedLabware(labwareId === selectedLabware ? null : labwareId);
  };

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {/* Base grid */}
        <Grid
          args={[10, 10]}
          position={[0, -0.01, 0]}
          cellSize={1}
          cellThickness={1}
          cellColor="#6b7280"
          sectionSize={3}
        />

        {/* Render labware */}
        {resources.children.map((labware) => (
          <Labware
            key={labware.id}
            data={labware}
            selected={labware.id === selectedLabware}
            onClick={() => handleLabwareClick(labware.id)}
          />
        ))}
      </Canvas>
    </div>
  );
};
