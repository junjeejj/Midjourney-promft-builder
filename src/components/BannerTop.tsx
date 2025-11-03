import AdSlot from "./ads/AdSlot";

export default function BannerTop() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="mx-auto max-w-6xl px-3 py-2">
        <AdSlot slot="여기에_상단슬롯ID" style={{ minHeight: 60 }} />
      </div>
    </div>
  );
}