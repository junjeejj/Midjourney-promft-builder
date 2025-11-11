import React, { useEffect, useState } from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { useWalletStore } from "../../store/useWalletStore";
import { useAuth } from "../../store/useAuth";
import { useT } from "../../i18n";

export default function SubjectStep({ onNext }: { onNext?: () => void }) {
  const { t } = useT();
  const { user, token } = useAuth();
  const { slots, params, setSlots } = useBuilderStore();
  const { balance, fetchBalance, setBalance } = useWalletStore();

  const [v, setV] = useState(slots.subject || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchBalance(token);
    }
  }, [token, fetchBalance]);

  function go() {
    setSlots({ subject: v });
    onNext?.();
  }

  async function handleAutoPrompt() {
    if (!user?.id || !token) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (balance < 1) {
      alert("크레딧이 부족합니다. 결제에서 충전해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/generate-prompt", {
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
        alert(j?.error ?? "자동 생성 중 오류가 발생했습니다.");
        return;
      }
      const autoText = j?.prompt || "";
      if (typeof j.balance === "number") {
        setBalance(j.balance);
      }
      if (autoText) {
        setV(autoText);
        setSlots({ subject: autoText });
      }
    } catch {
      alert("자동 생성 중 오류가 발생했습니다.");
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
          {loading ? "생성 중…" : "AI 프롬프트 자동 생성 (1 크레딧)"}
        </button>
        {user?.id && (
          <span className="text-sm text-gray-600">보유 크레딧: {balance}</span>
        )}
        <button onClick={go} className="rounded-xl border px-3 py-2">
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}