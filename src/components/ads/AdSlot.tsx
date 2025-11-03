import { useEffect } from "react";

declare global { interface Window { adsbygoogle: any[] } }

type Props = {
  slot: string;                  // data-ad-slot
  className?: string;
  style?: React.CSSProperties;
};

export default function AdSlot({ slot, className, style }: Props) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`}
      style={{ display: "block", ...(style || {}) }}
      data-ad-client="ca-pub-2243395970141516"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}


