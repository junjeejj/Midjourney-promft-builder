import { NextResponse } from "next/server";
import { getRateLimiter } from "./src/lib/rateLimit";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 예외 경로가 있으면 아래에 화이트리스트를 추가하세요.
  if (url.pathname.startsWith("/api/stripe/webhook")) {
    return NextResponse.next();
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${url.pathname}`;

  const limiter = await getRateLimiter();
  const { success, reset, remaining } = await limiter.limit(key);

  if (!success) {
    const retry = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
    return new NextResponse(JSON.stringify({ error: "rate_limited", retry_after: retry }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.next({
    headers: {
      "x-ratelimit-remaining": remaining !== undefined ? String(remaining) : "",
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};


