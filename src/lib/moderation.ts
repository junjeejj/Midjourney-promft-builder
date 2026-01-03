export type ModerationHit = {
  ruleId: string;
  label: string;
  matched: string;
};

type Rule = {
  id: string;
  label: string;
  patterns: RegExp[];
};

const RULES: Rule[] = [
  { id: "adult", label: "성인/노출", patterns: [/(porn|sex|xxx|nude|explicit)/i, /(야동|포르노|누드|노출|성행위|19금)/i] },
  { id: "violence", label: "과도한 폭력/유혈", patterns: [/(gore|dismember|beheading|torture)/i, /(살인|고문|유혈|절단|참수)/i] },
  { id: "weapons", label: "무기/폭발물", patterns: [/(bomb|explosive|grenade|gun|rifle)/i, /(폭탄|폭발물|총기|소총|수류탄)/i] },
  { id: "drugs", label: "불법 약물", patterns: [/(cocaine|heroin|meth|mdma)/i, /(마약|코카인|헤로인|필로폰|엑스터시)/i] },
  { id: "gambling", label: "도박/베팅", patterns: [/(casino|betting|gambling)/i, /(카지노|도박|베팅)/i] },
  { id: "personal_data", label: "개인정보(식별 정보)", patterns: [/(resident\s*registration|ssn|passport)/i, /(주민등록|주민번호|여권번호)/i] },
];

export function moderateText(text: string): { ok: boolean; hits: ModerationHit[] } {
  const s = (text ?? "").trim();
  if (!s) return { ok: true, hits: [] };

  const hits: ModerationHit[] = [];
  for (const rule of RULES) {
    for (const rx of rule.patterns) {
      const m = s.match(rx);
      if (m?.[0]) hits.push({ ruleId: rule.id, label: rule.label, matched: m[0] });
    }
  }

  return { ok: hits.length === 0, hits };
}

export function buildModerationMessage(hits: ModerationHit[]): string {
  const labels = Array.from(new Set(hits.map((h) => h.label)));
  return `정책상 처리하기 어려운 내용이 포함되어 있어요: ${labels.join(", ")}\n(해당 키워드를 제거/완화한 뒤 다시 시도해주세요)`;
}

