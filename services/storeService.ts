
import { createClient } from '@supabase/supabase-js';
import { Outfit as OutfitType } from '../types';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const storeService = {
  getOutfits: async (): Promise<OutfitType[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    return data as OutfitType[];
  },

  uploadImage: async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  addOutfit: async (outfit: Omit<OutfitType, 'id'>): Promise<OutfitType | null> => {
    const { data, error } = await supabase
      .from('products')
      .insert([outfit])
      .select()
      .single();

    if (error) {
      console.error("Error adding product:", error);
      return null;
    }
    return data as OutfitType;
  },

  deleteOutfit: async (id: string): Promise<boolean> => {
    // Note: In a real app, you might also want to delete the image from storage here.
    const { error } = await supabase
      .from('products')
      .delete()
      .match({ id });

    if (error) {
      console.error("Error deleting product:", error);
      return false;
    }
    return true;
  },

  updateOutfit: async (id: string, updates: Partial<OutfitType>): Promise<OutfitType | null> => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .match({ id })
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return null;
    }
    return data as OutfitType;
  }
};
