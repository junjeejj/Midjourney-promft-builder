export default function AdSenseSlot({ slot="test-slot", height=72 }:{slot?:string; height?:number}){

  return (

    <div className="w-full border bg-gray-100 grid place-items-center text-xs text-gray-500" style={{height}}>

      AdSlot: {slot}

    </div>

  );

}
