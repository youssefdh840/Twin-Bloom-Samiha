
// Use OUTFITS from constants for initialization
import { OUTFITS, FRAGRANCES } from '../constants';
import { Outfit as OutfitType } from '../types';

const STORAGE_KEY = 'elysian_luxe_outfits';

export const storeService = {
  getOutfits: (): OutfitType[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with default constants if empty
      const initial = [...OUTFITS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  saveOutfits: (outfits: OutfitType[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits));
    // In a real app with Supabase/Firebase, this would be:
    // await supabase.from('outfits').upsert(outfits)
  },

  addOutfit: (outfit: Omit<OutfitType, 'id'>) => {
    const outfits = storeService.getOutfits();
    const newOutfit = { ...outfit, id: Date.now().toString() };
    const updated = [newOutfit, ...outfits];
    storeService.saveOutfits(updated);
    return updated;
  },

  deleteOutfit: (id: string) => {
    const outfits = storeService.getOutfits();
    const updated = outfits.filter(o => o.id !== id);
    storeService.saveOutfits(updated);
    return updated;
  },

  updateOutfit: (id: string, updates: Partial<OutfitType>) => {
    const outfits = storeService.getOutfits();
    const updated = outfits.map(o => o.id === id ? { ...o, ...updates } : o);
    storeService.saveOutfits(updated);
    return updated;
  }
};
