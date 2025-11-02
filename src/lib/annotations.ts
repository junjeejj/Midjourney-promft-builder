export const PARAM_HINT: Record<string, string> = {
  ar: "(비율)",
  stylize: "(스타일화)",
  chaos: "(혼란도)",
  q: "(품질)",
  seed: "(시드)",
  style: "(스타일)",
  tile: "(타일)",
  niji: "(니지)",
  sref: "(스타일 참조)",
  cref: "(컨셉 참조)",
  no: "(제외)",
  stop: "(중단)",
  repeat: "(반복)",
  version: "(버전)",
  stealth: "(비공개)",
  oref: "(오믹 참조)",
  ow: "(오믹 가중치)",
  profile: "(프로필)",
  iw: "(이미지 가중치)",
  weird: "(기묘함)",
  draft: "(초안)",
  raw: "(원본)",
};

export function stripHints(text: string): string {
  return text.replace(/\s*\([^)]+\)/g, "");
}

