import { useEffect, useRef } from "react";
import { requestAdFill } from "./AdSenseProvider";

type Props = { slot?: string; format?: string; style?: React.CSSProperties };
export default function AdSlot({ slot="display", format="auto", style }: Props){
  const ref = useRef<HTMLModElement | null>(null);
  useEffect(()=>{ if (ref.current) requestAdFill(); },[]);
  return (
    <ins
      ref={ref}
      className="adsbygoogle block w-full"
      style={style ?? { display:"block", minHeight: 60 }}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
