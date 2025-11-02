import React from "react";

export default function BuyCreditsModal({ onClose }:{ onClose: ()=>void }) {
  const buy = async () => {
    alert("결제 시스템은 추후 구현 예정입니다.");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm space-y-3">
        <div className="text-lg font-semibold">크레딧 충전</div>
        <div className="text-sm text-gray-600">100 크레딧 패키지 · 10,000원</div>
        <button onClick={buy} className="w-full py-2 border rounded-xl">결제 페이지로</button>
        <button onClick={onClose} className="w-full py-2 border rounded-xl">닫기</button>
      </div>
    </div>
  );
}

