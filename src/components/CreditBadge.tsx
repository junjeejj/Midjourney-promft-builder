import React from "react";
import { useWalletStore } from "../store/useWalletStore";

export default function CreditBadge(){
  const { wallet } = useWalletStore();
  return (
    <span className="px-2 py-1 text-xs rounded-lg border bg-white">
      크레딧: <b>{wallet.credits ?? 0}</b>
    </span>
  );
}
