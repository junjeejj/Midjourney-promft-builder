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

export default function QualityStep({ onNext }:{ onNext?: ()=>void }) {

  const { t } = useT();

  const { params, setParams } = useBuilderStore();

  return (

    <div className="border rounded-2xl p-3 bg-white space-y-3">

      <div className="font-medium">{t("quality.title")}</div>

      <div className="grid sm:grid-cols-3 gap-3">

        <FieldRow label={t("quality.stylize")} desc={t("quality.stylizeHint")}>

          <div className="space-y-1">

            <input 

              type="range" 

              min={0} 

              max={1000} 

              className="w-full"

              value={params.stylize ?? 100}

              onChange={e=>setParams({ stylize: Number(e.target.value) })}

            />

            <div className="text-xs text-gray-600 text-center">현재 값: {params.stylize ?? 100}</div>

          </div>

        </FieldRow>

        <FieldRow label={t("quality.chaos")} desc={t("quality.chaosHint")}>

          <div className="space-y-1">

            <input 

              type="range" 

              min={0} 

              max={100} 

              className="w-full"

              value={params.chaos ?? 0}

              onChange={e=>setParams({ chaos: Number(e.target.value) })}

            />

            <div className="text-xs text-gray-600 text-center">현재 값: {params.chaos ?? 0}</div>

          </div>

        </FieldRow>

        <FieldRow label={t("quality.q")} desc={t("quality.qHint")}>

          <div className="space-y-1">

            <input 

              type="range" 

              min={0.5} 

              max={2} 

              step={0.5}

              className="w-full"

              value={params.q ?? 1}

              onChange={e=>setParams({ q: Number(e.target.value) as 0.5 | 1 | 2 })}

            />

            <div className="text-xs text-gray-600 text-center">현재 값: {params.q ?? 1}</div>

          </div>

        </FieldRow>

      </div>

      <div className="flex justify-end mt-1"><button onClick={()=>onNext?.()} className="px-3 py-2 border rounded-xl">{t("quality.next")}</button></div>

    </div>

  );

}