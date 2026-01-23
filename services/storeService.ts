
import { Outfit as OutfitType } from '../types';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

/**
 * Access the global Supabase client from the CDN script.
 * We cast to any to allow access to the window.supabase object.
 */
const getSupabaseClient = () => {
  const globalSupabase = (window as any).supabase;
  if (globalSupabase && supabaseUrl && supabaseKey) {
    return globalSupabase.createClient(supabaseUrl, supabaseKey);
  }
  return null;
};

export const supabase = getSupabaseClient();

if (!supabase) {
  console.error(
    "Supabase configuration or CDN script missing. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
    "are added to your environment variables and the CDN script is loaded."
  );
}

export const storeService = {
  getOutfits: async (): Promise<OutfitType[]> => {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
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
    if (!supabase) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    try {
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
    } catch (e) {
      console.error("Upload failed:", e);
      return null;
    }
  },

  addOutfit: async (outfit: Omit<OutfitType, 'id'>): Promise<OutfitType | null> => {
    if (!supabase) return null;

    try {
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
    } catch (e) {
      console.error("Insert failed:", e);
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
    if (!supabase) return null;

    try {
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
    } catch (e) {
      console.error("Update failed:", e);
      return null;
    }
  }
};
