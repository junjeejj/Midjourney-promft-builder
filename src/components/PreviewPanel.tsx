import { useMemo } from "react";

import { useBuilderStore } from "../store/useBuilderStore";

import { applyDefaultsToParams, buildPrompt } from "../lib/promptAssembler";

import { withHints } from "../lib/annotations";

import { useT } from "../i18n";

export default function PreviewPanel() {

  const { t } = useT();

  const { slots, params } = useBuilderStore();

  const merged = useMemo(()=> applyDefaultsToParams(params, {}), [params, slots]);

  const line = useMemo(()=> buildPrompt(slots, merged), [slots, merged]);

  const hinted = useMemo(()=> withHints(line, merged), [line, merged]);

  return (

    <div className="border rounded-2xl p-3 bg-white">

      <div className="font-medium mb-2">{t("preview.title")}</div>

      <div className="w-full" style={{ maxWidth: "min(100%, 900px)" }}>

        <pre className="text-sm whitespace-pre-wrap break-words px-4 py-3 bg-gray-50 rounded-xl" style={{ textIndent: "0.5rem" }}>

{hinted}

        </pre>

      </div>

    </div>

  );

}