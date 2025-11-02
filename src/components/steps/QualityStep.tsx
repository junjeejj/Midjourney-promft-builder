import React from "react";
import { useBuilderStore } from "../../store/useBuilderStore";

export default function QualityStep() {
  const { params, updateParams } = useBuilderStore();
  
  const qualityDescriptions: Record<number, string> = {
    0.5: "빠른 생성, 낮은 품질",
    1: "기본 품질 (기본값)",
    2: "고품질, 느린 생성",
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">품질 설정</h2>
      <div className="grid grid-cols-1 gap-1.5">
        {([0.5, 1, 2] as const).map((q) => (
          <button
            key={q}
            onClick={() => updateParams({ q })}
            className={`p-2 border rounded-lg transition text-left ${
              params.q === q ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-50"
            }`}
          >
            <span className="font-semibold">Quality {q}</span> <span className="text-sm opacity-80">- {qualityDescriptions[q]}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-3">
        <label className="block mb-1">
          <span className="font-semibold text-sm">Stylize (0-1000)</span>
          <span className="text-xs text-gray-600 ml-2">- 스타일 강도 조절. 높을수록 더 스타일리시하고 예술적인 결과</span>
        </label>
        <input
          type="range"
          min={0}
          max={1000}
          value={params.stylize ?? 100}
          onChange={(e) => updateParams({ stylize: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-600 mt-0.5">현재 값: {params.stylize ?? 100}</div>
      </div>
      
      <div className="mt-3">
        <label className="block mb-1">
          <span className="font-semibold text-sm">Chaos (0-100)</span>
          <span className="text-xs text-gray-600 ml-2">- 변형도 조절. 높을수록 더 다양하고 예측 불가능한 결과</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={params.chaos ?? 0}
          onChange={(e) => updateParams({ chaos: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-600 mt-0.5">현재 값: {params.chaos ?? 0}</div>
      </div>
    </div>
  );
}

