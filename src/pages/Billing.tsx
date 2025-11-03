import React from "react";
import { useWalletStore } from "../store/useWalletStore";
import BuyCreditsModal from "../components/BuyCreditsModal";
import { useState } from "react";

export default function Billing() {
  const { wallet, addCredits } = useWalletStore();
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">결제 관리</h1>
      
      <div className="border rounded-lg p-6 mb-6">
        <div className="text-lg font-semibold mb-2">현재 크레딧</div>
        <div className="text-3xl font-bold">{wallet.credits}</div>
      </div>
      
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        크레딧 충전
      </button>
      
      {showModal && <BuyCreditsModal onClose={() => setShowModal(false)} />}
    </div>
  );
}





