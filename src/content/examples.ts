export type PromptExample = {
  id: string;
  title: { ko: string; en: string };
  prompt: string;
  notes: { ko: string; en: string };
};

export const EXAMPLES: PromptExample[] = [
  {
    id: "e1",
    title: {
      ko: "미니멀 제품 사진 느낌",
      en: "Minimal Product Photo Style"
    },
    prompt:
      "single subject, minimalist product photo, matte white background, soft diffused light, subtle shadow, centered composition, crisp details, no text, no logo, no watermark",
    notes: {
      ko: "특정 브랜드/인물/IP 없이 '제품 사진' 느낌을 안정적으로 얻는 템플릿입니다.",
      en: "A template to reliably get a 'product photo' feel without specific brands/people/IPs."
    },
  },
  {
    id: "e2",
    title: {
      ko: "따뜻한 감성 풍경",
      en: "Warm Emotional Landscape"
    },
    prompt:
      "quiet countryside landscape, early morning mist, warm color temperature, low contrast, soft light, rule of thirds composition, natural textures, no people, no text",
    notes: {
      ko: "추상어 대신 빛/색/구도 단서를 사용해 분위기를 고정합니다.",
      en: "Uses light/color/composition clues instead of abstract words to fix the mood."
    },
  },
  {
    id: "e3",
    title: {
      ko: "아이콘/심볼용 단순 일러스트",
      en: "Simple Illustration for Icons/Symbols"
    },
    prompt:
      "simple flat illustration, clean vector-like shapes, limited color palette, centered subject, high readability, solid background, no text, no watermark",
    notes: {
      ko: "아이콘/심볼은 '가독성'과 '배경 단순'을 강조하면 실패율이 줄어듭니다.",
      en: "Emphasizing 'readability' and 'simple background' reduces failure rates for icons/symbols."
    },
  },
  {
    id: "e4",
    title: {
      ko: "포스터 무드(텍스트 없이)",
      en: "Poster Mood (No Text)"
    },
    prompt:
      "minimal poster design, bold shapes, strong negative space, cinematic lighting mood, centered subject, subtle grain, no text, no logo",
    notes: {
      ko: "포스터 무드를 원해도 '텍스트 없음'으로 임의 문자 생성 리스크를 줄입니다.",
      en: "Even if you want a poster mood, 'no text' reduces the risk of arbitrary character generation."
    },
  },
];
