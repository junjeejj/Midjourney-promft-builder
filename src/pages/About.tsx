import React from "react";
import Seo from "../components/Seo";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Seo title="About" description="본 사이트의 목적과 비공식/비제휴 안내" />
      <h1 className="text-3xl font-bold">About</h1>
      <p className="mt-4 leading-relaxed text-gray-800">
        이 사이트는 이미지 생성/창작 작업을 돕기 위한 <b>프롬프트 작성 도구</b>입니다.
        사용자가 목적에 맞는 문구를 빠르게 조합하고, 결과가 흔들리지 않도록 구조화된 선택지를 제공합니다.
      </p>
      <p className="mt-4 leading-relaxed text-gray-800">
        본 서비스는 특정 브랜드/서비스와 <b>제휴하거나 공식적으로 운영되는 사이트가 아닙니다</b>.
        사용자는 각 플랫폼의 정책과 저작권·상표권·인물권을 준수하여 콘텐츠를 사용해야 합니다.
      </p>
      <p className="mt-4 text-sm text-gray-600">
        TODO: 운영자/회사명, 사업자 정보(해당 시), 문의 이메일 등을 실제 정보로 교체하세요.
      </p>
    </div>
  );
}






