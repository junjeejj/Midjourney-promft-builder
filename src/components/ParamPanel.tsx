import { useBuilderStore } from "../store/useBuilderStore";

import { AR_LIST } from "../lib/validators";

import { useT } from "../i18n";

function Field({ label, children, hint }:{label:string; children:any; hint?:string}) {

  return <label className="block">

    <div className="text-sm font-medium">{label}{hint && <span className="text-gray-400 text-xs"> : {hint}</span>}</div>

    {children}

  </label>;

}

export default function ParamPanel() {

  const { t } = useT();

  const { params, setParams } = useBuilderStore();

  return (

    <div className="border rounded-2xl p-3 bg-white">

      <div className="font-medium mb-2">{t("params.panel")}</div>

      <div className="grid md:grid-cols-3 gap-3">

        <Field label="Aspect (--ar)" hint="image ratio">

          <select className="w-full border rounded-xl px-3 py-2" value={params.ar||""} onChange={e=>setParams({ ar: e.target.value || null })}>

            <option value="">(none)</option>

            {AR_LIST.map(ar => <option key={ar}>{ar}</option>)}

          </select>

        </Field>

        <Field label="Style (--style)" hint="global style preset">

          <input className="w-full border rounded-xl px-3 py-2" value={params.style ?? ""} onChange={e=>setParams({ style: e.target.value || null })}/>

        </Field>

        <Field label="Seed (--seed)" hint="keep similar look">

          <input type="number" className="w-full border rounded-xl px-3 py-2" value={params.seed ?? ""} onChange={e=>setParams({ seed: e.target.value===""? null: Number(e.target.value) })}/>

        </Field>

        <Field label="Stylize (--stylize)" hint="style emphasis">

          <input type="number" min={0} max={1000} className="w-full border rounded-xl px-3 py-2"

            value={params.stylize ?? ""} onChange={e=>setParams({ stylize: e.target.value===""? null: Number(e.target.value) })}/>

        </Field>

        <Field label="Chaos (--chaos)" hint="randomness">

          <input type="number" min={0} max={100} className="w-full border rounded-xl px-3 py-2"

            value={params.chaos ?? ""} onChange={e=>setParams({ chaos: e.target.value===""? null: Number(e.target.value) })}/>

        </Field>

        <Field label="Quality (--q)" hint="0.5 / 1 / 2">

          <select className="w-full border rounded-xl px-3 py-2" value={(params.q as any) ?? ""} onChange={e=>setParams({ q: e.target.value===""? null: Number(e.target.value) as any })}>

            <option value="">(none)</option>

            <option value="0.5">0.5</option><option value="1">1</option><option value="2">2</option>

          </select>

        </Field>

      </div>

    </div>

  );

}