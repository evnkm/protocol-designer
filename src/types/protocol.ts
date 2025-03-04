import { DeckResource } from "../components/lab-visualization/types";

export type LiquidId = string;

export interface BaseStep {
  id: string;
  type: string;
  description: string;
  deckState: DeckResource;
}

export interface TransferStep extends BaseStep {
  type: "transfer";
  source: {
    labwareId: string;
    wellId: string;
    volume: number;
    liquidId: LiquidId;
  };
  destination: {
    labwareId: string;
    wellId: string;
  };
  pyLabCode: string; // The actual PyLabRobot code for this step
}

export interface LoadTipsStep extends BaseStep {
  type: "load_tips";
  tipRackId: string;
  wellIds: string[];
  pyLabCode: string;
}

export interface DropTipsStep extends BaseStep {
  type: "drop_tips";
  tipRackId: string;
  wellIds: string[];
  pyLabCode: string;
}

export interface MixStep extends BaseStep {
  type: "mix";
  labwareId: string;
  wellId: string;
  volume: number;
  repetitions: number;
  pyLabCode: string;
}

// Union type of all possible steps
export type ProtocolStep = TransferStep | LoadTipsStep | DropTipsStep | MixStep;

// Helper function to generate PyLabRobot code for a step
export const generatePyLabCode = (step: ProtocolStep): string => {
  switch (step.type) {
    case "transfer":
      return `# Transfer ${step.source.volume}µL from ${step.source.labwareId}:${step.source.wellId} to ${step.destination.labwareId}:${step.destination.wellId}
pipette.aspirate(${step.source.volume}, ${step.source.labwareId}.get_well("${step.source.wellId}"))
pipette.dispense(${step.source.volume}, ${step.destination.labwareId}.get_well("${step.destination.wellId}"))`;

    case "load_tips":
      return `# Load tips from ${step.tipRackId}
pipette.pick_up_tip(${step.tipRackId}.get_well("${step.wellIds[0]}"))`;

    case "drop_tips":
      return `# Drop tips to ${step.tipRackId}
pipette.drop_tip(${step.tipRackId}.get_well("${step.wellIds[0]}"))`;

    case "mix":
      return `# Mix ${step.volume}µL ${step.repetitions} times in ${step.labwareId}:${step.wellId}
pipette.mix(${step.repetitions}, ${step.volume}, ${step.labwareId}.get_well("${step.wellId}"))`;

    default:
      return "# Unknown step type";
  }
};
