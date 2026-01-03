export function isRequestAllowed(text: string): { ok: boolean; labels: string[] } {
  const s = (text ?? "").trim();
  if (!s) return { ok: true, labels: [] };

  const labels: string[] = [];
  const rules: Array<{ label: string; patterns: RegExp[] }> = [
    { label: "성인/노출", patterns: [/(porn|sex|xxx|nude|explicit)/i, /(야동|포르노|누드|노출|성행위|19금)/i] },
    { label: "과도한 폭력/유혈", patterns: [/(gore|dismember|beheading|torture)/i, /(살인|고문|유혈|절단|참수)/i] },
    { label: "무기/폭발물", patterns: [/(bomb|explosive|grenade|gun|rifle)/i, /(폭탄|폭발물|총기|소총|수류탄)/i] },
    { label: "불법 약물", patterns: [/(cocaine|heroin|meth|mdma)/i, /(마약|코카인|헤로인|필로폰|엑스터시)/i] },
    { label: "도박/베팅", patterns: [/(casino|betting|gambling)/i, /(카지노|도박|베팅)/i] },
  ];

  for (const r of rules) {
    if (r.patterns.some((rx) => rx.test(s))) labels.push(r.label);
  }

  return { ok: labels.length === 0, labels: Array.from(new Set(labels)) };
}

