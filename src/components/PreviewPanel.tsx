import { useMemo, useState } from "react";

import { useBuilderStore } from "../store/useBuilderStore";

import { applyDefaultsToParams, buildPrompt } from "../lib/promptAssembler";

import { stripHints, withHints } from "../lib/annotations";

import { useT } from "../i18n";

export default function PreviewPanel() {

  const { t } = useT();

  const { slots, params, reset } = useBuilderStore();

  const [copied, setCopied] = useState(false);

  const merged = useMemo(()=> applyDefaultsToParams(params, {}), [params, slots]);

  const line = useMemo(()=> buildPrompt(slots, merged), [slots, merged]);

  const hinted = useMemo(()=> withHints(line, merged), [line, merged]);

  const finalLine = useMemo(()=> stripHints(hinted), [hinted]);

  async function copyPrompt() {

    try { 

      await navigator.clipboard.writeText(finalLine); 

      setCopied(true); 

      setTimeout(()=>setCopied(false), 1200); 

    } catch {}

  }

  function resetPrompt() {

    reset();

  }

  return (

    <div className="border rounded-2xl p-3 bg-white">

      <div className="flex items-center justify-between mb-2">

        <div className="font-medium">{t("preview.title")}</div>

        <button 

          onClick={resetPrompt}

          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"

        >

          프롬프트 초기화

        </button>

      </div>

      <div className="w-full" style={{ maxWidth: "min(100%, 900px)" }}>

        <pre className="text-sm whitespace-pre-wrap break-words px-4 py-3 bg-gray-50 rounded-xl" style={{ textIndent: "0.5rem" }}>

{hinted}

        </pre>

      </div>

      <button 

        onClick={copyPrompt}

        className="w-full mt-3 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"

      >

        {copied ? t("preview.copied") : t("preview.copy")}

      </button>

      <p className="text-xs text-gray-500 mt-2 text-center">

        (파라미터를 설명하는 문구는 지워집니다)

      </p>

    </div>

  );

}