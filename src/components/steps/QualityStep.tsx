import { useBuilderStore } from "../../store/useBuilderStore";

import { useT } from "../../i18n";

function FieldRow({ label, desc, children }:{label:string; desc:string; children:any}){

  return (

    <label className="block">

      <div className="text-sm font-medium">{label} <span className="text-gray-400 text-xs">: {desc}</span></div>

      {children}

    </label>

  );

}

export default function QualityStep({ onNext }:{ onNext: ()=>void }) {

  const { t } = useT();

  const { params, setParams } = useBuilderStore();

  return (

    <div className="border rounded-2xl p-3 bg-white space-y-3">

      <div className="font-medium">{t("quality.title")}</div>

      <div className="grid sm:grid-cols-3 gap-3">

        <FieldRow label={t("quality.stylize")} desc={t("quality.stylizeHint")}>

          <input type="number" min={0} max={1000} className="w-full border rounded-xl px-3 py-2"

            value={params.stylize ?? ""} onChange={e=>setParams({ stylize: e.target.value===""? null: Number(e.target.value) })}/>

        </FieldRow>

        <FieldRow label={t("quality.chaos")} desc={t("quality.chaosHint")}>

          <input type="number" min={0} max={100} className="w-full border rounded-xl px-3 py-2"

            value={params.chaos ?? ""} onChange={e=>setParams({ chaos: e.target.value===""? null: Number(e.target.value) })}/>

        </FieldRow>

        <FieldRow label={t("quality.q")} desc={t("quality.qHint")}>

          <select className="w-full border rounded-xl px-3 py-2" value={(params.q as any) ?? ""} onChange={e=>setParams({ q: e.target.value===""? null: Number(e.target.value) as any })}>

            <option value="">(none)</option>

            <option value="0.5">0.5</option><option value="1">1</option><option value="2">2</option>

          </select>

        </FieldRow>

      </div>

      <div className="flex justify-end mt-1"><button onClick={onNext} className="px-3 py-2 border rounded-xl">{t("quality.next")}</button></div>

    </div>

  );

}