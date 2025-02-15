"use client";

import { useRef } from "react";
import type { Labware } from "@/store/protocolStore";

interface ModuleCanvasProps {
  labware: Labware;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (id: string) => void;
  width: number;
  height: number;
}

const MODULE_COLORS = {
  "heater-shaker": {
    primary: "#ef4444",
    secondary: "#fee2e2",
  },
  magnetic: {
    primary: "#3b82f6",
    secondary: "#dbeafe",
  },
  temperature: {
    primary: "#10b981",
    secondary: "#d1fae5",
  },
} as const;

export default function ModuleCanvas({
  labware,
  isSelected,
  isHighlighted,
  onSelect,
  width,
  height,
}: ModuleCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const renderHeaterShaker = () => (
    <g>
      <rect
        x={width * 0.1}
        y={height * 0.2}
        width={width * 0.8}
        height={height * 0.6}
        fill={MODULE_COLORS["heater-shaker"].secondary}
        stroke={MODULE_COLORS["heater-shaker"].primary}
        strokeWidth={2}
      />
      {/* Heating coil representation */}
      {Array.from({ length: 3 }).map((_, i) => (
        <path
          key={`coil-${i}`}
          d={`M ${width * 0.2} ${height * (0.3 + i * 0.15)} L ${width * 0.8} ${
            height * (0.3 + i * 0.15)
          }`}
          stroke={MODULE_COLORS["heater-shaker"].primary}
          strokeWidth={1}
          strokeDasharray="5,5"
        />
      ))}
    </g>
  );

  const renderMagnetic = () => (
    <g>
      <rect
        x={width * 0.1}
        y={height * 0.2}
        width={width * 0.8}
        height={height * 0.6}
        fill={MODULE_COLORS["magnetic"].secondary}
        stroke={MODULE_COLORS["magnetic"].primary}
        strokeWidth={2}
      />
      {/* Magnetic field representation */}
      {Array.from({ length: 4 }).map((_, i) => (
        <rect
          key={`magnet-${i}`}
          x={width * (0.2 + i * 0.2)}
          y={height * 0.3}
          width={width * 0.1}
          height={height * 0.4}
          fill={MODULE_COLORS["magnetic"].primary}
        />
      ))}
    </g>
  );

  const renderTemperature = () => (
    <g>
      <rect
        x={width * 0.1}
        y={height * 0.2}
        width={width * 0.8}
        height={height * 0.6}
        fill={MODULE_COLORS["temperature"].secondary}
        stroke={MODULE_COLORS["temperature"].primary}
        strokeWidth={2}
      />
      {/* Temperature indicator */}
      <g>
        <line
          x1={width * 0.3}
          y1={height * 0.3}
          x2={width * 0.3}
          y2={height * 0.7}
          stroke={MODULE_COLORS["temperature"].primary}
          strokeWidth={2}
        />
        <circle
          cx={width * 0.3}
          cy={height * 0.65}
          r={width * 0.04}
          fill={MODULE_COLORS["temperature"].primary}
        />
      </g>
    </g>
  );

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

        {/* Module content */}
        {labware.moduleType === "heater-shaker" && renderHeaterShaker()}
        {labware.moduleType === "magnetic" && renderMagnetic()}
        {labware.moduleType === "temperature" && renderTemperature()}

        {/* Label */}
        <text x={10} y={25} fontSize={14} fontFamily="Inter" fill="#374151">
          {`${labware.name} (${labware.moduleType})`}
        </text>
      </svg>
    </div>
  );
}
