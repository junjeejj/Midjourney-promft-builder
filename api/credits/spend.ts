// api/credits/spend.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminSupabase } from "../_supabase";
import { getUserFromAuthHeader } from "../_auth";
// 레이트 리밋은 일시적으로 비활성화 (서버 사이드 호환성 문제)
// import { enforceRateLimit } from "../_rateLimit";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1) 메서드 체크
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 2) 레이트 리밋은 일시적으로 비활성화
    // TODO: 서버 사이드 호환 레이트 리밋 구현 필요

    // 3) 인증 (헤더에서 유저 가져오기)
    const auth = await getUserFromAuthHeader(req);
    if (!auth) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 4) 바디 파라미터
    const body = (req as any).body || {};
    const amount = Number(body.amount ?? 1);
    const reason = (body.reason as string) || "prompt";

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const supa = adminSupabase();

    // 5) 현재 지갑 조회
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

    // 6) 크레딧 부족 체크
    if (current < amount) {
      return res.status(402).json({
        ok: false,
        message: "NOT_ENOUGH_CREDITS",
        balance: current,
      });
    }

    const newBalance = current - amount;

    // 7) 잔액 업데이트
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

    // 8) 사용 내역은 필요하면 따로 ledger 테이블에 insert 추가 가능
    // (wallet_ledger 같은 거 있으면 여기서 insert 한 번 더 해주면 됨)

    // 9) 최종 응답
    return res.status(200).json({
      ok: true,
      balance: newBalance,
    });
  } catch (e: any) {
    console.error("[credits/spend] unexpected error", e);
    return res
      .status(500)
      .json({ error: e?.message ?? "INTERNAL_SERVER_ERROR" });
  }
}
