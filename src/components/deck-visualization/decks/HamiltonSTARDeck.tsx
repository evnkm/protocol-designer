import { Group, Rect, Line } from 'react-konva';
import { COLORS, DIMENSIONS } from '../constants';
import { DeckResource, Resource } from '../types';
import { BaseDeck, BaseDeckProps } from './BaseDeck';

interface HamiltonSTARDeckProps extends BaseDeckProps {
  numRails?: number;
}

function ResourceComponent({ resource }: { resource: Resource }) {
  if (!resource) return null;
  
  const { position, dimensions, type, state } = resource;

  let fill = COLORS[type as keyof typeof COLORS] || COLORS.default;
  
  // If it's a tip spot, color based on tip presence
  if (type === 'tip_spot' && state?.has_tip !== undefined) {
    fill = state.has_tip ? COLORS.tipRack : COLORS.default;
  }
  
  // If it's a container, show liquid level
  if (type === 'container' && state?.liquids) {
    const totalVolume = state.liquids.reduce((sum, liquid) => sum + liquid.volume, 0);
    if (totalVolume > 0) {
      const heightRatio = Math.min(totalVolume / 100, 1); // Assuming max volume is 100
      return (
        <Group x={position.x} y={position.y}>
          <Rect
            width={dimensions.width}
            height={dimensions.depth}
            fill={COLORS.default}
            stroke="#000000"
            strokeWidth={1}
            cornerRadius={2}
          />
          <Rect
            width={dimensions.width}
            height={dimensions.depth * heightRatio}
            fill={state.liquids[0].color || COLORS.liquidDefault}
            y={dimensions.depth * (1 - heightRatio)}
          />
        </Group>
      );
    }
  }

  return (
    <Group x={position.x} y={position.y}>
      <Rect
        width={dimensions.width}
        height={dimensions.depth}
        fill={fill}
        stroke="#000000"
        strokeWidth={1}
        cornerRadius={2}
      />
      {resource.children?.map((child) => (
        <ResourceComponent key={child.id} resource={child} />
      ))}
    </Group>
  );
}

export function HamiltonSTARDeck({ deck, numRails = 9, onResourceClick }: HamiltonSTARDeckProps) {
  if (!deck) return null;

  const railSpacing = DIMENSIONS.HAMILTON_RAIL_SPACING;
  const railWidth = DIMENSIONS.HAMILTON_RAIL_WIDTH;
  const railHeight = DIMENSIONS.HAMILTON_RAIL_HEIGHT;

  return (
    <Group>
      <BaseDeck deck={deck} onResourceClick={onResourceClick} />
      
      {/* Draw rails */}
      <Group>
        {Array.from({ length: numRails }).map((_, i) => (
          <Group key={i} x={i * (railWidth + railSpacing)}>
            {/* Rail base */}
            <Rect
              width={railWidth}
              height={railHeight}
              fill={COLORS.hamiltonDeck}
              stroke="#000000"
              strokeWidth={1}
            />
            
            {/* Rail markings - every 100mm */}
            {Array.from({ length: Math.floor(railHeight / 100) }).map((_, j) => (
              <Line
                key={j}
                points={[0, j * 100, railWidth, j * 100]}
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            ))}
          </Group>
        ))}
      </Group>

      {/* Draw resources */}
      <Group>
        {deck.children?.map((resource) => (
          <ResourceComponent key={resource.id} resource={resource} />
        ))}
      </Group>
    </Group>
  );
}
