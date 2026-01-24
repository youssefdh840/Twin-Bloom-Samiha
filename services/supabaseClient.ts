
import { createClient } from "@supabase/supabase-js";

// استدعاء المتغيرات من البيئة المحيطة (Vercel/Vite)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * إنشاء عميل Supabase. 
 * نقوم بالتحقق من وجود القيم لمنع أخطاء التشغيل.
 */
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  console.warn(
    "Supabase configuration is missing. Ensure NEXT_PUBLIC_SUPABASE_URL and " +
    "NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables."
  );
}
