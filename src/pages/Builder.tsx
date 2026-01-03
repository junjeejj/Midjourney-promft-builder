// src/pages/Builder.tsx

import { useState } from "react";

import Stepper, { Step } from "../components/Stepper";

import AspectStep from "../components/steps/AspectStep";
import ModePresetStep from "../components/steps/ModePresetStep";
import SubjectStep from "../components/steps/SubjectStep";
import CameraComposeLightStep from "../components/steps/CameraComposeLightStep";
import QualityStep from "../components/steps/QualityStep";
import PreviewPanel from "../components/PreviewPanel";
import SideBar from "../components/SideBar";
import SelectedSummary from "../components/SelectedSummary";
import ParamPanel from "../components/ParamPanel";
import UserInfo from "../components/UserInfo";
import { useT } from "../i18n";

export default function Builder(){

  const { t } = useT();

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
    <main className="flex h-[calc(100vh-120px)]">
      {/* 왼쪽 사이드바 */}
      <div className="w-96 flex-shrink-0">
        <SideBar />
      </div>

      {/* 중앙 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-4 p-4">
          <Stepper steps={steps} active={i} onStepClick={setI} />
          <PreviewPanel />
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
                  {t("builder.previewHelper")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div className="w-96 flex-shrink-0 border-l bg-white overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* 사용자 정보 및 크레딧 (맨 위) */}
          <UserInfo />
          <SelectedSummary />
          <ParamPanel />
        </div>
      </div>
    </main>
  );

}