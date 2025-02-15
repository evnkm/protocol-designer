"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProtocolStore } from "@/store/protocolStore";

interface LiquidTransferProps {
  sourceId: string;
  destinationId: string;
  volume: number;
  liquidColor: string;
  onComplete: () => void;
}

interface Point {
  x: number;
  y: number;
}

export default function LiquidTransfer({
  sourceId,
  destinationId,
  volume,
  liquidColor,
  onComplete,
}: LiquidTransferProps) {
  const [droplets, setDroplets] = useState<Point[]>([]);
  const [path, setPath] = useState<Point[]>([]);
  const { labware } = useProtocolStore();

  useEffect(() => {
    const source = labware.find((l) => l.id === sourceId);
    const destination = labware.find((l) => l.id === destinationId);

    if (!source || !destination) return;

    // Calculate path points
    const startPoint = {
      x: source.position.x * 100 + 50,
      y: source.position.y * 100 + 50,
    };

    const endPoint = {
      x: destination.position.x * 100 + 50,
      y: destination.position.y * 100 + 50,
    };

    // Create a curved path
    const controlPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: Math.min(startPoint.y, endPoint.y) - 100,
    };

    // Generate path points
    const points: Point[] = [];
    for (let t = 0; t <= 1; t += 0.05) {
      const point = {
        x:
          Math.pow(1 - t, 2) * startPoint.x +
          2 * (1 - t) * t * controlPoint.x +
          Math.pow(t, 2) * endPoint.x,
        y:
          Math.pow(1 - t, 2) * startPoint.y +
          2 * (1 - t) * t * controlPoint.y +
          Math.pow(t, 2) * endPoint.y,
      };
      points.push(point);
    }

    setPath(points);

    // Animate droplets
    const numDroplets = Math.ceil(volume / 10); // One droplet per 10µL
    let currentDroplet = 0;

    const interval = setInterval(() => {
      if (currentDroplet >= numDroplets) {
        clearInterval(interval);
        onComplete();
        return;
      }

      setDroplets((prev) => [...prev, { ...startPoint }]);

      currentDroplet++;
    }, 200);

    return () => clearInterval(interval);
  }, [sourceId, destinationId, volume, labware, onComplete]);

  const pathD =
    path.length > 0
      ? `M ${path[0].x} ${path[0].y} ` +
        path
          .slice(1)
          .map((p) => `L ${p.x} ${p.y}`)
          .join(" ")
      : "";

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Path visualization (optional) */}
        <path
          d={pathD}
          stroke="rgba(59, 130, 246, 0.2)"
          strokeWidth={2}
          fill="none"
        />

        {/* Droplets */}
        {droplets.map((droplet, index) => (
          <motion.circle
            key={index}
            initial={{ cx: droplet.x, cy: droplet.y }}
            animate={{
              cx: path.map((p) => p.x),
              cy: path.map((p) => p.y),
            }}
            transition={{
              duration: 1,
              ease: "linear",
            }}
            r={4}
            fill={liquidColor}
            filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.2))"
          />
        ))}
      </svg>
    </div>
  );
}
