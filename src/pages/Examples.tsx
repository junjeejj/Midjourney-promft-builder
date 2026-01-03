import React, { useState } from "react";
import { EXAMPLES } from "../content/examples";
import Seo from "../components/Seo";

export default function Examples() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {}
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="예시" description="특정 브랜드/작가/캐릭터명을 포함하지 않은 안전한 샘플 프롬프트 모음" />
      <h1 className="text-3xl font-bold">샘플 프롬프트 예시</h1>
      <p className="mt-2 text-gray-600">
        저작권/상표/인물권 리스크를 줄이기 위해, 특정 브랜드·작가·캐릭터명을 포함하지 않은 예시만 제공합니다.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {EXAMPLES.map((e) => (
          <div key={e.id} className="rounded-2xl border bg-white p-5">
            <div className="text-lg font-semibold">{e.title}</div>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm">{e.prompt}</pre>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">{e.notes}</p>
            <button
              className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition"
              onClick={() => copy(e.prompt, e.id)}
            >
              {copiedId === e.id ? "복사됨" : "복사하기"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

