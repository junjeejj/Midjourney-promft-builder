import React, { useState } from "react";
import Seo from "../components/Seo";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const mailto = () => {
    const to = "YOUR_EMAIL@example.com"; // TODO: 실제 이메일로 변경
    const subject = encodeURIComponent("[Prompt Builder] 문의");
    const body = encodeURIComponent(`회신 받을 이메일: ${email}\n\n문의 내용:\n${msg}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Seo title="Contact" description="문의/오류 제보/정책 관련 요청" />
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-gray-600">문의/오류 제보/정책 관련 요청은 아래로 보내주세요.</p>
      <div className="mt-6 space-y-3 rounded-2xl border bg-white p-5">
        <label className="block">
          <div className="text-sm font-medium">회신 이메일</div>
          <input className="mt-1 w-full rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">문의 내용</div>
          <textarea className="mt-1 w-full min-h-[140px] rounded-xl border px-3 py-2" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="가능하면 스크린샷/재현 방법을 함께 적어주세요." />
        </label>
        <button
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
          onClick={mailto}
          disabled={!email.trim() || !msg.trim()}
        >
          이메일로 보내기
        </button>
        <p className="text-xs text-gray-500">위 버튼은 기본 메일 앱을 열어 메일을 작성합니다(서버 저장 없음).</p>
      </div>
    </div>
  );
}







