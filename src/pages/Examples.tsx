import React, { useState } from "react";
import { EXAMPLES } from "../content/examples";
import Seo from "../components/Seo";
import { getLang } from "../lib/lang";

export default function Examples() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const lang = getLang();

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {}
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo 
        title={lang === "ko" ? "예시" : "Examples"} 
        description={lang === "ko" ? "특정 브랜드/작가/캐릭터명을 포함하지 않은 안전한 샘플 프롬프트 모음" : "A collection of safe sample prompts that don't include specific brand/artist/character names"} 
      />
      <h1 className="text-3xl font-bold">{lang === "ko" ? "샘플 프롬프트 예시" : "Sample Prompt Examples"}</h1>
      <p className="mt-2 text-gray-600">
        {lang === "ko" 
          ? "저작권/상표/인물권 리스크를 줄이기 위해, 특정 브랜드·작가·캐릭터명을 포함하지 않은 예시만 제공합니다."
          : "To reduce copyright/trademark/personality rights risks, we only provide examples that don't include specific brand/artist/character names."}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {EXAMPLES.map((e) => (
          <div key={e.id} className="rounded-2xl border bg-white p-5">
            <div className="text-lg font-semibold">{e.title[lang]}</div>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm">{e.prompt}</pre>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">{e.notes[lang]}</p>
            <button
              className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition"
              onClick={() => copy(e.prompt, e.id)}
            >
              {copiedId === e.id ? (lang === "ko" ? "복사됨" : "Copied") : (lang === "ko" ? "복사하기" : "Copy")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

