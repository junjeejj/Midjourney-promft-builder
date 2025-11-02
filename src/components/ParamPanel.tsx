import React, { useState } from "react";
import { useBuilderStore } from "../store/useBuilderStore";

export default function ParamPanel() {
  const { params, updateParams } = useBuilderStore();
  const [noInput, setNoInput] = useState("");
  
  const addNoItem = () => {
    if (!noInput.trim()) return;
    const current = params.no || [];
    if (!current.includes(noInput.trim())) {
      updateParams({ no: [...current, noInput.trim()] });
    }
    setNoInput("");
  };
  
  const removeNoItem = (item: string) => {
    const current = params.no || [];
    updateParams({ no: current.filter(x => x !== item) });
  };
  
  return (
    <div className="bg-white border rounded-xl p-4 space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="font-semibold text-lg">추가 파라미터</div>
      
      {/* 필수 컨트롤 */}
      <div className="space-y-4">
        <div className="font-medium text-base border-b pb-2">필수 컨트롤</div>
        
        <div>
          <label className="block text-sm mb-1">
            <span className="font-semibold">Aspect Ratio (--ar)</span>
            <span className="text-gray-600 text-xs ml-2">- 화면비 설정</span>
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={params.ar || ""}
            onChange={(e) => updateParams({ ar: e.target.value || null })}
          >
            <option value="">선택 안 함</option>
            <option>1:1</option>
            <option>3:2</option>
            <option>2:3</option>
            <option>16:9</option>
            <option>9:16</option>
            <option>21:9</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2">
            <span className="font-semibold text-base">Stylize (--stylize)</span>
            <span className="text-sm text-gray-600 ml-2">- 예술 vs. 사실 (0-1000, 100 기본)</span>
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            value={params.stylize ?? 100}
            onChange={(e) => updateParams({ stylize: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">현재 값: {params.stylize ?? 100}</div>
        </div>
        
        <div>
          <label className="block mb-2">
            <span className="font-semibold text-base">Chaos (--chaos)</span>
            <span className="text-sm text-gray-600 ml-2">- 다양성/랜덤 (0-100)</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={params.chaos ?? 0}
            onChange={(e) => updateParams({ chaos: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">현재 값: {params.chaos ?? 0}</div>
        </div>
        
        <div>
          <label className="block text-sm mb-1">
            <span className="font-semibold">Quality (--q)</span>
            <span className="text-gray-600 text-xs ml-2">- 계산 품질</span>
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={params.q ?? ""}
            onChange={(e) => updateParams({ q: e.target.value ? (Number(e.target.value) as 0.5 | 1 | 2) : null })}
          >
            <option value="">선택 안 함</option>
            <option value="0.25">0.25</option>
            <option value="0.5">0.5</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm mb-1">
            <span className="font-semibold">No (--no)</span>
            <span className="text-gray-600 text-xs ml-2">- 빼고 싶은 요소 강제 제외</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="예: text, watermark, people"
              value={noInput}
              onChange={(e) => setNoInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNoItem()}
            />
            <button onClick={addNoItem} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm">추가</button>
          </div>
          {params.no && params.no.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {params.no.map((item) => (
                <span key={item} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-1">
                  {item}
                  <button onClick={() => removeNoItem(item)} className="text-red-500">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm mb-1">
            <span className="font-semibold">Seed (--seed)</span>
            <span className="text-gray-600 text-xs ml-2">- 재현성 고정</span>
          </label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={params.seed ?? ""}
            onChange={(e) => updateParams({ seed: e.target.value ? Number(e.target.value) : null })}
          />
        </div>
        
        <div>
          <label className="block mb-2">
            <span className="font-semibold text-base">Stop (--stop)</span>
            <span className="text-sm text-gray-600 ml-2">- 중간 렌더 멈추기 (0-100)</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={params.stop ?? 0}
            onChange={(e) => updateParams({ stop: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">현재 값: {params.stop ?? 0}</div>
        </div>
        
        <div>
          <label className="block text-sm mb-1">
            <span className="font-semibold">Version (--v)</span>
            <span className="text-gray-600 text-xs ml-2">- 모델 버전 직접 입력 (예: 5, 5.1, 6, 6.1, 7)</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="예: 5, 5.1, 6, 7"
            value={params.version || ""}
            onChange={(e) => updateParams({ version: e.target.value || null })}
          />
        </div>
      </div>
      
      {/* 스타일/일관성 */}
      <div className="space-y-4">
        <div className="font-medium text-base border-b pb-2">스타일/일관성</div>
        
        <div>
          <label className="block text-sm mb-1">
            <span className="font-semibold">Style Reference (--sref)</span>
            <span className="text-gray-600 text-xs ml-2">- 스타일 레퍼런스 이미지 URL</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="이미지 URL 또는 스타일 코드"
            value={params.sref || ""}
            onChange={(e) => updateParams({ sref: e.target.value || null })}
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">
            <span className="font-semibold">Omni Reference (--oref)</span>
            <span className="text-gray-600 text-xs ml-2">- 특정 인물/오브젝트 일관성 유지</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="이미지 URL"
            value={params.oref || ""}
            onChange={(e) => updateParams({ oref: e.target.value || null })}
          />
        </div>
        
        <div>
          <label className="block mb-2">
            <span className="font-semibold text-base">Omni Weight (--ow)</span>
            <span className="text-sm text-gray-600 ml-2">- 레퍼런스 강도 (0-1000)</span>
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            value={params.ow ?? 100}
            onChange={(e) => updateParams({ ow: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">현재 값: {params.ow ?? 100}</div>
        </div>
        
        <div>
          <label className="block mb-2">
            <span className="font-semibold text-base">Image Weight (--iw)</span>
            <span className="text-sm text-gray-600 ml-2">- 이미지 프롬프트 영향력 (0-3)</span>
          </label>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={params.iw ?? 1}
            onChange={(e) => updateParams({ iw: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">현재 값: {params.iw ?? 1}</div>
        </div>
        
        <div>
          <label className="block text-sm mb-1">
            <span className="font-semibold">Profile (--p)</span>
            <span className="text-gray-600 text-xs ml-2">- 개인/브랜드 스타일 프로필</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="프로필 이름"
            value={params.profile || ""}
            onChange={(e) => updateParams({ profile: e.target.value || null })}
          />
        </div>
        
        {/* Style (--style) - V5 등 구버전에서만 표시 */}
        {(() => {
          const version = params.version || "";
          // v5 계열 또는 niji 계열일 때만 --style을 보여주자
          const lower = version.toLowerCase();
          const isLegacyVersion =
            lower.includes("v5") ||
            lower.startsWith("5") ||
            lower.startsWith("5.") ||
            lower.includes("niji");
          
          if (!isLegacyVersion) return null;
          
          return (
            <div>
              <label className="block text-sm mb-1">
                <span className="font-semibold">Style (--style)</span>
                <span className="text-gray-600 text-xs ml-2">- 스타일 모드 (구버전 전용)</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="raw, cute 등"
                value={params.style || ""}
                onChange={(e) => updateParams({ style: e.target.value || null })}
              />
            </div>
          );
        })()}
      </div>
      
      {/* 생산성 */}
      <div className="space-y-4">
        <div className="font-medium text-base border-b pb-2">생산성</div>
        
        <div>
          <label className="block mb-2">
            <span className="font-semibold text-base">Repeat (--repeat)</span>
            <span className="text-sm text-gray-600 ml-2">- 한 번에 여러 장 생성 (0-40)</span>
          </label>
          <input
            type="range"
            min={0}
            max={40}
            value={params.repeat ?? 1}
            onChange={(e) => updateParams({ repeat: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">현재 값: {params.repeat ?? 1}</div>
        </div>
      </div>
      
      {/* 실험적 */}
      <div className="space-y-4">
        <div className="font-medium text-base border-b pb-2">실험적</div>
        
        <div>
          <label className="block mb-2">
            <span className="font-semibold text-base">Weird (--weird)</span>
            <span className="text-sm text-gray-600 ml-2">- 실험적/기묘한 해석 (0-3000)</span>
          </label>
          <input
            type="range"
            min={0}
            max={3000}
            value={params.weird ?? 0}
            onChange={(e) => updateParams({ weird: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">현재 값: {params.weird ?? 0}</div>
        </div>
      </div>
      
      {/* 모드/옵션 */}
      <div className="space-y-4">
        <div className="font-medium text-base border-b pb-2">모드/옵션</div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={params.tile ?? false}
              onChange={(e) => updateParams({ tile: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="font-semibold text-sm">Tile (--tile)</span>
            <span className="text-gray-600 text-xs">- 무한 반복 패턴</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={params.niji ?? false}
              onChange={(e) => updateParams({ niji: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="font-semibold text-sm">Niji (--niji)</span>
            <span className="text-gray-600 text-xs">- 애니메이션 스타일 모드</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={params.raw ?? false}
              onChange={(e) => updateParams({ raw: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="font-semibold text-sm">Raw (--raw)</span>
            <span className="text-gray-600 text-xs">- 기본 미드저니 스타일 약화</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={params.stealth ?? false}
              onChange={(e) => updateParams({ stealth: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="font-semibold text-sm">Stealth (--stealth)</span>
            <span className="text-gray-600 text-xs">- 웹 갤러리 비공개</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={params.draft ?? false}
              onChange={(e) => updateParams({ draft: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="font-semibold text-sm">Draft (--draft)</span>
            <span className="text-gray-600 text-xs">- 빠른 러프 컨셉 드로잉 모드</span>
          </label>
        </div>
      </div>
    </div>
  );
}
