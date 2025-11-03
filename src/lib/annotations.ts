// src/lib/annotations.ts

/**

 * Hint helpers:

 * - withHints: 프롬프트 내 주요 토큰 뒤에 짧은 괄호 설명을 붙여 가독성을 높입니다.

 * - stripHints: 괄호로 들어간 설명을 제거해 최종 프롬프트를 만듭니다.

 */

const HINT_DICT: Record<string, string> = {

  "low-angle": "camera below subject",

  "eye-level": "natural perspective",

  "high-angle": "camera above subject",

  "rule of thirds": "balanced framing",

  "centered": "strong center",

  "leading lines": "guiding lines",

  "symmetry": "formal balance",

  "negative space": "emphasize subject",

  "soft diffused": "soft even light",

  "rim light": "edge highlight",

  "backlight": "silhouette/mood",

  "golden hour": "warm sunset glow",

  "neon": "colorful neon light",

};

function annotateToken(token: string) {

  const key = token.toLowerCase().trim();

  const hint = HINT_DICT[key];

  return hint ? `${token} (${hint})` : token;

}

/**

 * 입력된 한 줄 프롬프트에서 쉼표로 구분된 토큰들에 힌트를 붙여 반환.

 * 파라미터(--xxx)는 그대로 둡니다.

 */

export function withHints(line: string, _params?: any): string {

  const parts = line.split("--");

  const left = parts[0]?.trim() ?? "";

  const right = parts.length > 1 ? ("--" + parts.slice(1).join("--")) : "";

  const annotatedLeft = left

    .split(",")

    .map(s => s.trim())

    .filter(Boolean)

    .map(annotateToken)

    .join(", ");

  return right ? `${annotatedLeft} ${right}` : annotatedLeft;

}

/**

 * 괄호 안 설명을 제거합니다. 예: "low-angle (camera below)" -> "low-angle"

 * 중첩/쉼표 포함 괄호도 제거.

 */

export function stripHints(text: string): string {

  return text.replace(/\s*\([^()]*\)/g, "").replace(/\s{2,}/g, " ").trim();

}