import { useMemo, useState } from "react";

import { useBuilderStore } from "../store/useBuilderStore";
import { useTemplateStore } from "../store/useTemplateStore";

import { applyDefaultsToParams, buildPrompt } from "../lib/promptAssembler";

import { stripHints, withHints } from "../lib/annotations";

import { useT } from "../i18n";
import { TIMEOUTS } from "../config/constants";
import type { MJParams } from "../types";

export default function PreviewPanel() {

  const { t } = useT();

  const { slots, params, reset } = useBuilderStore();
  const { save } = useTemplateStore();

  const [copied, setCopied] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const merged = useMemo(()=> applyDefaultsToParams(params, {}), [params, slots]);

  const line = useMemo(()=> buildPrompt(slots, merged), [slots, merged]);

  const hinted = useMemo(()=> withHints(line, merged), [line, merged]);

  const finalLine = useMemo(()=> stripHints(hinted), [hinted]);

  async function copyPrompt() {

    try { 

      await navigator.clipboard.writeText(finalLine); 

      setCopied(true); 

      setTimeout(()=>setCopied(false), TIMEOUTS.COPY_FEEDBACK); 

    } catch {}

  }

  function resetPrompt() {

    reset();

  }

  function handleSaveTemplate() {
    if (!templateName.trim()) {
      alert("템플릿 이름을 입력해주세요.");
      return;
    }

    save({
      name: templateName.trim(),
      slots: { ...slots },
      params: params as MJParams,
    });

    setTemplateName("");
    setShowSaveModal(false);
    alert(`"${templateName.trim()}" 템플릿이 저장되었습니다.`);
  }

  return (

    <div className="border rounded-2xl p-3 bg-white">

      <div className="flex items-center justify-between mb-2">

        <div className="font-medium">{t("preview.title")}</div>

        <button 

          onClick={resetPrompt}

          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"

        >

          {t("preview.reset")}

        </button>

      </div>

      <div className="w-full" style={{ maxWidth: "min(100%, 900px)" }}>

        <pre className="text-sm whitespace-pre-wrap break-words px-4 py-3 bg-gray-50 rounded-xl" style={{ textIndent: "0.5rem" }}>

{hinted}

        </pre>

      </div>

      <div className="flex gap-2 mt-3">
        <button 

          onClick={copyPrompt}

          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"

        >

          {copied ? t("preview.copied") : t("preview.copy")}

        </button>

        <button 

          onClick={() => setShowSaveModal(true)}

          className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition"

        >

          템플릿 저장

        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">

        {t("preview.hintNote")}

      </p>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowSaveModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">템플릿 저장</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="템플릿 이름을 입력하세요"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveTemplate();
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveTemplate}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setTemplateName("");
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );

}