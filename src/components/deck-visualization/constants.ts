// Canvas and stage settings
export const CANVAS_PADDING = 50;
export const SCALE_FACTOR = 0.8;

// Hamilton STAR deck dimensions (in mm)
export const DIMENSIONS = {
  HAMILTON_DECK_WIDTH: 100 + 30 * 22.5, // Base width + (num rails * rail spacing)
  HAMILTON_DECK_HEIGHT: 653.5,
  HAMILTON_RAIL_WIDTH: 22.5,
  HAMILTON_RAIL_HEIGHT: 497,
  HAMILTON_RAIL_SPACING: 30,
  
  // OT-2 deck dimensions
  OT_DECK_WIDTH: 418, // 3 positions * 132.5mm + padding
  OT_DECK_HEIGHT: 390, // 3 positions * 115mm + padding
  OT_SITE_WIDTH: 127.76,
  OT_SITE_HEIGHT: 85.48,
  
  CANVAS_PADDING: 50,
  WELL_SIZE: 20,
  WELL_SPACING: 5,
  TIP_HEIGHT: 40,
};

// Colors
export const COLORS = {
  deck: '#5B6D8F',
  hamiltonDeck: '#4A5568',
  otDeck: '#4A5568',
  tipRack: '#718096',
  plate: '#4A5568',
  trough: '#2D3748',
  default: '#718096',
  selected: '#48BB78',
  
  // Liquid colors
  liquidDefault: '#3182CE',
  liquidHighlight: '#48BB78'
};

// OT-2 deck positions
export const OT_DECK_POSITIONS = [
  { x: 0.0, y: 0.0 },
  { x: 132.5, y: 0.0 },
  { x: 265.0, y: 0.0 },
  { x: 0.0, y: 115.0 },
  { x: 132.5, y: 115.0 },
  { x: 265.0, y: 115.0 },
  { x: 0.0, y: 230.0 },
  { x: 132.5, y: 230.0 },
  { x: 265.0, y: 230.0 },
  { x: 0.0, y: 345.0 },
  { x: 132.5, y: 345.0 },
  { x: 265.0, y: 345.0 }
];
