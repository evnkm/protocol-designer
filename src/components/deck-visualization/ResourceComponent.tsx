import { Group, Rect, Text } from 'react-konva';
import { DeckResource } from '../lab-visualization/types';

interface ResourceComponentProps {
  resource: DeckResource;
  x: number;
  y: number;
}

const COLORS = {
  deck: '#5B6D8F',
  plate: '#8F5B6D',
  tip_rack: '#6D8F5B',
  well: '#5B8F6D',
  default: '#CCCCCC',
};

export function ResourceComponent({ resource, x, y }: ResourceComponentProps) {
  const color = COLORS[resource.type as keyof typeof COLORS] || COLORS.default;

  const renderResource = () => {
    const { width, height } = resource.dimensions;
    
    return (
      <Group>
        <Rect
          x={0}
          y={0}
          width={width * 10} // Convert mm to pixels
          height={height * 10}
          fill={color}
          stroke="#000000"
          strokeWidth={1}
          cornerRadius={2}
        />
        <Text
          x={5}
          y={5}
          text={resource.name}
          fontSize={12}
          fill="#FFFFFF"
        />
        
        {/* Render contents (wells, tips, etc.) */}
        {resource.contents && Object.entries(resource.contents).map(([wellId, content]) => {
          const [row, col] = wellId.match(/([A-Z])(\d+)/)?.slice(1) || [];
          if (!row || !col) return null;
          
          const wellSize = 20;
          const wellX = (parseInt(col) - 1) * (wellSize + 5);
          const wellY = (row.charCodeAt(0) - 65) * (wellSize + 5);
          
          return (
            <Group key={wellId} x={wellX + 10} y={wellY + 30}>
              <Rect
                width={wellSize}
                height={wellSize}
                fill={content.liquid_id ? '#4299E1' : '#E2E8F0'}
                stroke="#000000"
                strokeWidth={1}
                cornerRadius={content.tip_loaded ? 0 : wellSize / 2}
              />
              {content.volume > 0 && (
                <Text
                  x={0}
                  y={wellSize + 2}
                  text={`${content.volume}µL`}
                  fontSize={10}
                  fill="#000000"
                />
              )}
            </Group>
          );
        })}
        
        {/* Render child resources */}
        {resource.children?.map((child, index) => (
          <ResourceComponent
            key={child.id}
            resource={child}
            x={child.position.x * 10}
            y={child.position.y * 10}
          />
        ))}
      </Group>
    );
  };

  return (
    <Group x={x} y={y}>
      {renderResource()}
    </Group>
  );
}
