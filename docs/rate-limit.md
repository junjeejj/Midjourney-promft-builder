## API Rate Limit 예시 (Edge Middleware)

> Vercel + Next.js 환경을 기준으로 한 간단한 IP 기반 버킷 제어 샘플입니다. 프로덕션에서는 Upstash/Redis 등 외부 스토리지를 사용해 다중 인스턴스에서도 일관되게 동작하도록 구성하는 것을 권장합니다.

```ts
// middleware.ts
import { NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const LIMIT = 30;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function middleware(req: Request) {
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/api/")) return NextResponse.next();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${url.pathname}`;

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (bucket.count >= LIMIT) {
    const retry = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000));
    return new NextResponse(
      JSON.stringify({ error: "rate_limited", retry_after: retry }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  bucket.count += 1;
  return NextResponse.next();
}
```

### 적용 팁
- `/api/` 경로 중에서 예외로 둘 엔드포인트가 있다면, `if (!url.pathname.startsWith("/api/"))` 조건 이후에 추가 필터링을 넣어주세요.
- 다중 인스턴스/서버리스 환경에서는 위 샘플 대신 Redis 등 외부 저장소 기반 토큰 버킷을 권장합니다.
- 429 응답 시 클라이언트가 재시도 시점을 알 수 있도록 `retry_after` 값을 함께 내려줍니다.


