// api/credits/spend.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { getUserFromAuthHeader } from "../_auth";
// 레이트 리밋은 일시적으로 비활성화 (서버 사이드 호환성 문제)
// import { enforceRateLimit } from "../_rateLimit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[credits/spend] request received", { method: req.method });
    
    // 1) 메서드 체크
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 2) 레이트 리밋은 일시적으로 비활성화
    // TODO: 서버 사이드 호환 레이트 리밋 구현 필요

    // 3) 인증 (헤더에서 유저 가져오기)
    let auth;
    try {
      auth = await getUserFromAuthHeader(req);
    } catch (authError: any) {
      console.error("[credits/spend] auth error", authError);
      return res.status(401).json({ error: "Authentication failed", details: authError?.message });
    }
    
    if (!auth) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    console.log("[credits/spend] auth successful", { userId: auth.userId });

    // 4) 바디 파라미터
    const body = (req as any).body || {};
    const amount = Number(body.amount ?? 1);
    const reason = (body.reason as string) || "prompt";

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // 5) Supabase 클라이언트 생성 (capture-order.ts와 동일한 패턴)
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      console.error("[credits/spend] missing Supabase envs", {
        hasUrl: !!SUPABASE_URL,
        hasServiceRole: !!SUPABASE_SERVICE_ROLE
      });
      return res.status(500).json({ 
        error: "Database configuration error", 
        details: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE" 
      });
    }
    const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    // 6) 현재 지갑 조회
    const { data: wallet, error: walletError } = await supa
      .from("wallets")
      .select("balance, unlimited")
      .eq("user_id", auth.userId)
      .maybeSingle();

    if (walletError && walletError.code !== "PGRST116") {
      // PGRST116: row not found
      console.error("[credits/spend] select wallet error", walletError);
      throw walletError;
    }

    const current = wallet?.balance ?? 0;
    const isUnlimited = wallet?.unlimited ?? false;

    // 무제한 계정이면 그냥 통과 (잔액은 그대로 리턴)
    if (isUnlimited) {
      return res.status(200).json({
        ok: true,
        balance: current,
        unlimited: true,
      });
    }

    // 7) 크레딧 부족 체크
    if (current < amount) {
      return res.status(402).json({
        ok: false,
        message: "NOT_ENOUGH_CREDITS",
        balance: current,
      });
    }

    const newBalance = current - amount;

    // 8) 잔액 업데이트
    const { error: updateError } = await supa
      .from("wallets")
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", auth.userId);

    if (updateError) {
      console.error("[credits/spend] update wallet error", updateError);
      throw updateError;
    }

    // 9) 사용 내역은 필요하면 따로 ledger 테이블에 insert 추가 가능
    // (wallet_ledger 같은 거 있으면 여기서 insert 한 번 더 해주면 됨)

    // 10) 최종 응답
    console.log("[credits/spend] success", { userId: auth.userId, amount, newBalance });
    return res.status(200).json({
      ok: true,
      balance: newBalance,
    });
  } catch (e: any) {
    console.error("[credits/spend] unexpected error", {
      message: e?.message,
      stack: e?.stack,
      name: e?.name,
      error: e
    });
    return res
      .status(500)
      .json({ 
        error: e?.message ?? "INTERNAL_SERVER_ERROR",
        type: e?.name || "UnknownError"
      });
  }
}
