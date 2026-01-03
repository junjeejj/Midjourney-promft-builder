export type PromptReportPayload = {
  prompt: string;
  reason: string;
  pagePath?: string;
};

export async function reportPrompt(payload: PromptReportPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/report-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return { ok: false, error: j?.error || `HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "network error" };
  }
}

