import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRateLimiter } from "../src/lib/rateLimit";

function resolveClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]!.trim() || "unknown";
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0]!.trim() || "unknown";
  }
  return req.socket?.remoteAddress || "unknown";
}

export async function enforceRateLimit(
  req: VercelRequest,
  res: VercelResponse,
  key?: string
): Promise<boolean> {
  try {
    const limiter = await getRateLimiter();
    const ip = resolveClientIp(req);
    const routeKey = key ?? req.url?.split("?")[0] ?? "unknown";
    const { success, reset, remaining } = await limiter.limit(`${ip}:${routeKey}`);

    if (!success) {
      const retry = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
      res.setHeader("Retry-After", String(retry));
      if (remaining !== undefined) {
        res.setHeader("X-RateLimit-Remaining", String(remaining));
      }
      res.status(429).json({ error: "rate_limited", retry_after: retry });
      return false;
    }

    if (remaining !== undefined) {
      res.setHeader("X-RateLimit-Remaining", String(remaining));
    }
    return true;
  } catch (err) {
    console.error("[RateLimit] enforcement failed", err);
    return true; // fail-open
  }
}
