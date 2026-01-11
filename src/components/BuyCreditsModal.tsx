// src/components/BuyCreditsModal.tsx

import { useNavigate } from "react-router-dom";

import { useT } from "../i18n";
import { ROUTES } from "../config/constants";

export default function BuyCreditsModal({ onClose }: { onClose?: () => void }){

  const { t } = useT();

  const navigate = useNavigate();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      onClose?.();
      navigate(ROUTES.PRICING);
    } catch (error) {
      console.error("[BuyCreditsModal] Navigation error:", error);
      // 폴백: window.location 사용
      window.location.href = ROUTES.PRICING;
    }
  }

  return (

    <button 
      onClick={handleClick} 
      className="px-2 py-1 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
      type="button"
    >
      {t("credits.buy")}
    </button>

  );

}