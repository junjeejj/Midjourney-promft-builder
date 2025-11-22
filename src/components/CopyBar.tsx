import React, { useState } from "react";
import { useBuilderStore } from "../store/useBuilderStore";
import { stripHints } from "../lib/annotations";
import { buildPrompt } from "../lib/promptAssembler";
import { TIMEOUTS } from "../config/constants";

export default function CopyBar() {
  const { slots, params } = useBuilderStore();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const prompt = buildPrompt(slots, params);
    const clean = stripHints(prompt);
    await navigator.clipboard.writeText(clean);
    setCopied(true);
    setTimeout(() => setCopied(false), TIMEOUTS.COPY_FEEDBACK_LONG);
  };
  
  return (
    <div className="fixed left-0 right-0 bg-white border-t p-4 z-40 above-banner-fixed">
      <div className="flex flex-col items-center justify-center gap-2 max-w-6xl mx-auto">
        <button
          onClick={handleCopy}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
        >
          {copied ? "복사 완료!" : "프롬프트 복사"}
        </button>
        <p className="text-xs text-gray-500">
          괄호()안의 설명은 제외되어 복사됩니다
        </p>
      </div>
    </div>
  );
}

