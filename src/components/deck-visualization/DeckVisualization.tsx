import { Stage, Layer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import { useVisualizerState } from "@/lib/state-sync/state-context";
import { DIMENSIONS } from "./constants";
import { HamiltonSTARDeck } from "./decks/HamiltonSTARDeck";
import { OTDeck } from "./decks/OTDeck";
import { DeckResource } from "../lab-visualization/types";

interface DeckVisualizationProps {
  deckType: "HamiltonSTARDeck" | "OTDeck";
}

export default function DeckVisualization({
  deckType,
}: DeckVisualizationProps) {
  const { currentState } = useVisualizerState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth,
          height: clientHeight,
        });

        // Calculate scale based on deck type
        const deckWidth =
          deckType === "HamiltonSTARDeck"
            ? (DIMENSIONS.HAMILTON_RAIL_WIDTH +
                DIMENSIONS.HAMILTON_RAIL_SPACING) *
              9
            : DIMENSIONS.OT_DECK_WIDTH;

        const deckHeight =
          deckType === "HamiltonSTARDeck"
            ? DIMENSIONS.HAMILTON_RAIL_HEIGHT
            : DIMENSIONS.OT_DECK_HEIGHT;

        const scaleX =
          (clientWidth - DIMENSIONS.CANVAS_PADDING * 2) / deckWidth;
        const scaleY =
          (clientHeight - DIMENSIONS.CANVAS_PADDING * 2) / deckHeight;
        setScale(Math.min(scaleX, scaleY) * 0.8); // 0.8 for some padding
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [deckType]);

  const handleResourceClick = (resource: DeckResource) => {
    console.log("Resource clicked:", resource);
  };

  const DeckComponent =
    deckType === "HamiltonSTARDeck" ? HamiltonSTARDeck : OTDeck;

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scale={{ x: scale, y: scale }}
      >
        <Layer>
          <DeckComponent
            deck={currentState}
            onResourceClick={handleResourceClick}
          />
        </Layer>
      </Stage>
    </div>
  );
}
