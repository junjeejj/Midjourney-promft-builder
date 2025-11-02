import React from "react";

type Props = {
  steps: string[];
  current: number;
  onStepClick?: (index: number) => void;
};

export default function Stepper({ steps, current, onStepClick }: Props) {
  return (
    <div className="flex items-center gap-2 py-4">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <button
            onClick={() => onStepClick?.(i)}
            className={`px-4 py-2 rounded-lg border transition ${
              i === current
                ? "bg-blue-500 text-white border-blue-600"
                : i < current
                ? "bg-gray-100 border-gray-300"
                : "bg-white border-gray-200"
            }`}
          >
            {label}
          </button>
          {i < steps.length - 1 && <div className="w-4 h-0.5 bg-gray-300" />}
        </React.Fragment>
      ))}
    </div>
  );
}




