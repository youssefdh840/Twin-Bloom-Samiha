
export interface Fragrance {
  id: string;
  name: string;
  notes: string[];
  description: string;
  imageUrl: string;
  price: string;
}

export interface Outfit {
  id: string;
  name: string;
  pairedScentId: string;
  imageUrl: string;
  price: string;
  sizes: string[];
  outOfStockSizes: string[];
  showSizes: boolean;
}

export enum Mood {
  CLASSIC = 'Classic',
  CALM = 'Calm',
  BOLD = 'Bold',
  ROMANTIC = 'Romantic',
  MYSTERIOUS = 'Mysterious'
}

export interface Recommendation {
  fragranceName: string;
  reason: string;
  vibe: string;
}

export type View = 'public' | 'admin';
