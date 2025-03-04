import { Stage, Layer } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import { useVisualizerState } from '@/lib/state-sync/state-context';
import { DIMENSIONS, CANVAS_PADDING, SCALE_FACTOR } from './constants';
import { HamiltonSTARDeck } from './decks/HamiltonSTARDeck';
import { OTDeck } from './decks/OTDeck';
import { DeckResource } from './types';

interface DeckVisualizationProps {
  deckType: 'HamiltonSTARDeck' | 'OTDeck';
}

export function DeckVisualization({ deckType }: DeckVisualizationProps) {
  const { currentState, updateState } = useVisualizerState();
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
        const deckWidth = deckType === 'HamiltonSTARDeck' 
          ? DIMENSIONS.HAMILTON_DECK_WIDTH
          : DIMENSIONS.OT_DECK_WIDTH;
        
        const deckHeight = deckType === 'HamiltonSTARDeck'
          ? DIMENSIONS.HAMILTON_DECK_HEIGHT
          : DIMENSIONS.OT_DECK_HEIGHT;

        const scaleX = (clientWidth - CANVAS_PADDING * 2) / deckWidth;
        const scaleY = (clientHeight - CANVAS_PADDING * 2) / deckHeight;
        setScale(Math.min(scaleX, scaleY) * SCALE_FACTOR);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [deckType]);

  const handleResourceClick = (resource: DeckResource) => {
    // Handle resource selection
    updateState({
      ...currentState,
      selectedResource: resource.id
    });
  };

  const DeckComponent = deckType === 'HamiltonSTARDeck' ? HamiltonSTARDeck : OTDeck;

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-900">
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
