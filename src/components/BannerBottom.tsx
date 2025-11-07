import AdSlot from "./ads/AdSlot";

import { isAdAllowedPath } from "../lib/adsPolicy";



export default function BannerBottom({ pathname }: { pathname: string }) {

  if (!isAdAllowedPath(pathname)) return null;

  return (

    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
      <div className="mx-auto max-w-6xl px-3 py-2">
        <AdSlot slot="1760480869" style={{ minHeight: 60 }} />
      </div>
    </div>

  );

}
