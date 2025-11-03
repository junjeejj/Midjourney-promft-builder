import { useBuilderStore } from "../../store/useBuilderStore";

import { useT, useT as useDict } from "../../i18n";

const presets = (t:any)=>[

  { name: t("mode.photoreal.name"), desc:t("mode.photoreal.desc"), params:{ style:"raw", stylize:150 } },

  { name: t("mode.cinematic.name"), desc:t("mode.cinematic.desc"), params:{ style:"raw", stylize:300 } },

  { name: t("mode.niji.name"),      desc:t("mode.niji.desc"),      params:{ niji:true, style:"cute", stylize:250 } },

];

function Row({ name, desc, onPick }:{ name:string; desc:string; onPick:()=>void }) {

  return (

    <button type="button" onClick={onPick} className="w-full text-left border rounded-xl p-3 hover:bg-gray-50">

      <div className="font-medium">{name} <span className="text-gray-400">: {desc}</span></div>

    </button>

  );

}

export default function ModePresetStep({ onNext }:{ onNext?: ()=>void }) {

  const { t } = useT();

  const list = presets(t);

  const { setParams } = useBuilderStore();

  return (

    <div className="border rounded-2xl p-3 bg-white space-y-2">

      <div className="font-medium mb-2">{t("mode.label")}</div>

      {list.map(p=>(

        <Row key={p.name} name={p.name} desc={p.desc} onPick={()=>{ setParams(p.params); onNext?.(); }} />

      ))}

    </div>

  );

}