"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepSettingsProps {
  stepType: string;
}

export default function StepSettings({ stepType }: StepSettingsProps) {
  if (stepType !== "transfer") return null;

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Pipette</Label>
          <div className="bg-secondary p-2 rounded-md mt-1">
            P300 8-Channel GEN2
          </div>
        </div>

        <div>
          <Label>Tiprack</Label>
          <div className="bg-secondary p-2 rounded-md mt-1">
            Opentrons OT-2 96 Tip Rack 300 µL
          </div>
        </div>

        <div>
          <Label>Source labware</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Source columns</Label>
          <Input placeholder="Choose wells" />
        </div>

        <div>
          <Label>Destination labware</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Destination columns</Label>
          <Input placeholder="Choose wells" />
        </div>

        <div>
          <Label>Volume per well</Label>
          <Input type="number" placeholder="µL" />
        </div>

        <div>
          <Label>Pipette path</Label>
          <div className="grid grid-cols-1 gap-2 mt-1">
            <Button>Single path</Button>
            <Button variant="secondary">Consolidate path</Button>
            <Button variant="secondary">Distribute path</Button>
          </div>
        </div>
      </div>

      <Button className="w-full">Continue</Button>
    </div>
  );
}
