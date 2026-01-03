import { useState } from "react";

import { useBuilderStore } from "../store/useBuilderStore";

import { AR_LIST } from "../lib/validators";

import { useT } from "../i18n";

function Field({ label, children, hint }:{label:string; children:any; hint?:string}) {

  return <label className="block">

    <div className="text-sm font-medium">{label}{hint && <span className="text-gray-400 text-xs"> : {hint}</span>}</div>

    {children}

  </label>;

}

function SliderField({ label, min, max, step, value, onChange, hint }:{label:string; min:number; max:number; step?:number; value:number; onChange:(v:number)=>void; hint?:string}) {

  return (

    <Field label={label} hint={hint}>

      <div className="space-y-1">

        <input 

          type="range" 

          min={min} 

          max={max} 

          step={step ?? 1}

          className="w-full"

          value={value}

          onChange={e=>onChange(Number(e.target.value))}

        />

        <div className="text-xs text-gray-600 text-center">{t("params.currentValue")}: {value}</div>

      </div>

    </Field>

  );

}

function CheckboxField({ label, checked, onChange, hint }:{label:string; checked:boolean; onChange:(v:boolean)=>void; hint?:string}) {

  return (

    <label className="flex items-center gap-2 cursor-pointer">

      <input 

        type="checkbox"

        checked={checked}

        onChange={e=>onChange(e.target.checked)}

        className="w-4 h-4"

      />

      <div className="text-sm font-medium">{label}{hint && <span className="text-gray-400 text-xs"> : {hint}</span>}</div>

    </label>

  );

}

export default function ParamPanel() {

  const { t } = useT();

  const { params, setParams } = useBuilderStore();

  const [noInput, setNoInput] = useState("");

  const addNoItem = () => {

    if (!noInput.trim()) return;

    const current = params.no || [];

    if (!current.includes(noInput.trim())) {

      setParams({ no: [...current, noInput.trim()] });

    }

    setNoInput("");

  };

  const removeNoItem = (item: string) => {

    const current = params.no || [];

    setParams({ no: current.filter(x => x !== item) });

  };

  return (

    <div className="border rounded-2xl p-3 bg-white space-y-4">

      <div className="font-medium mb-2">{t("params.panel")}</div>

      <div className="space-y-4">

        <Field label="Aspect (--ar)" hint={t("params.arHint")}>

          <select className="w-full border rounded-xl px-3 py-2" value={params.ar||""} onChange={e=>setParams({ ar: e.target.value || null })}>

            <option value="">(none)</option>

            {AR_LIST.map(ar => <option key={ar}>{ar}</option>)}

          </select>

        </Field>

        <SliderField 

          label="Stylize (--stylize)" 

          min={0} 

          max={1000} 

          value={params.stylize ?? 100}

          onChange={v=>setParams({ stylize: v })}

          hint={t("params.stylizeHint")}

        />

        <SliderField 

          label="Chaos (--chaos)" 

          min={0} 

          max={100} 

          value={params.chaos ?? 0}

          onChange={v=>setParams({ chaos: v })}

          hint={t("params.chaosHint")}

        />

        <SliderField 

          label="Quality (--q)" 

          min={0.5} 

          max={2} 

          step={0.5}

          value={params.q ?? 1}

          onChange={v=>setParams({ q: v as 0.5 | 1 | 2 })}

          hint={t("params.qHint")}

        />

        <SliderField 

          label="Stop (--stop)" 

          min={0} 

          max={100} 

          value={params.stop ?? 0}

          onChange={v=>setParams({ stop: v })}

          hint={t("params.stopHint")}

        />

        <SliderField 

          label="Seed (--seed)" 

          min={0} 

          max={999999999} 

          value={params.seed ?? 0}

          onChange={v=>setParams({ seed: v })}

          hint={t("params.seedHint")}

        />

        <SliderField 

          label="Repeat (--repeat)" 

          min={1} 

          max={40} 

          value={params.repeat ?? 1}

          onChange={v=>setParams({ repeat: v })}

          hint={t("params.repeatHint")}

        />

        <SliderField 

          label="Weird (--weird)" 

          min={0} 

          max={3000} 

          value={params.weird ?? 0}

          onChange={v=>setParams({ weird: v })}

          hint={t("params.weirdHint")}

        />

        <SliderField 

          label="Omni Weight (--ow)" 

          min={0} 

          max={1000} 

          value={params.ow ?? 100}

          onChange={v=>setParams({ ow: v })}

          hint={t("params.owHint")}

        />

        <SliderField 

          label="Image Weight (--iw)" 

          min={0} 

          max={3} 

          step={0.1}

          value={params.iw ?? 1}

          onChange={v=>setParams({ iw: v })}

          hint={t("params.iwHint")}

        />

        <Field label="Version (--v)" hint={t("params.versionHint")}>

          <input 

            type="text" 

            className="w-full border rounded-xl px-3 py-2" 

            value={params.version || ""} 

            placeholder={t("params.versionPlaceholder")}

            onChange={e=>setParams({ version: e.target.value || null })}

          />

        </Field>

        <Field label="Style (--style)" hint={t("params.styleHint")}>

          <input className="w-full border rounded-xl px-3 py-2" value={params.style ?? ""} onChange={e=>setParams({ style: e.target.value || null })}/>

        </Field>

        <Field label="Style Reference (--sref)" hint={t("params.srefHint")}>

          <input 

            type="text" 

            className="w-full border rounded-xl px-3 py-2" 

            value={params.sref || ""} 

            placeholder={t("params.imageUrlPlaceholder")}

            onChange={e=>setParams({ sref: e.target.value || null })}

          />

        </Field>

        <Field label="Omni Reference (--oref)" hint={t("params.orefHint")}>

          <input 

            type="text" 

            className="w-full border rounded-xl px-3 py-2" 

            value={params.oref || ""} 

            placeholder={t("params.imageUrlPlaceholder")}

            onChange={e=>setParams({ oref: e.target.value || null })}

          />

        </Field>

        <Field label="Profile (--p)" hint={t("params.profileHint")}>

          <input 

            type="text" 

            className="w-full border rounded-xl px-3 py-2" 

            value={params.profile || ""} 

            placeholder={t("params.profilePlaceholder")}

            onChange={e=>setParams({ profile: e.target.value || null })}

          />

        </Field>

        <Field label="No (--no)" hint={t("params.noHint")}>

          <div className="flex gap-2 mb-2">

            <input

              type="text"

              className="flex-1 border rounded-lg px-3 py-2 text-sm"

              placeholder={t("params.noPlaceholder")}

              value={noInput}

              onChange={e => setNoInput(e.target.value)}

              onKeyPress={(e) => e.key === "Enter" && addNoItem()}

            />

            <button onClick={addNoItem} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm">{t("params.addButton")}</button>

          </div>

          {params.no && params.no.length > 0 && (

            <div className="flex flex-wrap gap-2">

              {params.no.map((item) => (

                <span key={item} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-1">

                  {item}

                  <button onClick={() => removeNoItem(item)} className="text-red-500">×</button>

                </span>

              ))}

            </div>

          )}

        </Field>

        <div className="space-y-2">

          <CheckboxField 

            label="Tile (--tile)" 

            checked={params.tile ?? false}

            onChange={v=>setParams({ tile: v })}

            hint={t("params.tileHint")}

          />

          <CheckboxField 

            label="Raw (--raw)" 

            checked={params.raw ?? false}

            onChange={v=>setParams({ raw: v })}

            hint={t("params.rawHint")}

          />

          <CheckboxField 

            label="Stealth (--stealth)" 

            checked={params.stealth ?? false}

            onChange={v=>setParams({ stealth: v })}

            hint={t("params.stealthHint")}

          />

          <CheckboxField 

            label="Draft (--draft)" 

            checked={params.draft ?? false}

            onChange={v=>setParams({ draft: v })}

            hint={t("params.draftHint")}

          />

          <CheckboxField 

            label="Niji (--niji)" 

            checked={params.niji ?? false}

            onChange={v=>setParams({ niji: v })}

            hint={t("params.nijiHint")}

          />

        </div>

      </div>

    </div>

  );

}