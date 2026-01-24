
import { Outfit as OutfitType } from '../types';
import { getSupabase } from './supabaseClient';

export const storeService = {
  getOutfits: async (): Promise<OutfitType[]> => {
    const client = getSupabase();
    if (!client) {
      console.warn("Attempted to fetch outfits but Supabase client is not initialized.");
      return [];
    }
    
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }
      return data as OutfitType[];
    } catch (e) {
      console.error("Supabase request failed:", e);
      return [];
    }
  },

  uploadImage: async (file: File): Promise<string | null> => {
    const client = getSupabase();
    if (!client) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    try {
      const { error: uploadError } = await client.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return null;
      }

      const { data } = client.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (e) {
      console.error("Upload failed:", e);
      return null;
    }
  },

  addOutfit: async (outfit: Omit<OutfitType, 'id'>): Promise<OutfitType | null> => {
    const client = getSupabase();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('products')
        .insert([outfit])
        .select()
        .single();

      if (error) {
        console.error("Error adding product:", error);
        return null;
      }
      return data as OutfitType;
    } catch (e) {
      console.error("Insert failed:", e);
      return null;
    }
  },

  deleteOutfit: async (id: string): Promise<boolean> => {
    const client = getSupabase();
    if (!client) return false;

    try {
      const { error } = await client
        .from('products')
        .delete()
        .match({ id });

      if (error) {
        console.error("Error deleting product:", error);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Delete failed:", e);
      return false;
    }
  },

  updateOutfit: async (id: string, updates: Partial<OutfitType>): Promise<OutfitType | null> => {
    const client = getSupabase();
    if (!client) return null;

    try {
      const { data, error } = await client
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
    } catch (e) {
      console.error("Update failed:", e);
      return null;
    }
  }
};
