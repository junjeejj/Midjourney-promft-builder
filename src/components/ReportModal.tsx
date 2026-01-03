import React, { useState } from "react";
import { reportPrompt } from "../lib/reportPrompt";
import { getLang } from "../lib/lang";
import { SITE_TEXT } from "../config/siteText";

export default function ReportModal({
  open,
  onClose,
  promptText,
}: {
  open: boolean;
  onClose: () => void;
  promptText: string;
}) {
  const lang = getLang();
  const t = SITE_TEXT[lang];
  const [reason, setReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function submit() {
    if (!reason.trim()) return;
    setReporting(true);
    setDone(null);

    const res = await reportPrompt({
      prompt: promptText,
      reason: reason.trim(),
      pagePath: window.location.pathname,
    });

    setReporting(false);
    if (res.ok) {
      setDone(t.report.done);
      setTimeout(() => {
        setReason("");
        setDone(null);
        onClose();
      }, 1200);
    } else {
      setDone(res.error || "failed");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-lg">
        <div className="text-lg font-semibold">{t.report.title}</div>
        <p className="mt-1 text-sm text-gray-600">{t.report.subtitle}</p>
        <textarea
          className="mt-4 w-full min-h-[120px] rounded-xl border px-3 py-2"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t.report.placeholder}
        />
        {done && (
          <div className="mt-3 rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {done}
          </div>
        )}
        <div className="mt-4 flex gap-2 justify-end">
          <button className="rounded-xl border px-4 py-2" onClick={onClose} disabled={reporting}>
            {t.report.close}
          </button>
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-white font-medium disabled:opacity-60"
            onClick={submit}
            disabled={reporting || !reason.trim()}
          >
            {reporting ? "..." : t.report.submit}
          </button>
        </div>
      </div>
    </div>
  );
}

