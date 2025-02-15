"use client";

import { useEffect, useState } from "react";
import { useProtocolStore } from "@/store/protocolStore";
import type { Labware } from "@/store/protocolStore";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import LabwareCanvas from "./labware/LabwareCanvas";
import ModuleCanvas from "./labware/ModuleCanvas";
import LiquidTransfer from "./animations/LiquidTransfer";

interface DeckDesignerProps {
  currentTab: "setup" | "deck" | "protocol";
  activeStep: string | null;
}

const GRID_SIZE = { rows: 8, cols: 12 };
const CELL_SIZE = 100;

interface GridCellProps {
  x: number;
  y: number;
  children?: React.ReactNode;
}

function GridCell({ x, y, children }: GridCellProps) {
  const { setNodeRef } = useDroppable({
    id: `cell-${x}-${y}`,
    data: { x, y },
  });

  return (
    <div
      ref={setNodeRef}
      className="border border-gray-400"
      style={{
        gridColumn: `${x + 1} / span 2`,
        gridRow: `${y + 1} / span 2`,
        width: CELL_SIZE * 2,
        height: CELL_SIZE * 2,
      }}
    >
      {children}
    </div>
  );
}

interface DraggableLabwareProps {
  labware: Labware;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (id: string) => void;
}

function DraggableLabware({
  labware,
  isSelected,
  isHighlighted,
  onSelect,
}: DraggableLabwareProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: labware.id,
    data: labware,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="absolute"
    >
      {labware.type === "module" ? (
        <ModuleCanvas
          labware={labware}
          isSelected={isSelected}
          isHighlighted={isHighlighted}
          onSelect={onSelect}
          width={CELL_SIZE * 2}
          height={CELL_SIZE * 2}
        />
      ) : (
        <LabwareCanvas
          labware={labware}
          isSelected={isSelected}
          isHighlighted={isHighlighted}
          onSelect={onSelect}
          width={CELL_SIZE * 2}
          height={CELL_SIZE * 2}
        />
      )}
    </div>
  );
}

interface CellData {
  x: number;
  y: number;
}

export default function DeckDesigner({
  currentTab,
  activeStep,
}: DeckDesignerProps) {
  const { labware, steps, selectedLabware, setSelectedLabware, updateLabware } =
    useProtocolStore();
  const [highlightedSlots, setHighlightedSlots] = useState<string[]>([]);
  const [activeTransfer, setActiveTransfer] = useState<{
    sourceId: string;
    destinationId: string;
    volume: number;
    liquidColor: string;
  } | null>(null);

  useEffect(() => {
    if (activeStep && currentTab === "protocol") {
      const step = steps.find((s) => s.id === activeStep);
      if (step && step.type === "transfer") {
        const slots = [];
        if (step.sourceLabware) slots.push(step.sourceLabware);
        if (step.destinationLabware) slots.push(step.destinationLabware);
        setHighlightedSlots(slots);

        if (step.sourceLabware && step.destinationLabware && step.volume) {
          setActiveTransfer({
            sourceId: step.sourceLabware,
            destinationId: step.destinationLabware,
            volume: step.volume,
            liquidColor: "#3b82f6",
          });
        }
      }
    } else {
      setHighlightedSlots([]);
      setActiveTransfer(null);
    }
  }, [activeStep, currentTab, steps]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.data.current) {
      const cellData = (over.data.current as { data: CellData }).data;
      const labwareData = active.data.current as Labware;

      updateLabware(labwareData.id, {
        ...labwareData,
        position: { x: cellData.x, y: cellData.y },
      });
    }
  };

  return (
    <div className="h-full p-8">
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="deck-grid relative bg-white rounded-lg shadow-sm border border-gray-200 h-full p-4"
          style={{
            width: CELL_SIZE * GRID_SIZE.cols,
            height: CELL_SIZE * GRID_SIZE.rows,
          }}
        >
          {/* Grid cells */}
          {Array.from({ length: (GRID_SIZE.rows * GRID_SIZE.cols) / 4 }).map(
            (_, i) => {
              const x = (i % (GRID_SIZE.cols / 2)) * 2;
              const y = Math.floor(i / (GRID_SIZE.cols / 2)) * 2;
              return <GridCell key={`cell-${x}-${y}`} x={x} y={y} />;
            }
          )}

          {/* Labware */}
          {labware.map((item) => (
            <DraggableLabware
              key={item.id}
              labware={item}
              isSelected={selectedLabware === item.id}
              isHighlighted={highlightedSlots.includes(item.id)}
              onSelect={setSelectedLabware}
            />
          ))}

          {/* Liquid transfer animation */}
          {activeTransfer && (
            <LiquidTransfer
              {...activeTransfer}
              onComplete={() => setActiveTransfer(null)}
            />
          )}
        </div>
      </DndContext>
    </div>
  );
}
