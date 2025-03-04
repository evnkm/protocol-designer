export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ResourceBase {
  id: string;
  name: string;
  type: string;
  position: Position;
  dimensions: Dimensions;
}

export interface WellContent {
  volume: number;
  liquid_id?: string;
  tip_loaded?: boolean;
}

export interface Labware extends ResourceBase {
  type: "plate" | "tip_rack" | "reservoir";
  wells?: Well[];
  capacity?: number;
  contents?: {
    [wellId: string]: WellContent;
  };
}

export interface Well {
  id: string;
  position: Position;
  maxVolume: number;
  currentVolume: number;
  liquidId?: string;
  hasTip?: boolean;
}

export interface DeckResource extends ResourceBase {
  type: "deck";
  children: Labware[];
}

export type LiquidHandlingOperation = 
  | { type: "transfer"; source: WellReference; destination: WellReference; volume: number }
  | { type: "mix"; labwareId: string; wellId: string; volume: number }
  | { type: "load_tips"; tipRackId: string; wellIds: string[] }
  | { type: "drop_tips"; tipRackId: string; wellIds: string[] };

export interface WellReference {
  labwareId: string;
  wellId: string;
  liquidId?: string;
}
