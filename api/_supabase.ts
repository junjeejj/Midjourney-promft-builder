import { createClient } from "@supabase/supabase-js";

export function adminSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !service) throw new Error("Missing Supabase envs");
  return createClient(url, service, {
    auth: { persistSession: false },
  });
}


