import React from "react";
import { ProtocolStep } from "../../types/protocol";

interface StepCodeProps {
  step: ProtocolStep;
}

export const StepCode: React.FC<StepCodeProps> = ({ step }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2">PyLabRobot Code</h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
        <code>{step.pyLabCode}</code>
      </pre>

      <div className="text-sm text-gray-600">
        <h4 className="font-medium mb-1">Step Details</h4>
        <dl className="grid grid-cols-2 gap-2">
          <dt>Type:</dt>
          <dd className="font-mono">{step.type}</dd>

          {step.type === "transfer" && (
            <>
              <dt>Source:</dt>
              <dd className="font-mono">
                {step.source.labwareId}:{step.source.wellId} (
                {step.source.volume}µL)
              </dd>
              <dt>Destination:</dt>
              <dd className="font-mono">
                {step.destination.labwareId}:{step.destination.wellId}
              </dd>
            </>
          )}

          {(step.type === "load_tips" || step.type === "drop_tips") && (
            <>
              <dt>Tip Rack:</dt>
              <dd className="font-mono">{step.tipRackId}</dd>
              <dt>Wells:</dt>
              <dd className="font-mono">{step.wellIds.join(", ")}</dd>
            </>
          )}

          {step.type === "mix" && (
            <>
              <dt>Location:</dt>
              <dd className="font-mono">
                {step.labwareId}:{step.wellId}
              </dd>
              <dt>Settings:</dt>
              <dd className="font-mono">
                {step.volume}µL × {step.repetitions} times
              </dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};
