import { useState } from "react";

import { useBuilderStore } from "../../store/useBuilderStore";

import { useT } from "../../i18n";

export default function SubjectStep({ onNext }:{ onNext: ()=>void }) {

  const { t } = useT();

  const { slots, setSlots } = useBuilderStore();

  const [v, setV] = useState(slots.subject || "");

  function go(){ setSlots({ subject: v }); onNext(); }

  return (

    <div className="border rounded-2xl p-3 bg-white">

      <div className="font-medium mb-2">{t("subject.label")}</div>

      <input

        className="w-full border rounded-xl px-3 py-2"

        placeholder={t("subject.placeholder")}

        value={v}

        onChange={e=>setV(e.target.value)}

        onKeyDown={(e)=>{ if(e.key==="Enter") go(); }}

      />

      <div className="flex justify-end mt-3"><button onClick={go} className="px-3 py-2 border rounded-xl">{t("common.next")}</button></div>

    </div>

  );

}