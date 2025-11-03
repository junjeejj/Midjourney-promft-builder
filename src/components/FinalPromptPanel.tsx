import { useMemo, useState } from "react";

import { useBuilderStore } from "../store/useBuilderStore";

import { applyDefaultsToParams, buildPrompt } from "../lib/promptAssembler";

import { stripHints, withHints } from "../lib/annotations";

import { useT } from "../i18n";

export default function FinalPromptPanel() {

  const { t } = useT();

  const { slots, params } = useBuilderStore();

  const [copied, setCopied] = useState(false);

  const merged = useMemo(()=> applyDefaultsToParams(params, {}), [params, slots]);

  const full = useMemo(()=> buildPrompt(slots, merged), [slots, merged]);

  const hinted = useMemo(()=> withHints(full, merged), [full, merged]);

  const finalLine = useMemo(()=> stripHints(hinted), [hinted]);

  async function copyFinal() {

    try { await navigator.clipboard.writeText(finalLine); setCopied(true); setTimeout(()=>setCopied(false), 1200); }

    catch {}

  }

  return (

    <div className="border rounded-2xl p-3 bg-white">

      <div className="font-medium mb-2">{t("preview.final")}</div>

      <div className="w-full" style={{ maxWidth: "min(100%, 900px)" }}>

        <pre className="text-sm whitespace-pre-wrap break-words px-4 py-3 bg-gray-50 rounded-xl" style={{ textIndent: "0.5rem" }}>

{finalLine}

        </pre>

      </div>

      <div className="flex justify-end mt-3">

        <button onClick={copyFinal} className="px-3 py-2 border rounded-xl">{copied ? t("preview.copied") : t("preview.copy")}</button>

      </div>

    </div>

  );

}