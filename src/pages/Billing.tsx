// src/pages/Billing.tsx

import BuyCreditsModal from "../components/BuyCreditsModal";

import CreditBadge from "../components/CreditBadge";

type Props = { onClose?: () => void };

export default function Billing({ onClose }: Props){

  return (

    <main className="max-w-3xl mx-auto p-4 space-y-4">

      <h1 className="text-xl font-semibold">Billing / Credits</h1>

      <div className="flex items-center gap-2">

        <CreditBadge />

        <BuyCreditsModal />

      </div>

      {onClose && <button onClick={onClose}>닫기</button>}

      <p className="text-sm text-gray-600">

        Credits are consumed by pro features (e.g., GPT refine & seed search). This page will connect to real checkout on deployment.

      </p>

    </main>

  );

}