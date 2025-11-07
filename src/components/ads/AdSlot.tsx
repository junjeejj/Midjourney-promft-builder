import React from "react";

type Props = {
  slot: string;
  /** horizontal | rectangle | vertical (기본: horizontal) */
  format?: "horizontal" | "rectangle" | "vertical";
  className?: string;
};

/**
 * 상/하단 배너용 가로형 광고 컴포넌트
 * - data-ad-format="horizontal" 로 고정
 * - 높이 과대 확장을 막기 위해 래퍼에 max-height 적용
 */
export default function AdSlot({ slot, format = "horizontal", className }: Props) {
  React.useEffect(() => {
    try {
      (window.adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, [slot]);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        // 모바일 ~ 데스크탑에서 56~90px 범위로만 보이게 제한
        height: "clamp(56px, 7vw, 90px)",
        maxHeight: 100,
        overflow: "hidden",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-2243395970141516"
        data-ad-slot={slot}
        data-ad-format={format} // 가로형 고정
        data-full-width-responsive="true"
      />
    </div>
  );
}
