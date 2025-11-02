import React, { useState } from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { useWalletStore } from "../../store/useWalletStore";
import { generateMidjourneyPrompt } from "../../lib/gptApi";
import BuyCreditsModal from "../BuyCreditsModal";

const PROMPT_GENERATION_COST = 1; // 크레딧 비용

export default function SubjectStep() {
  const { slots, updateSlots } = useBuilderStore();
  const { wallet, consumeCredits } = useWalletStore();
  const [input, setInput] = useState(slots.subject || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  
  const handleGeneratePrompt = async () => {
    if (!input.trim()) {
      setError("스토리를 먼저 입력해주세요.");
      return;
    }

    // 크레딧 확인
    if (wallet.credits < PROMPT_GENERATION_COST) {
      setShowBuyModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 크레딧 차감
      if (!consumeCredits(PROMPT_GENERATION_COST)) {
        setShowBuyModal(true);
        setLoading(false);
        return;
      }

      // GPT API 호출
      const generatedPrompt = await generateMidjourneyPrompt(input);
      
      // 생성된 프롬프트를 입력 필드에 설정
      setInput(generatedPrompt);
      updateSlots({ subject: generatedPrompt });
    } catch (err) {
      setError(err instanceof Error ? err.message : "프롬프트 생성 중 오류가 발생했습니다.");
      // 오류 발생 시 크레딧 반환 (선택사항)
      // addCredits(PROMPT_GENERATION_COST);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">스토리/묘사/주제 입력</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          updateSlots({ subject: e.target.value || undefined });
          setError(null);
        }}
        placeholder="예: a beautiful sunset, a cat, a futuristic city"
        className="w-full border rounded-lg px-3 py-2 text-base"
      />
      
      {/* GPT 프롬프트 자동 생성 버튼 */}
      <div className="space-y-1">
        <button
          onClick={handleGeneratePrompt}
          disabled={loading || !input.trim()}
          className={`w-full px-3 py-2 rounded-lg font-medium transition text-sm ${
            loading || !input.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : wallet.credits < PROMPT_GENERATION_COST
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              AI 프롬프트 생성 중...
            </span>
          ) : wallet.credits < PROMPT_GENERATION_COST ? (
            `크레딧 부족 (필요: ${PROMPT_GENERATION_COST} 크레딧) - 충전하기`
          ) : (
            `✨ AI 프롬프트 자동 생성 (${PROMPT_GENERATION_COST} 크레딧)`
          )}
        </button>
        
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
            {error}
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          💡 AI가 입력한 스토리를 바탕으로 상세한 미드저니 프롬프트를 자동으로 생성합니다.
        </p>
      </div>

      {showBuyModal && <BuyCreditsModal onClose={() => setShowBuyModal(false)} />}
    </div>
  );
}

