export type PromptExample = {
  id: string;
  title: string;
  prompt: string;
  notes: string;
};

export const EXAMPLES: PromptExample[] = [
  {
    id: "e1",
    title: "미니멀 제품 사진 느낌",
    prompt:
      "single subject, minimalist product photo, matte white background, soft diffused light, subtle shadow, centered composition, crisp details, no text, no logo, no watermark",
    notes: "특정 브랜드/인물/IP 없이 '제품 사진' 느낌을 안정적으로 얻는 템플릿입니다.",
  },
  {
    id: "e2",
    title: "따뜻한 감성 풍경",
    prompt:
      "quiet countryside landscape, early morning mist, warm color temperature, low contrast, soft light, rule of thirds composition, natural textures, no people, no text",
    notes: "추상어 대신 빛/색/구도 단서를 사용해 분위기를 고정합니다.",
  },
  {
    id: "e3",
    title: "아이콘/심볼용 단순 일러스트",
    prompt:
      "simple flat illustration, clean vector-like shapes, limited color palette, centered subject, high readability, solid background, no text, no watermark",
    notes: "아이콘/심볼은 '가독성'과 '배경 단순'을 강조하면 실패율이 줄어듭니다.",
  },
  {
    id: "e4",
    title: "포스터 무드(텍스트 없이)",
    prompt:
      "minimal poster design, bold shapes, strong negative space, cinematic lighting mood, centered subject, subtle grain, no text, no logo",
    notes: "포스터 무드를 원해도 '텍스트 없음'으로 임의 문자 생성 리스크를 줄입니다.",
  },
];

