import { useBuilderStore } from "../../store/useBuilderStore";

import { useT } from "../../i18n";

const CAMERA = [

  { key:"low-angle",    desc:"Camera below subject (powerful/heroic)" },

  { key:"eye-level",    desc:"Natural eye-level perspective (neutral)" },

  { key:"high-angle",   desc:"Camera above subject (tiny/overview)" },

  { key:"35mm",         desc:"Wide environmental context" },

  { key:"85mm",         desc:"Portrait/subject isolation" },

  { key:"shallow depth of field", desc:"Blurred background to emphasize subject" },

];

const COMPOSE = [

  { key:"rule of thirds", desc:"Balanced, natural framing" },

  { key:"centered",       desc:"Strong/graphic center" },

  { key:"leading lines",  desc:"Lines guide the viewer's eye" },

  { key:"symmetry",       desc:"Formal, structured balance" },

  { key:"negative space", desc:"Use empty space to emphasize subject" },

];

const LIGHT = [

  { key:"soft diffused", desc:"Soft, even light" },

  { key:"rim light",     desc:"Edge highlight around subject" },

  { key:"backlight",     desc:"Silhouette/mood from behind" },

  { key:"neon",          desc:"Colorful neon lighting" },

  { key:"golden hour",   desc:"Warm sunset glow" },

];

function Row({ text, desc, onPick }:{ text:string; desc:string; onPick:()=>void }) {

  return (

    <button type="button" onClick={onPick} className="w-full text-left border rounded-xl p-3 hover:bg-gray-50">

      <div className="font-medium">{text} <span className="text-gray-400">: {desc}</span></div>

    </button>

  );

}

export default function CameraComposeLightStep({ onNext }:{ onNext: ()=>void }) {

  const { t } = useT();

  const { slots, setSlots } = useBuilderStore();

  function add(key:"camera"|"composition"|"lighting", v:string){

    const arr = new Set([...(slots[key]||[]), v]);

    setSlots({ [key]: Array.from(arr) } as any);

  }

  return (

    <div className="border rounded-2xl p-3 bg-white space-y-4">

      <div className="font-medium">{t("ccl.title")}</div>

      <section>

        <div className="text-sm font-medium mb-2">{t("ccl.camera")}</div>

        <div className="grid gap-2">

          {CAMERA.map(x=>(

            <Row key={x.key} text={x.key} desc={x.desc} onPick={()=>add("camera", x.key)} />

          ))}

        </div>

      </section>

      <section>

        <div className="text-sm font-medium mb-2">{t("ccl.composition")}</div>

        <div className="grid gap-2">

          {COMPOSE.map(x=>(

            <Row key={x.key} text={x.key} desc={x.desc} onPick={()=>add("composition", x.key)} />

          ))}

        </div>

      </section>

      <section>

        <div className="text-sm font-medium mb-2">{t("ccl.lighting")}</div>

        <div className="grid gap-2">

          {LIGHT.map(x=>(

            <Row key={x.key} text={x.key} desc={x.desc} onPick={()=>add("lighting", x.key)} />

          ))}

        </div>

      </section>

      <div className="flex justify-end">

        <button onClick={onNext} className="px-3 py-2 border rounded-xl">{t("common.next")}</button>

      </div>

    </div>

  );

}