import React from "react";
import { useWalletStore } from "../store/useWalletStore";
import BuyCreditsModal from "../components/BuyCreditsModal";
import { useState } from "react";

export default function Billing() {
  const { wallet, addCredits } = useWalletStore();
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Billing / Credits</h1>
      
      <div className="border rounded-lg p-6 mb-6">
        <div className="text-lg font-semibold mb-2">Current Credits</div>
        <div className="text-3xl font-bold">{wallet.credits}</div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">Credits are consumed by pro features.</p>
      
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Buy Credits
      </button>
      
      {showModal && <BuyCreditsModal onClose={() => setShowModal(false)} />}
    </div>
  );
}






