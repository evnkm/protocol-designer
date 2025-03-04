export interface Location {
  x: number;
  y: number;
  z?: number;
}

export interface Dimensions {
  width: number;
  depth: number;
  height?: number;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  position: Location;
  dimensions: Dimensions;
  children: Resource[];
  state?: ResourceState;
}

export interface ResourceState {
  has_tip?: boolean;
  liquids?: Liquid[];
}

export interface Liquid {
  name: string;
  volume: number;
  color?: string;
}

export interface DeckResource extends Resource {
  type: 'HamiltonSTARDeck' | 'OTDeck';
  num_rails?: number;
}
