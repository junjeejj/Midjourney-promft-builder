import type { MJParams, Slots } from "../types";
import { useDefaults, type Defaults } from "../store/useDefaults";

export type Params = {
  ar?: string | null;
  stylize?: number | null;
  chaos?: number | null;
  q?: 0.5 | 1 | 2 | null;
  seed?: number | null;
  style?: string | null;
  tile?: boolean | null;
  niji?: boolean | null;
  sref?: string | null;
  cref?: string | null;
  no?: string[] | null;
  stop?: number | null;
  repeat?: number | null;
  version?: string | null;
  stealth?: boolean | null;
  oref?: string | null;
  ow?: number | null;
  profile?: string | null;
  iw?: number | null;
  weird?: number | null;
  draft?: boolean | null;
  raw?: boolean | null;
};

export function applyDefaultsToParams(
  current: Params = {},
  fromTemplate: Params = {},
  defaultsInput?: Defaults
): Params {
  const { defaults: storeDefaults, load } = useDefaults.getState();
  if (!defaultsInput) load();
  const base = defaultsInput || storeDefaults;
  const pick = <T,>(a?: T|null, b?: T|null, c?: T|null): T | null | undefined =>
    a ?? b ?? c ?? null;

  return {
    ar:      pick(current.ar,      fromTemplate.ar,      base.ar ?? null),
    style:   pick(current.style,   fromTemplate.style,   base.style ?? null),
    stylize: pick(current.stylize, fromTemplate.stylize, base.stylize ?? null) as any,
    chaos:   pick(current.chaos,   fromTemplate.chaos,   base.chaos ?? null) as any,
    q:       pick(current.q as any, fromTemplate.q as any, base.q as any) as any,
    seed:    current.seed ?? fromTemplate.seed ?? null,
    tile:    current.tile ?? fromTemplate.tile ?? null,
    niji:    current.niji ?? fromTemplate.niji ?? null,
    sref:    current.sref ?? fromTemplate.sref ?? null,
    cref:    current.cref ?? fromTemplate.cref ?? null,
    no:      current.no ?? fromTemplate.no ?? null,
    stop:    current.stop ?? fromTemplate.stop ?? null,
    repeat:  current.repeat ?? fromTemplate.repeat ?? null,
    version: current.version ?? fromTemplate.version ?? null,
    stealth: current.stealth ?? fromTemplate.stealth ?? null,
    oref:    current.oref ?? fromTemplate.oref ?? null,
    ow:      current.ow ?? fromTemplate.ow ?? null,
    profile: current.profile ?? fromTemplate.profile ?? null,
    iw:      current.iw ?? fromTemplate.iw ?? null,
    weird:   current.weird ?? fromTemplate.weird ?? null,
    draft:   current.draft ?? fromTemplate.draft ?? null,
    raw:     current.raw ?? fromTemplate.raw ?? null,
  };
}

export function buildPrompt(slots: Slots, params: Params) {
  const body = composeBody(slots);
  const tail = [
    params.ar ? `--ar ${params.ar}` : null,
    isNum(params.stylize) ? `--stylize ${params.stylize}` : null,
    isNum(params.chaos) ? `--chaos ${params.chaos}` : null,
    isNum(params.q) ? `--q ${params.q}` : null,
    isNum(params.seed) ? `--seed ${params.seed}` : null,
    params.style ? `--style ${params.style}` : null,
    params.tile ? `--tile` : null,
    params.niji ? `--niji` : null,
    params.sref ? `--sref ${params.sref}` : null,
    params.cref ? `--cref ${params.cref}` : null,
    params.no && params.no.length > 0 ? params.no.map(item => `--no ${item}`).join(" ") : null,
    isNum(params.stop) ? `--stop ${params.stop}` : null,
    isNum(params.repeat) ? `--repeat ${params.repeat}` : null,
    params.version ? `--v ${params.version}` : null,
    params.stealth ? `--stealth` : null,
    params.oref ? `--oref ${params.oref}` : null,
    isNum(params.ow) ? `--ow ${params.ow}` : null,
    params.profile ? `--profile ${params.profile}` : null,
    isNum(params.iw) ? `--iw ${params.iw}` : null,
    isNum(params.weird) ? `--weird ${params.weird}` : null,
    params.draft ? `--draft` : null,
    params.raw ? `--raw` : null,
  ].filter(Boolean).join(" ");
  return `/imagine prompt: ${body}${tail ? " " + tail : ""}`;
}

function composeBody(slots: Slots) {
  const p: string[] = [];
  if (slots.subject) p.push(String(slots.subject));
  for (const k of ["camera","composition","lighting","color","style","background"] as const) {
    const arr = Array.isArray(slots[k]) ? slots[k] : [];
    if (arr.length) p.push(arr.join(", "));
  }
  return p.join(", ");
}
function isNum(v:any){ return typeof v==="number" && !Number.isNaN(v); }

