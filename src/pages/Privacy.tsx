import React from "react";
import Seo from "../components/Seo";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Seo title="개인정보처리방침" description="개인정보 수집/이용/보관/파기 안내(템플릿)" />
      <h1 className="text-3xl font-bold">개인정보처리방침</h1>
      <p className="mt-4 text-gray-800 leading-relaxed">
        본 방침은 운영자가 서비스 제공 과정에서 수집·이용하는 개인정보와 그 처리에 관한 사항을 안내합니다.
        (아래 내용은 템플릿이며, 실제 운영 형태에 맞게 수정해야 합니다.)
      </p>
      <h2 className="mt-8 text-xl font-semibold">1. 수집하는 개인정보 항목</h2>
      <ul className="mt-2 list-disc pl-5 text-gray-800 space-y-1">
        <li>계정 로그인 시: 이메일, 닉네임/프로필 정보(제공되는 범위 내)</li>
        <li>결제 시: 결제 처리에 필요한 정보(결제대행사에서 처리, 당사는 최소 정보만 확인)</li>
        <li>서비스 이용 시: 접속 로그, 기기/브라우저 정보, 오류 로그(품질 개선 목적)</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold">2. 개인정보 이용 목적</h2>
      <ul className="mt-2 list-disc pl-5 text-gray-800 space-y-1">
        <li>회원 식별 및 로그인/결제 처리</li>
        <li>서비스 운영 및 고객 문의 응대</li>
        <li>부정 이용 방지 및 보안</li>
        <li>서비스 품질 개선(오류 분석 등)</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold">3. 보관 및 파기</h2>
      <p className="mt-2 text-gray-800 leading-relaxed">
        개인정보는 목적 달성 후 지체 없이 파기합니다. 다만 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.
      </p>
      <h2 className="mt-8 text-xl font-semibold">4. 문의</h2>
      <p className="mt-2 text-gray-800 leading-relaxed">
        개인정보 관련 문의는 <b>Contact</b> 페이지의 이메일 주소로 연락해 주세요.
      </p>
      <p className="mt-8 text-xs text-gray-500">
        TODO: 운영자/회사명, 주소, 연락처, 개인정보 보호책임자 정보 등을 실제 정보로 교체하세요.
      </p>
    </div>
  );
}







