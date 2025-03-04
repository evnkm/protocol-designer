import React from "react";
import { Labware as LabwareType } from "../types";
import { Box, Text } from "@react-three/drei";

interface LabwareProps {
  data: LabwareType;
  selected?: boolean;
  onClick?: () => void;
}

export const Labware: React.FC<LabwareProps> = ({
  data,
  selected,
  onClick,
}) => {
  const { position, dimensions, type, name } = data;

  const getColor = () => {
    switch (type) {
      case "plate":
        return "lightblue";
      case "tip_rack":
        return "lightgray";
      case "reservoir":
        return "lightgreen";
      default:
        return "white";
    }
  };

  return (
    <group position={[position.x, position.y, position.z]} onClick={onClick}>
      <Box args={[dimensions.width, dimensions.height, dimensions.depth]}>
        <meshStandardMaterial
          color={getColor()}
          opacity={0.8}
          transparent
          wireframe={selected}
        />
      </Box>

      <Text
        position={[0, dimensions.height / 2 + 0.1, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="bottom"
      >
        {name}
      </Text>

      {data.wells?.map((well, index) => (
        <group
          key={well.id}
          position={[well.position.x, well.position.y, well.position.z]}
        >
          <Box args={[0.1, 0.1, 0.1]}>
            <meshStandardMaterial
              color={well.liquidId ? "#3b82f6" : "gray"}
              opacity={well.currentVolume / well.maxVolume}
              transparent
            />
          </Box>
        </group>
      ))}
    </group>
  );
};
