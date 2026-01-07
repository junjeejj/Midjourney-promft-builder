import React, { useEffect } from "react";

export default function OutbrainWidget({
  widgetId = "YOUR_WIDGET_ID",
  installationKey = "YOUR_INSTALLATION_KEY",
}: {
  widgetId?: string;
  installationKey?: string;
}) {
  useEffect(() => {
    const id = "outbrain-script";
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://widgets.outbrain.com/outbrain.js";
    document.body.appendChild(s);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-6">
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-xs text-gray-500 mb-2">Sponsored</div>
        <div
          className="OUTBRAIN"
          data-src={window.location.href}
          data-widget-id={widgetId}
          data-ob-installation-key={installationKey}
        />
      </div>
    </div>
  );
}






