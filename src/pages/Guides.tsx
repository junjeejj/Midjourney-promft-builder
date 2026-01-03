import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GUIDES } from "../content/guides";
import Seo from "../components/Seo";

export default function Guides() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return GUIDES;
    return GUIDES.filter((g) => (g.title + " " + g.description).toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo title="가이드" description="프롬프트를 더 예측 가능하게 만들고 정책 리스크를 줄이는 실전 가이드 모음" />
      <h1 className="text-3xl font-bold">가이드 / 튜토리얼</h1>
      <p className="mt-2 text-gray-600">
        프롬프트를 더 예측 가능하게 만들고, 심사 관점에서 리스크를 줄이는 방법을 정리했습니다.
      </p>
      <div className="mt-6">
        <input
          className="w-full rounded-xl border px-4 py-3"
          placeholder="검색: 예) 구도, 조명, 상표"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}`} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition">
            <div className="text-xs text-gray-500">업데이트: {g.updatedAt}</div>
            <div className="mt-1 text-lg font-semibold">{g.title}</div>
            <div className="mt-2 text-sm text-gray-600 leading-relaxed">{g.description}</div>
            <div className="mt-3 text-sm text-blue-600">읽기 →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

