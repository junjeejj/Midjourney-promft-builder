import { useWalletStore } from "../store/useWalletStore";
import { useT } from "../i18n";

export default function CreditBadge() {
  const { balance } = useWalletStore();
  const { t } = useT();

  return (
    <span className="rounded-lg border bg-white px-2 py-1 text-xs">
      {t("credits.label")}: <b>{balance ?? 0}</b>
    </span>
  );
}