import React from "react";
import { useBuilderStore } from "../../store/useBuilderStore";

const PRESETS = {
  camera: {
    "close-up": "클로즈업 - 대상에 가까이 접근",
    "wide shot": "와이드샷 - 넓은 화각으로 전체 장면",
    "bird's eye view": "조감도 - 위에서 내려다보는 시점",
    "low angle": "로우앵글 - 아래에서 올려다보는 시점",
    "dutch angle": "더치앵글 - 기울어진 각도로 역동적 느낌",
  },
  composition: {
    "rule of thirds": "삼분할법 - 화면을 9등분하여 배치",
    "centered": "중앙 배치 - 화면 중앙에 주제 배치",
    "leading lines": "선도선 - 시선을 이끄는 선적 요소",
    "symmetry": "대칭구도 - 좌우/상하 대칭 구조",
    "framing": "프레이밍 - 자연스러운 틀로 주제 강조",
  },
  lighting: {
    "natural light": "자연광 - 자연스러운 일광 효과",
    "dramatic lighting": "드라마틱 라이팅 - 강한 대비의 극적 조명",
    "soft lighting": "소프트 라이팅 - 부드럽고 균일한 조명",
    "golden hour": "골든아워 - 일출/일몰 시간대의 따뜻한 조명",
    "rim lighting": "림 라이팅 - 배경과 분리되는 가장자리 조명",
  },
};

export default function CameraComposeLightStep() {
  const { slots, updateSlots } = useBuilderStore();
  
  const toggle = (category: "camera" | "composition" | "lighting", keyword: string) => {
    const current = Array.isArray(slots[category]) ? slots[category]! : [];
    const updated = current.includes(keyword)
      ? current.filter((k) => k !== keyword)
      : [...current, keyword];
    updateSlots({ [category]: updated });
  };
  
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">카메라/구도/조명</h2>
      
      {Object.entries(PRESETS).map(([key, options]) => (
        <div key={key}>
          <div className="font-medium mb-1 capitalize text-sm">{key}</div>
          <div className="space-y-1">
            {Object.entries(options).map(([opt, desc]) => {
              const selected = Array.isArray((slots as any)[key]) && (slots as any)[key].includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggle(key as any, opt)}
                  className={`w-full px-3 py-1.5 border rounded-lg transition text-left text-sm ${
                    selected ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="font-semibold">{opt}</span> <span className="text-xs opacity-80">- {desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

