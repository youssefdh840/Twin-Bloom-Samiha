
/**
 * Supabase Client Initialization
 * Uses the global 'supabase' object provided by the CDN script in index.html.
 */

/**
 * Dynamic getter for the Supabase client.
 * This ensures that environment variables and the global window.supabase object
 * are checked at the time of use, which is more resilient to load-order issues.
 */
export const getSupabase = () => {
  const globalSupabase = (window as any).supabase;
  
  // Access environment variables using the process.env pattern standard to this environment.
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (globalSupabase && url && key) {
    try {
      return globalSupabase.createClient(url, key);
    } catch (e) {
      console.error("Failed to initialize Supabase client:", e);
      return null;
    }
  }
  
  return null;
};

// Exporting a static version for components that expect a constant,
// although using getSupabase() directly is preferred for resilience.
export const supabase = getSupabase();
