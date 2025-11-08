// src/pages/Builder.tsx

import { useState } from "react";

import Stepper, { Step } from "../components/Stepper";

import AspectStep from "../components/steps/AspectStep";
import ModePresetStep from "../components/steps/ModePresetStep";
import SubjectStep from "../components/steps/SubjectStep";
import CameraComposeLightStep from "../components/steps/CameraComposeLightStep";
import QualityStep from "../components/steps/QualityStep";
import PreviewPanel from "../components/PreviewPanel";
import SelectedSummary from "../components/SelectedSummary";
import ParamPanel from "../components/ParamPanel";

export default function Builder(){

  const steps: Step[] = [

    { key:"aspect",  label:"Aspect" },

    { key:"mode",    label:"Mode" },

    { key:"subject", label:"Subject" },

    { key:"ccl",     label:"Camera/Composition/Lighting" },

    { key:"quality", label:"Quality" },

    { key:"preview", label:"Preview" },

  ];

  const [i, setI] = useState(0);

  const next = ()=> setI(s=> Math.min(s+1, steps.length-1));

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <Stepper steps={steps} active={i} onStepClick={setI} />
      <PreviewPanel />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),360px]">
        <div className="space-y-4">
          {i===0 && <AspectStep onNext={next} />}
          {i===1 && <ModePresetStep onNext={next} />}
          {i===2 && <SubjectStep onNext={next} />}
          {i===3 && <CameraComposeLightStep onNext={next} />}
          {i===4 && <QualityStep onNext={next} />}
          {i===5 && (
            <div className="space-y-2 rounded-2xl border bg-white p-4">
              <div className="font-medium">Preview</div>
              <p className="text-sm text-gray-600">
                오른쪽 요약/파라미터 패널을 참고해 최종 프롬프트를 확인하세요.
              </p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <SelectedSummary />
          <ParamPanel />
        </div>
      </div>
    </main>
  );

}