import AdSlot from "./ads/AdSlot";

import { isAdAllowedPath } from "../lib/adsPolicy";



export default function BannerBottom({ pathname }: { pathname: string }) {

  if (!isAdAllowedPath(pathname)) return null;

  return (
    <div className="w-full">
      <AdSlot slot="1760480870" format="horizontal" />
    </div>
  );

}
