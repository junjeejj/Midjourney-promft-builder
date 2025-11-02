import React from "react";
import { useBuilderStore } from "../../store/useBuilderStore";

export default function ModePresetStep() {
  const { params, updateParams } = useBuilderStore();
  
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">모드/프리셋 선택</h2>
      <div className="grid grid-cols-1 gap-1.5">
        <button
          onClick={() => updateParams({ niji: !params.niji })}
          className={`p-2 border rounded-lg transition text-left ${
            params.niji ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-50"
          }`}
        >
          <span className="font-semibold">Niji 모드</span> <span className="text-sm opacity-80">- 애니메이션 스타일 전용 모드</span>
        </button>
        <button
          onClick={() => updateParams({ tile: !params.tile })}
          className={`p-2 border rounded-lg transition text-left ${
            params.tile ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-50"
          }`}
        >
          <span className="font-semibold">Tile 모드</span> <span className="text-sm opacity-80">- 패턴/타일 반복 생성 모드</span>
        </button>
      </div>
    </div>
  );
}

