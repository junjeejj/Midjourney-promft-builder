import { useBuilderStore } from "../../store/useBuilderStore";

import { AR_LIST } from "../../lib/validators";

import { useT, useT as useDict } from "../../i18n";

import { useMemo } from "react";

function Row({ text, desc, onPick }:{ text:string; desc:string; onPick:()=>void }) {

  return (

    <button type="button" onClick={onPick} className="w-full text-left border rounded-xl p-3 hover:bg-gray-50">

      <div className="font-medium">{text} <span className="text-gray-400">: {desc}</span></div>

    </button>

  );

}

export default function AspectStep({ onNext }:{ onNext?: ()=>void }) {

  const { t, d } = useDict();

  const { setParams } = useBuilderStore();

  const descMap = useMemo(()=> d("aspect.desc") as Record<string,string>, [d]);

  function choose(ar:string){ setParams({ ar }); onNext?.(); }

  return (

    <div className="border rounded-2xl p-3 bg-white space-y-2">

      <div className="font-medium mb-2">{t("aspect.label")}</div>

      {AR_LIST.map(ar => <Row key={ar} text={ar} desc={descMap[ar]||""} onPick={()=>choose(ar)} />)}

      <div className="text-xs text-gray-500 mt-1">{t("aspect.noteNext")}</div>

    </div>

  );

}