import { createClient } from "@supabase/supabase-js";
import type { VercelRequest } from "@vercel/node";

type AuthResult =
  | {
      token: string;
      userId: string;
    }
  | null;

function getServerSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing Supabase public environment variables");
  }
  return { url, anon };
}

export async function getUserFromAuthHeader(req: VercelRequest): Promise<AuthResult> {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  const { url, anon } = getServerSupabaseEnv();
  const client = createClient(url, anon);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return { token, userId: data.user.id };
}


