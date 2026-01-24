
import { createClient } from "@supabase/supabase-js";

// استدعاء المتغيرات الجديدة التي تم ضبطها في Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * إنشاء عميل Supabase فقط إذا كانت المتغيرات متوفرة.
 * هذا يمنع ظهور خطأ "supabaseUrl is required" الذي رأيته سابقاً.
 */
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// طباعة تحذير في وحدة التحكم (Console) فقط للمطورين
if (!supabase) {
  console.warn(
    "Supabase configuration is missing. Ensure NEXT_PUBLIC_SUPABASE_URL and " +
    "NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your Vercel Environment Variables."
  );
}
