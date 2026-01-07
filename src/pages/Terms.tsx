import React from "react";
import Seo from "../components/Seo";

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Seo title="이용약관" description="서비스 이용 규정 및 책임 범위(템플릿)" />
      <h1 className="text-3xl font-bold">이용약관</h1>
      <p className="mt-4 text-gray-800 leading-relaxed">
        본 약관은 서비스 이용과 관련한 기본 사항을 규정합니다. (아래 내용은 템플릿이며, 실제 운영 방식에 맞게 수정해야 합니다.)
      </p>
      <h2 className="mt-8 text-xl font-semibold">1. 서비스의 성격</h2>
      <p className="mt-2 text-gray-800 leading-relaxed">
        본 서비스는 프롬프트 작성/관리 기능을 제공하는 도구이며, 특정 브랜드/서비스의 공식 사이트가 아닙니다.
        사용자는 자신이 사용하는 플랫폼의 정책 및 관련 법령(저작권·상표권·인물권 등)을 준수해야 합니다.
      </p>
      <h2 className="mt-8 text-xl font-semibold">2. 금지 행위</h2>
      <ul className="mt-2 list-disc pl-5 text-gray-800 space-y-1">
        <li>불법 또는 정책 위반 콘텐츠의 생성/유도/배포</li>
        <li>타인의 권리(저작권/상표권/인물권) 침해</li>
        <li>서비스의 정상 운영을 방해하는 행위(자동화 공격, 과도한 트래픽 등)</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold">3. 책임의 한계</h2>
      <p className="mt-2 text-gray-800 leading-relaxed">
        서비스가 제공하는 결과물(문구/템플릿 등)은 참고용입니다.
        사용자가 이를 활용하여 발생하는 문제에 대해 운영자는 법령이 허용하는 범위 내에서 책임을 제한합니다.
      </p>
      <h2 className="mt-8 text-xl font-semibold">4. 문의</h2>
      <p className="mt-2 text-gray-800 leading-relaxed">약관/정책 관련 문의는 Contact 페이지를 통해 접수해 주세요.</p>
      <p className="mt-8 text-xs text-gray-500">
        TODO: 운영자 정보, 환불/유료 서비스(해당 시) 조항 등을 실제 정책에 맞게 보강하세요.
      </p>
    </div>
  );
}






