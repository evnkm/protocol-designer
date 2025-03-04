import { Group, Rect } from 'react-konva';
import { COLORS } from '../constants';
import { DeckResource } from '@/components/lab-visualization/types';

export interface BaseDeckProps {
  deck: DeckResource;
  onResourceClick?: (resource: DeckResource) => void;
}

export function BaseDeck({ deck, onResourceClick }: BaseDeckProps) {
  return (
    <Group
      x={deck.position.x}
      y={deck.position.y}
      onClick={() => onResourceClick?.(deck)}
    >
      <Rect
        width={deck.dimensions.width}
        height={deck.dimensions.depth}
        fill={COLORS.deck}
        stroke="#000000"
        strokeWidth={1}
        cornerRadius={2}
      />
    </Group>
  );
}
