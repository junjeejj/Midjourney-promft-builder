import AdSenseSlot from "./AdSenseSlot";

export default function BannerTop(){ 
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <AdSenseSlot slot="top" height={72} />
    </div>
  ); 
}