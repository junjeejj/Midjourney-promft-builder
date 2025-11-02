import React from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { AR_LIST } from "../../lib/validators";

export default function AspectStep() {
  const { params, updateParams } = useBuilderStore();
  
  const arDescriptions: Record<string, string> = {
    "1:1": "정사각형",
    "3:2": "일반 사진 비율",
    "2:3": "세로 사진 비율",
    "16:9": "와이드스크린",
    "9:16": "세로 영상 비율",
    "21:9": "울트라 와이드",
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Aspect Ratio 선택</h2>
      <div className="grid grid-cols-1 gap-1.5">
        {AR_LIST.map((ar) => (
          <button
            key={ar}
            onClick={() => updateParams({ ar })}
            className={`p-2 border rounded-lg transition text-left ${
              params.ar === ar ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-50"
            }`}
          >
            <span className="font-semibold">{ar}</span> <span className="text-sm opacity-80">- {arDescriptions[ar]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

