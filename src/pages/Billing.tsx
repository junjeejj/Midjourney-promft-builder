// src/pages/Billing.tsx

import { Link } from "react-router-dom";

import BuyCreditsModal from "../components/BuyCreditsModal";

import CreditBadge from "../components/CreditBadge";

import { useT } from "../i18n";
import { ROUTES } from "../config/constants";

type Props = { onClose?: () => void };

export default function Billing({ onClose }: Props){

  const { t } = useT();

  return (

    <main className="max-w-3xl mx-auto p-4 space-y-4">

      <h1 className="text-xl font-semibold">Billing / Credits</h1>

      <div className="flex items-center gap-2">

        <CreditBadge />

        <BuyCreditsModal />

        <Link to={ROUTES.PRICING} className="px-3 py-1 border rounded-lg text-sm">

          {t("credits.buy")}

        </Link>

      </div>

      {onClose && <button onClick={onClose}>닫기</button>}

      <p className="text-sm text-gray-600">

        Credits are consumed by pro features (e.g., GPT refine & seed search).

      </p>

    </main>

  );

}