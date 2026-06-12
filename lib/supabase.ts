import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase chỉ dùng phía SERVER (data.ts, actions.ts) → ưu tiên biến KHÔNG có
// tiền tố NEXT_PUBLIC để đọc lúc RUNTIME (không bị Next "nướng cứng" vào bundle khi build).
// Vẫn nhận biến NEXT_PUBLIC_* cũ để tương thích ngược (dev/local).
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** true khi đã cấu hình Supabase; false → data layer dùng fixtures. */
export const supabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, anonKey!)
  : null;
