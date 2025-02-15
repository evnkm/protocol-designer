"use client";

import { useRef } from "react";
import type { Labware } from "@/store/protocolStore";

interface LabwareCanvasProps {
  labware: Labware;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (id: string) => void;
  width: number;
  height: number;
}

const WELL_PLATE_CONFIG = {
  rows: 8,
  cols: 12,
  wellSize: 20,
  spacing: 5,
};

const RESERVOIR_CONFIG = {
  wells: 12,
  wellWidth: 25,
  wellHeight: 80,
  spacing: 5,
};

const TIPRACK_CONFIG = {
  rows: 8,
  cols: 12,
  tipSize: 15,
  spacing: 5,
};

export default function LabwareCanvas({
  labware,
  isSelected,
  isHighlighted,
  onSelect,
  width,
  height,
}: LabwareCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const renderWellPlate = () => {
    const wells = [];
    const startX =
      (width -
        WELL_PLATE_CONFIG.cols *
          (WELL_PLATE_CONFIG.wellSize + WELL_PLATE_CONFIG.spacing)) /
      2;
    const startY =
      (height -
        WELL_PLATE_CONFIG.rows *
          (WELL_PLATE_CONFIG.wellSize + WELL_PLATE_CONFIG.spacing)) /
      2;

    for (let row = 0; row < WELL_PLATE_CONFIG.rows; row++) {
      for (let col = 0; col < WELL_PLATE_CONFIG.cols; col++) {
        const x =
          startX +
          col * (WELL_PLATE_CONFIG.wellSize + WELL_PLATE_CONFIG.spacing);
        const y =
          startY +
          row * (WELL_PLATE_CONFIG.wellSize + WELL_PLATE_CONFIG.spacing);

        wells.push(
          <circle
            key={`well-${row}-${col}`}
            cx={x + WELL_PLATE_CONFIG.wellSize / 2}
            cy={y + WELL_PLATE_CONFIG.wellSize / 2}
            r={WELL_PLATE_CONFIG.wellSize / 2}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth={1}
          />
        );
      }
    }
    return wells;
  };

  const renderReservoir = () => {
    const wells = [];
    const startX =
      (width -
        RESERVOIR_CONFIG.wells *
          (RESERVOIR_CONFIG.wellWidth + RESERVOIR_CONFIG.spacing)) /
      2;
    const startY = (height - RESERVOIR_CONFIG.wellHeight) / 2;

    for (let i = 0; i < RESERVOIR_CONFIG.wells; i++) {
      const x =
        startX + i * (RESERVOIR_CONFIG.wellWidth + RESERVOIR_CONFIG.spacing);
      wells.push(
        <rect
          key={`reservoir-${i}`}
          x={x}
          y={startY}
          width={RESERVOIR_CONFIG.wellWidth}
          height={RESERVOIR_CONFIG.wellHeight}
          fill="#f3f4f6"
          stroke="#d1d5db"
          strokeWidth={1}
        />
      );
    }
    return wells;
  };

  const renderTiprack = () => {
    const tips = [];
    const startX =
      (width -
        TIPRACK_CONFIG.cols *
          (TIPRACK_CONFIG.tipSize + TIPRACK_CONFIG.spacing)) /
      2;
    const startY =
      (height -
        TIPRACK_CONFIG.rows *
          (TIPRACK_CONFIG.tipSize + TIPRACK_CONFIG.spacing)) /
      2;

    for (let row = 0; row < TIPRACK_CONFIG.rows; row++) {
      for (let col = 0; col < TIPRACK_CONFIG.cols; col++) {
        const x =
          startX + col * (TIPRACK_CONFIG.tipSize + TIPRACK_CONFIG.spacing);
        const y =
          startY + row * (TIPRACK_CONFIG.tipSize + TIPRACK_CONFIG.spacing);

        tips.push(
          <g key={`tip-${row}-${col}`}>
            <rect
              x={x + TIPRACK_CONFIG.tipSize / 4}
              y={y}
              width={TIPRACK_CONFIG.tipSize / 2}
              height={TIPRACK_CONFIG.tipSize}
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth={1}
            />
            <rect
              x={x}
              y={y + TIPRACK_CONFIG.tipSize - 4}
              width={TIPRACK_CONFIG.tipSize}
              height={4}
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth={1}
            />
          </g>
        );
      }
    }
    return tips;
  };

  return (
    <div
      className="relative"
      style={{ width, height }}
      onClick={() => onSelect(labware.id)}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="absolute inset-0"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={isHighlighted ? "#eff6ff" : "white"}
          stroke={isSelected ? "#2563eb" : "#e5e7eb"}
          strokeWidth={2}
        />

        {/* Labware content */}
        {labware.type === "plate" && renderWellPlate()}
        {labware.type === "reservoir" && renderReservoir()}
        {labware.type === "tiprack" && renderTiprack()}

        {/* Label */}
        <text x={10} y={25} fontSize={14} fontFamily="Inter" fill="#374151">
          {labware.name}
        </text>
      </svg>
    </div>
  );
}
