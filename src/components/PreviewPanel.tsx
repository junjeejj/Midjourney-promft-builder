import React from "react";
import { useBuilderStore } from "../store/useBuilderStore";
import { PARAM_HINT } from "../lib/annotations";

export default function PreviewPanel() {
  const { slots, params } = useBuilderStore();
  
  const parts: string[] = [];
  if (slots.subject) parts.push(String(slots.subject));
  ["camera", "composition", "lighting", "color", "style", "background"].forEach((k) => {
    const arr = Array.isArray((slots as any)[k]) ? (slots as any)[k] : [];
    if (arr.length) parts.push(arr.join(", "));
  });
  
  const body = parts.join(", ");
  const tail: string[] = [];
  
  const isNum = (v: any): v is number => typeof v === "number" && !Number.isNaN(v);
  
  if (params.ar) tail.push(`--ar ${params.ar} ${PARAM_HINT.ar || ""}`);
  if (isNum(params.stylize)) tail.push(`--stylize ${params.stylize} ${PARAM_HINT.stylize || ""}`);
  if (isNum(params.chaos)) tail.push(`--chaos ${params.chaos} ${PARAM_HINT.chaos || ""}`);
  if (params.q) tail.push(`--q ${params.q} ${PARAM_HINT.q || ""}`);
  if (isNum(params.seed)) tail.push(`--seed ${params.seed} ${PARAM_HINT.seed || ""}`);
  if (params.style) tail.push(`--style ${params.style} ${PARAM_HINT.style || ""}`);
  if (params.tile) tail.push(`--tile ${PARAM_HINT.tile || ""}`);
  if (params.niji) tail.push(`--niji ${PARAM_HINT.niji || ""}`);
  if (params.sref) tail.push(`--sref ${params.sref} ${PARAM_HINT.sref || ""}`);
  if (params.cref) tail.push(`--cref ${params.cref} ${PARAM_HINT.cref || ""}`);
  if (params.no && params.no.length > 0) {
    params.no.forEach(item => tail.push(`--no ${item} ${PARAM_HINT.no || ""}`));
  }
  if (isNum(params.stop)) tail.push(`--stop ${params.stop} ${PARAM_HINT.stop || ""}`);
  if (isNum(params.repeat)) tail.push(`--repeat ${params.repeat} ${PARAM_HINT.repeat || ""}`);
  if (params.version) tail.push(`--v ${params.version} ${PARAM_HINT.version || ""}`);
  if (params.stealth) tail.push(`--stealth ${PARAM_HINT.stealth || ""}`);
  if (params.oref) tail.push(`--oref ${params.oref} ${PARAM_HINT.oref || ""}`);
  if (isNum(params.ow)) tail.push(`--ow ${params.ow} ${PARAM_HINT.ow || ""}`);
  if (params.profile) tail.push(`--profile ${params.profile} ${PARAM_HINT.profile || ""}`);
  if (isNum(params.iw)) tail.push(`--iw ${params.iw} ${PARAM_HINT.iw || ""}`);
  if (isNum(params.weird)) tail.push(`--weird ${params.weird} ${PARAM_HINT.weird || ""}`);
  if (params.draft) tail.push(`--draft ${PARAM_HINT.draft || ""}`);
  if (params.raw) tail.push(`--raw ${PARAM_HINT.raw || ""}`);
  
  const full = `/imagine prompt: ${body}${tail.length ? " " + tail.join(" ") : ""}`;
  
  return (
    <div className="bg-gray-50 border rounded-xl p-2">
      <div className="text-xs font-medium mb-1">프롬프트 미리보기</div>
      <div className="bg-white border rounded-lg p-2 text-xs font-mono break-all">
        {full}
      </div>
    </div>
  );
}

