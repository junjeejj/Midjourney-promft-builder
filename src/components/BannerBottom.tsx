import AdSenseSlot from "./AdSenseSlot";

export default function BannerBottom(){ 
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <AdSenseSlot slot="bottom" height={72} />
    </div>
  ); 
}