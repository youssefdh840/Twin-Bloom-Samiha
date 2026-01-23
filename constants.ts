
import { Fragrance, Outfit } from './types';

export const FRAGRANCES: Fragrance[] = [
  {
    id: 'f1',
    name: 'Oudh Celeste',
    notes: ['Agarwood', 'Saffron', 'Amber'],
    description: 'Deep, smoky, and regally warm.',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=500',
    price: '$210'
  },
  {
    id: 'f2',
    name: 'Bergamot Bloom',
    notes: ['Citrus', 'Sea Salt', 'White Musk'],
    description: 'Fresh, airy, and effortlessly sophisticated.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=500',
    price: '$185'
  },
  {
    id: 'f3',
    name: 'Midnight Rose',
    notes: ['Black Rose', 'Pink Pepper', 'Vanilla'],
    description: 'Sensual, dark, and lingering.',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=500',
    price: '$195'
  }
];

export const OUTFITS: Outfit[] = [
  {
    id: 'o1',
    name: 'The Midnight Gala Set',
    pairedScentId: 'f1',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=500',
    price: '$1,200'
  },
  {
    id: 'o2',
    name: 'Riviera Linen Ensemble',
    pairedScentId: 'f2',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=500',
    price: '$850'
  },
  {
    id: 'o3',
    name: 'Silk Silhouette Evening',
    pairedScentId: 'f3',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=500',
    price: '$1,550'
  }
];
