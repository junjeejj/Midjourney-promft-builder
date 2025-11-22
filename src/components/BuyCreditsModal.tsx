// src/components/BuyCreditsModal.tsx

import { useNavigate } from "react-router-dom";

import { useT } from "../i18n";
import { ROUTES } from "../config/constants";

export default function BuyCreditsModal({ onClose }: { onClose?: () => void }){

  const { t } = useT();

  const navigate = useNavigate();

  function goToPricing(){

    onClose?.();

    navigate(ROUTES.PRICING);

  }

  return (

    <button onClick={goToPricing} className="px-2 py-1 border rounded-lg text-sm">{t("credits.buy")}</button>

  );

}