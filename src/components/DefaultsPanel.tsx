import React, { useEffect, useState } from "react";
import { useDefaults } from "../store/useDefaults";

export default function DefaultsPanel({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const { defaults, load, save, reset } = useDefaults();
  const [presetName, setPresetName] = useState<string>("");
  
  // 필수 컨트롤
  const [ar, setAr] = useState<string | "">("");
  const [stylize, setStylize] = useState<number>(100);
  const [chaos, setChaos] = useState<number>(0);
  const [q, setQ] = useState<0.5 | 1 | 2 | "">("");
  const [no, setNo] = useState<string>("");
  const [noList, setNoList] = useState<string[]>([]);
  const [seed, setSeed] = useState<number | "">("");
  const [stop, setStop] = useState<number>(0);
  const [version, setVersion] = useState<string | "">("");
  
  // 스타일/일관성
  const [style, setStyle] = useState<string | "">("");
  const [sref, setSref] = useState<string | "">("");
  const [oref, setOref] = useState<string | "">("");
  const [ow, setOw] = useState<number>(100);
  const [iw, setIw] = useState<number>(1);
  const [profile, setProfile] = useState<string | "">("");
  
  // 생산성
  const [repeat, setRepeat] = useState<number>(1);
  
  // 실험적
  const [weird, setWeird] = useState<number>(0);
  
  // 모드/옵션
  const [tile, setTile] = useState<boolean>(false);
  const [niji, setNiji] = useState<boolean>(false);
  const [raw, setRaw] = useState<boolean>(false);
  const [stealth, setStealth] = useState<boolean>(false);
  const [draft, setDraft] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      load();
      setAr(defaults.ar || "");
      setStylize(defaults.stylize ?? 100);
      setChaos(defaults.chaos ?? 0);
      setQ((defaults.q as any) ?? "");
      setNoList(defaults.no || []);
      setSeed(defaults.seed ?? "");
      setStop(defaults.stop ?? 0);
      setVersion(defaults.version || "");
      setStyle(defaults.style || "");
      setSref(defaults.sref || "");
      setOref(defaults.oref || "");
      setOw(defaults.ow ?? 100);
      setIw(defaults.iw ?? 1);
      setProfile(defaults.profile || "");
      setRepeat(defaults.repeat ?? 1);
      setWeird(defaults.weird ?? 0);
      setTile(defaults.tile ?? false);
      setNiji(defaults.niji ?? false);
      setRaw(defaults.raw ?? false);
      setStealth(defaults.stealth ?? false);
      setDraft(defaults.draft ?? false);
    }
  }, [open, defaults]);

  const addNoItem = () => {
    if (!no.trim() || noList.includes(no.trim())) return;
    setNoList([...noList, no.trim()]);
    setNo("");
  };

  const removeNoItem = (item: string) => {
    setNoList(noList.filter(x => x !== item));
  };

  const handleSave = () => {
    if (!presetName.trim()) {
      alert("설정 이름을 입력해주세요.");
      return;
    }
    
    // 현재는 이름과 함께 기본설정을 저장
    // 나중에 여러 개의 설정을 저장할 수 있도록 확장 가능
    const settingsData = {
      name: presetName.trim(),
      settings: {
        ar: ar || null,
        style: style || null,
        stylize: stylize,
        chaos: chaos,
        q: (q === "" ? null : q as any),
        seed: seed === "" ? null : Number(seed),
        tile: tile || null,
        niji: niji || null,
        sref: sref || null,
        oref: oref || null,
        no: noList.length > 0 ? noList : null,
        stop: stop || null,
        repeat: repeat || null,
        version: version || null,
        stealth: stealth || null,
        ow: ow,
        profile: profile || null,
        iw: iw,
        weird: weird || null,
        draft: draft || null,
        raw: raw || null,
      },
    };
    
    // 현재는 기본설정으로 바로 저장 (나중에 여러 개 저장 기능 추가 예정)
    save(settingsData.settings);
    
    // 이름도 함께 저장 (나중에 사용)
    try {
      localStorage.setItem(`mj.defaults.name.${presetName.trim()}`, JSON.stringify(settingsData));
    } catch {}
    
    alert(`"${presetName.trim()}" 설정이 저장되었습니다.`);
    setPresetName("");
    onClose();
  };

  const handleReset = () => {
    reset();
    setAr("");
    setStyle("");
    setStylize(100);
    setChaos(0);
    setQ("");
    setNoList([]);
    setSeed("");
    setStop(0);
    setVersion("");
    setSref("");
    setOref("");
    setOw(100);
    setIw(1);
    setProfile("");
    setRepeat(1);
    setWeird(0);
    setTile(false);
    setNiji(false);
    setRaw(false);
    setStealth(false);
    setDraft(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col">
        {/* 상단 고정 헤더 및 저장 버튼 */}
        <div className="sticky top-0 bg-white border-b p-5 z-10 shadow-sm">
          <div className="text-lg font-semibold mb-2">기본설정 저장</div>
          <p className="text-sm text-gray-500 mb-4">여기서 저장한 값은 템플릿/빌더에 자동 반영됩니다.</p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">설정 이름</label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="예: 내 기본 설정, 작업용 설정"
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!presetName.trim()}
                className="flex-1 px-4 py-2 border rounded-xl bg-black text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                저장
              </button>
              <button onClick={handleReset} className="px-4 py-2 border rounded-xl">
                초기화
              </button>
              <button onClick={onClose} className="px-4 py-2 border rounded-xl">
                닫기
              </button>
            </div>
          </div>
        </div>
        
        {/* 스크롤 가능한 설정 내용 */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-6">
          {/* 필수 컨트롤 */}
          <div>
            <div className="font-medium text-base border-b pb-2 mb-3">필수 컨트롤</div>
            <div className="space-y-4">
              <Field label="Aspect (--ar)">
                <select className="w-full border rounded-xl px-3 py-2" value={ar} onChange={e=>setAr(e.target.value)}>
                  <option value="">(선택 안 함)</option>
                  <option>1:1</option><option>3:2</option><option>2:3</option>
                  <option>16:9</option><option>9:16</option><option>21:9</option>
                </select>
              </Field>

              <Field label="Stylize (--stylize) (0-1000)">
                <input type="range" min={0} max={1000} value={stylize} onChange={e=>setStylize(Number(e.target.value))} className="w-full"/>
                <div className="text-sm text-gray-600 mt-1">현재 값: {stylize}</div>
              </Field>

              <Field label="Chaos (--chaos) (0-100)">
                <input type="range" min={0} max={100} value={chaos} onChange={e=>setChaos(Number(e.target.value))} className="w-full"/>
                <div className="text-sm text-gray-600 mt-1">현재 값: {chaos}</div>
              </Field>

              <Field label="Quality (--q)">
                <select className="w-full border rounded-xl px-3 py-2" value={q} onChange={e=>setQ((e.target.value===""? "" : Number(e.target.value)) as any)}>
                  <option value="">(선택 안 함)</option>
                  <option value="0.25">0.25</option>
                  <option value="0.5">0.5</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </Field>

              <Field label="No (--no) - 빼고 싶은 요소">
                <div className="flex gap-2 mb-2">
                  <input type="text" className="flex-1 border rounded-xl px-3 py-2 text-sm" placeholder="예: text, watermark" value={no} onChange={e=>setNo(e.target.value)} onKeyPress={e=>e.key==="Enter" && addNoItem()}/>
                  <button onClick={addNoItem} className="px-3 py-2 bg-blue-500 text-white rounded-xl text-sm">추가</button>
                </div>
                {noList.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {noList.map(item => (
                      <span key={item} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-1">
                        {item}
                        <button onClick={()=>removeNoItem(item)} className="text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Seed (--seed)">
                <input type="number" className="w-full border rounded-xl px-3 py-2" value={seed} onChange={e=>setSeed(e.target.value===""? "" : Number(e.target.value))}/>
              </Field>

              <Field label="Stop (--stop) (0-100)">
                <input type="range" min={0} max={100} value={stop} onChange={e=>setStop(Number(e.target.value))} className="w-full"/>
                <div className="text-sm text-gray-600 mt-1">현재 값: {stop}</div>
              </Field>

              <Field label="Version (--v)">
                <input type="text" className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="예: 5, 5.1, 6, 6.1, 7" value={version} onChange={e=>setVersion(e.target.value)}/>
              </Field>
            </div>
          </div>

          {/* 스타일/일관성 */}
          <div>
            <div className="font-medium text-base border-b pb-2 mb-3">스타일/일관성</div>
            <div className="space-y-4">
              {/* Style (--style) - V5 등 구버전에서만 표시 */}
              {(() => {
                const ver = version || "";
                // v5 계열 또는 niji 계열일 때만 --style을 보여주자
                const lower = ver.toLowerCase();
                const isLegacyVersion =
                  lower.includes("v5") ||
                  lower.startsWith("5") ||
                  lower.startsWith("5.") ||
                  lower.includes("niji");
                
                if (!isLegacyVersion) return null;
                
                return (
                  <Field label="Style (--style) (구버전 전용)">
                    <input className="w-full border rounded-xl px-3 py-2" placeholder="raw / cute / ..." value={style} onChange={e=>setStyle(e.target.value)}/>
                  </Field>
                );
              })()}

              <Field label="Style Reference (--sref)">
                <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="이미지 URL 또는 스타일 코드" value={sref} onChange={e=>setSref(e.target.value)}/>
              </Field>

              <Field label="Omni Reference (--oref)">
                <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="이미지 URL" value={oref} onChange={e=>setOref(e.target.value)}/>
              </Field>

              <Field label="Omni Weight (--ow) (0-1000)">
                <input type="range" min={0} max={1000} value={ow} onChange={e=>setOw(Number(e.target.value))} className="w-full"/>
                <div className="text-sm text-gray-600 mt-1">현재 값: {ow}</div>
              </Field>

              <Field label="Image Weight (--iw) (0-3)">
                <input type="range" min={0} max={3} step={0.1} value={iw} onChange={e=>setIw(Number(e.target.value))} className="w-full"/>
                <div className="text-sm text-gray-600 mt-1">현재 값: {iw}</div>
              </Field>

              <Field label="Profile (--p)">
                <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="프로필 이름" value={profile} onChange={e=>setProfile(e.target.value)}/>
              </Field>
            </div>
          </div>

          {/* 생산성 */}
          <div>
            <div className="font-medium text-base border-b pb-2 mb-3">생산성</div>
            <div className="space-y-4">
              <Field label="Repeat (--repeat) (0-40)">
                <input type="range" min={0} max={40} value={repeat} onChange={e=>setRepeat(Number(e.target.value))} className="w-full"/>
                <div className="text-sm text-gray-600 mt-1">현재 값: {repeat}</div>
              </Field>
            </div>
          </div>

          {/* 실험적 */}
          <div>
            <div className="font-medium text-base border-b pb-2 mb-3">실험적</div>
            <div className="space-y-4">
              <Field label="Weird (--weird) (0-3000)">
                <input type="range" min={0} max={3000} value={weird} onChange={e=>setWeird(Number(e.target.value))} className="w-full"/>
                <div className="text-sm text-gray-600 mt-1">현재 값: {weird}</div>
              </Field>
            </div>
          </div>

          {/* 모드/옵션 */}
          <div>
            <div className="font-medium text-base border-b pb-2 mb-3">모드/옵션</div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={tile} onChange={e=>setTile(e.target.checked)} className="w-4 h-4"/>
                <span className="text-sm font-semibold">Tile (--tile)</span>
                <span className="text-xs text-gray-600">- 무한 반복 패턴</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={niji} onChange={e=>setNiji(e.target.checked)} className="w-4 h-4"/>
                <span className="text-sm font-semibold">Niji (--niji)</span>
                <span className="text-xs text-gray-600">- 애니메이션 스타일 모드</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={raw} onChange={e=>setRaw(e.target.checked)} className="w-4 h-4"/>
                <span className="text-sm font-semibold">Raw (--raw)</span>
                <span className="text-xs text-gray-600">- 기본 미드저니 스타일 약화</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={stealth} onChange={e=>setStealth(e.target.checked)} className="w-4 h-4"/>
                <span className="text-sm font-semibold">Stealth (--stealth)</span>
                <span className="text-xs text-gray-600">- 웹 갤러리 비공개</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draft} onChange={e=>setDraft(e.target.checked)} className="w-4 h-4"/>
                <span className="text-sm font-semibold">Draft (--draft)</span>
                <span className="text-xs text-gray-600">- 빠른 러프 컨셉 드로잉 모드</span>
              </label>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }:{label:string; children:any}) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-1">{label}</div>
      {children}
    </label>
  );
}
