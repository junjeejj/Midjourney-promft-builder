// api/stripe/checkout.js

/**
 * 최소 디버그용 핸들러
 * - Stripe, Supabase, _auth 등 어떠한 의존성도 사용하지 않는다.
 * - 단순히 200 OK + JSON 응답만 반환한다.
 */

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    console.log("[checkout.js] minimal JS handler reached");

    return res.status(200).json({
      ok: true,
      message: "minimal JS checkout handler",
    });
  } catch (err) {
    console.error("[checkout.js] unexpected error", err);
    return res.status(500).json({ error: err?.message || "unknown_error" });
  }
}



