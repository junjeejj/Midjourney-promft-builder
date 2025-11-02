import React from "react";
import { useBuilderStore } from "../store/useBuilderStore";
import Stepper from "../components/Stepper";
import PreviewPanel from "../components/PreviewPanel";
import CopyBar from "../components/CopyBar";
import ParamPanel from "../components/ParamPanel";
import AspectStep from "../components/steps/AspectStep";
import ModePresetStep from "../components/steps/ModePresetStep";
import SubjectStep from "../components/steps/SubjectStep";
import CameraComposeLightStep from "../components/steps/CameraComposeLightStep";
import QualityStep from "../components/steps/QualityStep";

const STEPS = ["Aspect", "Mode", "스토리/묘사/주제", "Camera/Compose/Light", "Quality"];

export default function Builder() {
  const { currentStep, setStep } = useBuilderStore();
  
  const renderStep = () => {
    switch (currentStep) {
      case 0: return <AspectStep />;
      case 1: return <ModePresetStep />;
      case 2: return <SubjectStep />;
      case 3: return <CameraComposeLightStep />;
      case 4: return <QualityStep />;
      default: return null;
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Stepper steps={STEPS} current={currentStep} onStepClick={setStep} />
      
      <div className="grid md:grid-cols-3 gap-6 mt-8 pb-32">
        <div className="md:col-span-2 space-y-4">
          <PreviewPanel />
          {renderStep()}
        </div>
        <div className="space-y-4">
          <ParamPanel />
        </div>
      </div>
      
      <CopyBar />
    </div>
  );
}

