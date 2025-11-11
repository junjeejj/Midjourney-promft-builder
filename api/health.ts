import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const ok =
    !!process.env.SUPABASE_URL &&
    !!process.env.SUPABASE_ANON_KEY &&
    !!process.env.SUPABASE_SERVICE_ROLE &&
    !!process.env.STRIPE_SECRET_KEY;

  const version = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null;

  res.setHeader("Cache-Control", "no-store");

  return res.status(ok ? 200 : 500).json({
    ok,
    version,
    ts: new Date().toISOString(),
  });
}


