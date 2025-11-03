import { useState } from "react";

import Stepper from "../components/Stepper";

import AspectStep from "../components/steps/AspectStep";

import ModePresetStep from "../components/steps/ModePresetStep";

import SubjectStep from "../components/steps/SubjectStep";

import CameraComposeLightStep from "../components/steps/CameraComposeLightStep";

import QualityStep from "../components/steps/QualityStep";

import PreviewPanel from "../components/PreviewPanel";

import SelectedSummary from "../components/SelectedSummary";

import ParamPanel from "../components/ParamPanel";

import FinalPromptPanel from "../components/FinalPromptPanel";

import { useT } from "../i18n";

export default function PromptBuilderPage() {

  const { t } = useT();

  const STEPS = [

    { key:"aspect",  label:t("steps.aspect") },

    { key:"mode",    label:t("steps.mode") },

    { key:"subject", label:t("steps.subject") },

    { key:"ccl",     label:t("steps.ccl") },

    { key:"quality", label:t("steps.quality") },

    { key:"preview", label:t("steps.preview") },

  ];

  const [i, setI] = useState(0);

  const next = ()=> setI(s=> Math.min(s+1, STEPS.length-1));

  return (

    <main className="mx-auto max-w-6xl p-4 space-y-4">

      <Stepper steps={STEPS} active={i} onStepClick={setI} />

      <div className="grid md:grid-cols-[1fr,380px] gap-4">

        <div className="space-y-4">

          {i===0 && <AspectStep onNext={next} />}

          {i===1 && <ModePresetStep onNext={next} />}

          {i===2 && <SubjectStep onNext={next} />}

          {i===3 && <CameraComposeLightStep onNext={next} />}

          {i===4 && <QualityStep onNext={next} />}

          {i===5 && (

            <div className="border rounded-2xl p-3 bg-white">

              <div className="font-medium">{t("steps.preview")}</div>

              <div className="text-sm text-gray-600">{t("final.helper")}</div>

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