import {
  Move,
  Droplet,
  RefreshCw,
  Pause,
  ThermometerSun,
  Magnet,
  Thermometer,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddStepMenuProps {
  onSelect: (stepType: string) => void;
  onClose: () => void;
}

// create and export a mapping from the step to the icon
export const stepToIcon: Record<string, React.ElementType> = {
  Move: Move,
  Transfer: Droplet,
  Mix: RefreshCw,
  Pause: Pause,
  "Heater-shaker": ThermometerSun,
  Magnet: Magnet,
  Temperature: Thermometer,
  Thermocycler: Activity,
};

export default function AddStepMenu({ onSelect, onClose }: AddStepMenuProps) {
  const steps = [
    { icon: Move, label: "Move" },
    { icon: Droplet, label: "Transfer" },
    { icon: RefreshCw, label: "Mix" },
    { icon: Pause, label: "Pause" },
    { icon: ThermometerSun, label: "Heater-shaker" },
    { icon: Magnet, label: "Magnet" },
    { icon: Thermometer, label: "Temperature" },
    { icon: Activity, label: "Thermocycler" },
  ];

  return (
    <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg border p-2 w-48">
      {steps.map((step) => (
        <Button
          key={step.label}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onSelect(step.label)}
        >
          <step.icon className="mr-2 h-4 w-4" />
          {step.label}
        </Button>
      ))}
    </div>
  );
}
