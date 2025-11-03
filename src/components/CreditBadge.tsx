import { useWalletStore } from "../store/useWalletStore";

import { useT } from "../i18n";

export default function CreditBadge(){

  const { wallet } = useWalletStore();

  const { t } = useT();

  return (

    <span className="px-2 py-1 text-xs rounded-lg border bg-white">

      {t("credits.label")}: <b>{wallet.credits ?? 0}</b>

    </span>

  );

}