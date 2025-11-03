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

import FinalPromptPanel from "../components/FinalPromptPanel";

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

    <main className="mx-auto max-w-6xl p-4 space-y-4">

      <Stepper steps={steps} active={i} onStepClick={setI} />

      <div className="grid md:grid-cols-[1fr,380px] gap-4">

        <div className="space-y-4">

          {i===0 && <AspectStep onNext={next} />}

          {i===1 && <ModePresetStep onNext={next} />}

          {i===2 && <SubjectStep onNext={next} />}

          {i===3 && <CameraComposeLightStep onNext={next} />}

          {i===4 && <QualityStep onNext={next} />}

          {i===5 && (

            <div className="border rounded-2xl p-3 bg-white">

              <div className="font-medium">Preview</div>

              <div className="text-sm text-gray-600">

                Use the right side to copy the final prompt or tweak parameters.

              </div>

            </div>

          )}

        </div>

        <div className="space-y-4">

          <PreviewPanel />

          <SelectedSummary />

          <FinalPromptPanel />

          <ParamPanel />

        </div>

      </div>

    </main>

  );

}