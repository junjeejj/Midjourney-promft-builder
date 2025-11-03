type Step = { key: string; label: string };

export default function Stepper({

  steps, active, onStepClick,

}:{

  steps: Step[];

  active: number;

  onStepClick?: (index:number)=>void;

}) {

  return (

    <div className="flex items-center gap-3 text-sm">

      {steps.map((s,i)=>(

        <div key={s.key} className="flex items-center gap-2">

          <button

            type="button"

            onClick={()=>onStepClick?.(i)}

            className={`w-6 h-6 rounded-full grid place-items-center border transition

              ${i<=active? "bg-black text-white border-black" : "bg-white text-gray-600 hover:bg-gray-50"}`}

            aria-label={`Go to ${s.label}`}

            title={`Go to ${s.label}`}

          >

            {i+1}

          </button>

          <button

            type="button"

            onClick={()=>onStepClick?.(i)}

            className={`${i<=active? "font-medium":"text-gray-600 hover:underline"}`}

            title={`Go to ${s.label}`}

          >

            {s.label}

          </button>

          {i<steps.length-1 && <div className="w-6 h-[1px] bg-gray-300 mx-1" />}

        </div>

      ))}

    </div>

  );

}