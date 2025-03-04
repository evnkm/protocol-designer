import { Group, Rect, Text } from 'react-konva';
import { COLORS, DIMENSIONS, OT_DECK_POSITIONS } from '../constants';
import { DeckResource, Resource } from '../types';
import { BaseDeck, BaseDeckProps } from './BaseDeck';

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

export function OTDeck({ deck, onResourceClick }: BaseDeckProps) {
  if (!deck) return null;

  return (
    <Group>
      <BaseDeck deck={deck} onResourceClick={onResourceClick} />
      
      {/* Draw deck grid */}
      <Group>
        {OT_DECK_POSITIONS.map((pos, i) => (
          <Group key={i}>
            <Rect
              x={pos.x}
              y={pos.y}
              width={DIMENSIONS.OT_SITE_WIDTH}
              height={DIMENSIONS.OT_SITE_HEIGHT}
              stroke="#FFFFFF"
              strokeWidth={1}
              fill="transparent"
            />
            <Text
              x={pos.x + 5}
              y={pos.y + 5}
              text={`${i + 1}`}
              fontSize={14}
              fill="#FFFFFF"
            />
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
