
import { Outfit as OutfitType } from '../types';
import { supabase } from './supabaseClient';

// Helper to map DB row (snake_case) to App Type (camelCase)
const mapFromDb = (row: any): OutfitType => ({
  id: row.id,
  name: row.name,
  price: row.price,
  imageUrl: row.image_url || row.imageUrl,
  pairedScentId: row.paired_scent_id || row.pairedScentId,
  sizes: row.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
  outOfStockSizes: row.out_of_stock_sizes || [],
});

// Helper to map App Type to DB row
const mapToDb = (outfit: Omit<OutfitType, 'id'>) => ({
  name: outfit.name,
  price: outfit.price,
  image_url: outfit.imageUrl,
  paired_scent_id: outfit.pairedScentId,
  sizes: outfit.sizes,
  out_of_stock_sizes: outfit.outOfStockSizes,
});

export const storeService = {
  getOutfits: async (): Promise<OutfitType[]> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Select Error:", error.message);
        return [];
      }
      return (data || []).map(mapFromDb);
    } catch (e) {
      console.error("getOutfits failed:", e);
      return [];
    }
  },

  uploadImage: async (file: File): Promise<string | null> => {
    if (!supabase) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage Upload Error:", uploadError.message);
        return null;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        console.error("Failed to generate Public URL");
        return null;
      }

      return data.publicUrl;
    } catch (e) {
      console.error("uploadImage failed:", e);
      return null;
    }
  },

  addOutfit: async (outfit: Omit<OutfitType, 'id'>): Promise<OutfitType | null> => {
    if (!supabase) return null;
    try {
      const dbRow = mapToDb(outfit);
      const { data, error } = await supabase
        .from('products')
        .insert([dbRow])
        .select()
        .single();

      if (error) {
        console.error("Database Insert Error:", error.message);
        return null;
      }
      return mapFromDb(data);
    } catch (e) {
      console.error("addOutfit failed:", e);
      return null;
    }
  },

  deleteOutfit: async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .match({ id });

      if (error) {
        console.error("Database Delete Error:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error("deleteOutfit failed:", e);
      return false;
    }
  },

  updateOutfit: async (id: string, updates: Partial<OutfitType>): Promise<OutfitType | null> => {
    if (!supabase) return null;
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.price) dbUpdates.price = updates.price;
      if (updates.imageUrl) dbUpdates.image_url = updates.imageUrl;
      if (updates.pairedScentId) dbUpdates.paired_scent_id = updates.pairedScentId;
      if (updates.sizes) dbUpdates.sizes = updates.sizes;
      if (updates.outOfStockSizes) dbUpdates.out_of_stock_sizes = updates.outOfStockSizes;

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .match({ id })
        .select()
        .single();

      if (error) {
        console.error("Database Update Error:", error.message);
        return null;
      }
      return mapFromDb(data);
    } catch (e) {
      console.error("updateOutfit failed:", e);
      return null;
    }
  }
};
