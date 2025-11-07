import React from "react";
import AdSlot from "../components/ads/AdSlot";

export default function AdsTest() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Ads Test</h2>
        <p className="text-sm text-gray-500">가로형 배너 슬롯을 테스트하는 페이지입니다.</p>
      </header>
      <section className="space-y-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Horizontal Banner Slot
          </h3>
          <div className="mx-auto w-full max-w-4xl">
            <AdSlot slot="1760480869" format="horizontal" />
          </div>
        </div>
        <div className="h-96 rounded-lg border border-dashed" />
      </section>
    </div>
  );
}
