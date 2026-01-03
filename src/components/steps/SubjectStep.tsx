import React, { useEffect, useState } from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { useWalletStore } from "../../store/useWalletStore";
import { useAuth } from "../../store/useAuth";
import { useT } from "../../i18n";
import { API_ENDPOINTS } from "../../config/constants";

export default function SubjectStep({ onNext }: { onNext?: () => void }) {
  const { t } = useT();
  const { user, token } = useAuth();
  const { slots, params, setSlots } = useBuilderStore();
  const { balance, fetchBalance, setBalance, spend } = useWalletStore();

  const [v, setV] = useState(slots.subject || "");
  const [loading, setLoading] = useState(false);
  
  // Zustand store 함수의 최신 참조를 유지
  const fetchBalanceRef = React.useRef(fetchBalance);
  
  React.useEffect(() => {
    fetchBalanceRef.current = fetchBalance;
  }, [fetchBalance]);

  useEffect(() => {
    if (token) {
      fetchBalanceRef.current(token);
    }
  }, [token]);

  function go() {
    setSlots({ subject: v });
    onNext?.();
  }

  async function handleAutoPrompt() {
    if (!user?.id || !token) {
      alert(t("subject.loginRequired"));
      return;
    }
    if (balance < 1) {
      alert(t("subject.insufficientCredits"));
      return;
    }
    setLoading(true);
    try {
      // 1) 프롬프트 생성 호출
      const r = await fetch(API_ENDPOINTS.GENERATE_PROMPT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: v,
          params,
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        alert(j?.error ?? t("subject.errorGenerating"));
        return;
      }
      
      // 2) /imagine 제거해서 Subject에 넣기
      let autoText = (j?.prompt ?? "").trim();
      autoText = autoText.replace(/^\/imagine(\s+prompt:)?\s*/i, "");
      
      if (autoText) {
        setV(autoText);
        setSlots({ subject: autoText });
      }

      // 3) 크레딧 1 차감
      const spendResult = await spend(1, token, "ai_prompt");
      if (!spendResult.ok) {
        console.error("[SubjectStep] credit spend failed", spendResult);
        alert(t("subject.errorDeducting"));
        return;
      }
      
      console.log("[SubjectStep] credit spent successfully", spendResult);

      // 4) 크레딧 잔액 새로고침 (spend가 이미 업데이트하지만 안전을 위해)
      if (token) {
        await fetchBalance(token);
      }
    } catch (err) {
      console.error("[SubjectStep] auto prompt error", err);
      alert(t("subject.errorGenerating"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-4">
      <div className="font-medium">{t("subject.label")}</div>
      <input
        className="w-full rounded-xl border px-3 py-2"
        placeholder={t("subject.placeholder")}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") go();
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handleAutoPrompt}
          disabled={loading}
          className="rounded bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t("subject.generating") : t("subject.autoGenerate")}
        </button>
        {user?.id && (
          <span className="text-sm text-gray-600">{t("subject.creditsBalance")}: {balance}</span>
        )}
        <button onClick={go} className="rounded-xl border px-3 py-2">
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}