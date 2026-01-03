import React from "react";
import { Link, useParams } from "react-router-dom";
import { GUIDES } from "../content/guides";
import OutbrainWidget from "../components/ads/OutbrainWidget";
import Seo from "../components/Seo";

export default function GuideDetail() {
  const { slug } = useParams();
  const doc = GUIDES.find((g) => g.slug === slug);

  if (!doc) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Seo title="가이드" />
        <div className="text-xl font-semibold">문서를 찾을 수 없습니다.</div>
        <Link className="mt-4 inline-block underline" to="/guides">가이드 목록으로</Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Seo title={doc.title} description={doc.description} />
        <Link className="text-sm text-blue-600 underline" to="/guides">← 가이드 목록</Link>
        <h1 className="mt-3 text-3xl font-bold">{doc.title}</h1>
        <p className="mt-2 text-gray-600">{doc.description}</p>
        <div className="mt-6 space-y-4 leading-relaxed text-gray-800">
          {doc.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-10 rounded-2xl border bg-gray-50 p-4 text-sm text-gray-700">
          <div className="font-medium text-gray-900">안전 팁</div>
          <p className="mt-1">
            상표/인물/IP를 직접 지칭하는 문구는 피하고, 일반적인 스타일·구성 요소로 묘사하면 리스크가 줄어듭니다.
          </p>
        </div>
      </div>
      {/* ✅ 문서 하단 네이티브 광고(버튼/입력창과 거리 확보) */}
      <OutbrainWidget />
    </>
  );
}

