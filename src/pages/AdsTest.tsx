// src/pages/AdsTest.tsx
import AdSlot from "../components/ads/AdSlot";

export default function AdsTest() {
  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Ads Test</h1>
      <p className="text-sm opacity-70">아래는 단일 슬롯 테스트 영역입니다.</p>
      <AdSlot slot="여기에_상단슬롯ID" style={{ minHeight: 250 }} />
    </div>
  );
}

