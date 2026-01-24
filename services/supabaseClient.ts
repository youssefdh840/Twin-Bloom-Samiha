
/**
 * Supabase Client Initialization
 * Uses the global 'supabase' object provided by the CDN script in index.html.
 */

/**
 * Dynamic getter for the Supabase client.
 * This ensures that environment variables and the global window.supabase object
 * are checked at the time of use, which is more resilient to load-order issues
 * and allows the app to recover if configuration becomes available late.
 */
export const getSupabase = () => {
  const globalSupabase = (window as any).supabase;
  
  // Access environment variables using the new NEXT_PUBLIC prefix for Vercel compatibility.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (globalSupabase && url && key) {
    try {
      // Create a singleton instance to avoid recreating the client on every call
      if (!(window as any)._supabaseInstance) {
        (window as any)._supabaseInstance = globalSupabase.createClient(url, key);
      }
      return (window as any)._supabaseInstance;
    } catch (e) {
      console.error("Failed to initialize Supabase client:", e);
      return null;
    }
  }
  
  if (!globalSupabase) {
    console.warn("Supabase CDN script (window.supabase) is not yet available.");
  }
  if (!url || !key) {
    console.warn("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from environment.");
  }

  return null;
};

// Exporting for components that might still use a static reference, 
// though getSupabase() is the preferred way to access the client.
export const supabase = getSupabase();
