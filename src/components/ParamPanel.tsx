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

        <div className="text-xs text-gray-600 text-center">현재 값: {value}</div>

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

        <Field label="Aspect (--ar)" hint="image ratio">

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

          hint="style emphasis"

        />

        <SliderField 

          label="Chaos (--chaos)" 

          min={0} 

          max={100} 

          value={params.chaos ?? 0}

          onChange={v=>setParams({ chaos: v })}

          hint="randomness"

        />

        <SliderField 

          label="Quality (--q)" 

          min={0.5} 

          max={2} 

          step={0.5}

          value={params.q ?? 1}

          onChange={v=>setParams({ q: v as 0.5 | 1 | 2 })}

          hint="0.5 / 1 / 2"

        />

        <SliderField 

          label="Stop (--stop)" 

          min={0} 

          max={100} 

          value={params.stop ?? 0}

          onChange={v=>setParams({ stop: v })}

          hint="중간 렌더 멈추기"

        />

        <SliderField 

          label="Seed (--seed)" 

          min={0} 

          max={999999999} 

          value={params.seed ?? 0}

          onChange={v=>setParams({ seed: v })}

          hint="keep similar look"

        />

        <SliderField 

          label="Repeat (--repeat)" 

          min={1} 

          max={40} 

          value={params.repeat ?? 1}

          onChange={v=>setParams({ repeat: v })}

          hint="한 번에 여러 장 생성"

        />

        <SliderField 

          label="Weird (--weird)" 

          min={0} 

          max={3000} 

          value={params.weird ?? 0}

          onChange={v=>setParams({ weird: v })}

          hint="실험적/기묘한 해석"

        />

        <SliderField 

          label="Omni Weight (--ow)" 

          min={0} 

          max={1000} 

          value={params.ow ?? 100}

          onChange={v=>setParams({ ow: v })}

          hint="레퍼런스 강도"

        />

        <SliderField 

          label="Image Weight (--iw)" 

          min={0} 

          max={3} 

          step={0.1}

          value={params.iw ?? 1}

          onChange={v=>setParams({ iw: v })}

          hint="이미지 프롬프트 영향력"

        />

        <Field label="Version (--v)" hint="모델 버전 직접 입력">

          <input 

            type="text" 

            className="w-full border rounded-xl px-3 py-2" 

            value={params.version || ""} 

            placeholder="예: 5, 5.1, 6, 7"

            onChange={e=>setParams({ version: e.target.value || null })}

          />

        </Field>

        <Field label="Style (--style)" hint="global style preset">

          <input className="w-full border rounded-xl px-3 py-2" value={params.style ?? ""} onChange={e=>setParams({ style: e.target.value || null })}/>

        </Field>

        <Field label="Style Reference (--sref)" hint="스타일 레퍼런스 이미지 URL">

          <input 

            type="text" 

            className="w-full border rounded-xl px-3 py-2" 

            value={params.sref || ""} 

            placeholder="이미지 URL"

            onChange={e=>setParams({ sref: e.target.value || null })}

          />

        </Field>

        <Field label="Omni Reference (--oref)" hint="특정 인물/오브젝트 일관성 유지">

          <input 

            type="text" 

            className="w-full border rounded-xl px-3 py-2" 

            value={params.oref || ""} 

            placeholder="이미지 URL"

            onChange={e=>setParams({ oref: e.target.value || null })}

          />

        </Field>

        <Field label="Profile (--p)" hint="개인/브랜드 스타일 프로필">

          <input 

            type="text" 

            className="w-full border rounded-xl px-3 py-2" 

            value={params.profile || ""} 

            placeholder="프로필 이름"

            onChange={e=>setParams({ profile: e.target.value || null })}

          />

        </Field>

        <Field label="No (--no)" hint="빼고 싶은 요소 강제 제외">

          <div className="flex gap-2 mb-2">

            <input

              type="text"

              className="flex-1 border rounded-lg px-3 py-2 text-sm"

              placeholder="예: text, watermark, people"

              value={noInput}

              onChange={e => setNoInput(e.target.value)}

              onKeyPress={(e) => e.key === "Enter" && addNoItem()}

            />

            <button onClick={addNoItem} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm">추가</button>

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

            hint="무한 반복 패턴"

          />

          <CheckboxField 

            label="Raw (--raw)" 

            checked={params.raw ?? false}

            onChange={v=>setParams({ raw: v })}

            hint="기본 미드저니 스타일 약화"

          />

          <CheckboxField 

            label="Stealth (--stealth)" 

            checked={params.stealth ?? false}

            onChange={v=>setParams({ stealth: v })}

            hint="웹 갤러리 비공개"

          />

          <CheckboxField 

            label="Draft (--draft)" 

            checked={params.draft ?? false}

            onChange={v=>setParams({ draft: v })}

            hint="빠른 러프 컨셉 드로잉 모드"

          />

          <CheckboxField 

            label="Niji (--niji)" 

            checked={params.niji ?? false}

            onChange={v=>setParams({ niji: v })}

            hint="애니메이션 스타일 모드"

          />

        </div>

      </div>

    </div>

  );

}