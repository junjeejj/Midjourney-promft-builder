import { useLocale } from "./store/useLocale";

const dict = {

  ko: {

    app: "MJ 프롬프트 빌더",

    nav: {

      builder: "빌더", templates: "템플릿", seed: "시드", favorites:"즐겨찾기",

      defaults:"내설정", billing:"결제", settings:"설정", profile:"내정보", login:"로그인", logout:"로그아웃"

    },

    steps: {

      aspect:"사이즈", mode:"모드", subject:"주제", ccl:"카메라/구도/라이트", quality:"품질", preview:"프리뷰"

    },

    preview: {

      title: "프롬프트 미리보기(괄호 설명 포함)",

      final: "최종 프롬프트 (복사해서 미드저니에 붙여넣기)",

      copy: "프롬프트 복사", copied: "복사됨"

    },

    params: { 
      panel: "필수/추가 파라미터",
      arHint: "화면 비율",
      styleHint: "글로벌 스타일 프리셋",
      seedHint: "비슷한 결과 재현",
      stylizeHint: "스타일 강조",
      chaosHint: "랜덤성",
      qHint: "0.5 / 1 / 2",
      stopHint: "중간 렌더 멈추기",
      repeatHint: "한 번에 여러 장 생성",
      weirdHint: "실험적/기묘한 해석",
      owHint: "레퍼런스 강도",
      iwHint: "이미지 프롬프트 영향력",
      versionHint: "모델 버전 직접 입력",
      srefHint: "스타일 레퍼런스 이미지 URL",
      orefHint: "특정 인물/오브젝트 일관성 유지",
      profileHint: "개인/브랜드 스타일 프로필",
      noHint: "빼고 싶은 요소 강제 제외",
      tileHint: "무한 반복 패턴",
      rawHint: "기본 미드저니 스타일 약화",
      stealthHint: "웹 갤러리 비공개",
      draftHint: "빠른 러프 컨셉 드로잉 모드",
      nijiHint: "애니메이션 스타일 모드",
    },
    summary: {
      title: "선택 요약",
      subject: "주제",
      camera: "카메라",
      composition: "구도",
      lighting: "라이트",
      color: "색상/톤",
      style: "스타일",
      parameters: "파라미터",
    },
    credits: {
      label: "크레딧",
      buy: "크레딧 구매",
      buyTitle: "크레딧 구매 (데모)",
      amount: "수량",
      cancel: "취소",
      purchase: "구매",
      demoNote: "※ 실제 Stripe/PortOne 결제는 배포 시 연동됩니다.",
    },

    aspect: {

      label: "사이즈 (Aspect, --ar)",

      desc: {

        "1:1": "정사각형(프로필/썸네일)",

        "3:2": "가로 표준(DSLR)",

        "2:3": "세로 포스터/전신",

        "16:9": "와이드 배너/유튜브",

        "9:16": "세로 쇼츠/모바일",

        "21:9": "울트라 와이드 시네마틱"

      },

      noteNext: "* 사이즈를 고르면 자동으로 다음 단계로 이동합니다."

    },

    mode: {

      label: "모드 프리셋",

      photoreal: { name:"포토리얼", desc:"사진처럼 사실적인 톤" },

      cinematic: { name:"시네마틱", desc:"영화 톤/대비" },

      niji: { name:"애니(니지)", desc:"애니메이션 스타일 색/디테일" }

    },

    subject: {

      label:"주제",

      placeholder:"예) 벚꽃길을 걷는 몽환적인 소녀"

    },

    ccl: {

      title:"카메라 / 구도 / 라이트",

      camera:"카메라",

      composition:"구도",

      lighting:"라이트"

    },

    quality: {

      title:"품질 / 강조",

      stylize:"스타일강조 (--stylize)",

      stylizeHint:"0–1000",

      chaos:"혼돈 (--chaos)",

      chaosHint:"0–100",

      q:"품질 (--q)",

      qHint:"0.5 / 1 / 2",

      next:"다음"

    },

    final: { helper:"최상단에서 최종 프롬프트를 복사하거나 파라미터를 조정하세요." },

    common: { next:"다음" }

  },

  en: {

    app: "MJ Prompt Builder",

    nav: {

      builder: "Builder", templates: "Templates", seed: "Seed", favorites:"Favorites",

      defaults:"My Defaults", billing:"Billing", settings:"Settings", profile:"Profile", login:"Log in", logout:"Log out"

    },

    steps: { aspect:"Aspect", mode:"Mode", subject:"Subject", ccl:"Camera/Composition/Lighting", quality:"Quality", preview:"Preview" },

    preview: { title:"Prompt Preview (with hints)", final:"Final Prompt (copy and paste to Midjourney)", copy:"Copy Prompt", copied:"Copied" },

    params: { 
      panel: "Required / Extra Parameters",
      arHint: "image ratio",
      styleHint: "global style preset",
      seedHint: "keep similar look",
      stylizeHint: "style emphasis",
      chaosHint: "randomness",
      qHint: "0.5 / 1 / 2",
      stopHint: "stop at mid-render",
      repeatHint: "generate multiple sets",
      weirdHint: "experimental/weird interpretation",
      owHint: "reference strength",
      iwHint: "image prompt influence",
      versionHint: "model version direct input",
      srefHint: "style reference image URL",
      orefHint: "maintain character/object consistency",
      profileHint: "personal/brand style profile",
      noHint: "force exclude elements",
      tileHint: "infinite repeat pattern",
      rawHint: "weaken default Midjourney styling",
      stealthHint: "web gallery private",
      draftHint: "quick rough concept drawing mode",
      nijiHint: "anime-style mode",
    },
    summary: {
      title: "Selection Summary",
      subject: "Subject",
      camera: "Camera",
      composition: "Composition",
      lighting: "Lighting",
      color: "Color/Tone",
      style: "Style",
      parameters: "Parameters",
    },
    credits: {
      label: "Credits",
      buy: "Buy Credits",
      buyTitle: "Buy Credits (demo)",
      amount: "Amount",
      cancel: "Cancel",
      purchase: "Purchase",
      demoNote: "※ Real Stripe/PortOne checkout will be wired on deployment.",
    },

    aspect: {

      label: "Aspect (--ar)",

      desc: {

        "1:1": "Square (profile/thumbnail)",

        "3:2": "Landscape classic (DSLR)",

        "2:3": "Portrait classic (poster/full body)",

        "16:9": "Wide landscape (banner/YouTube)",

        "9:16": "Tall portrait (mobile/shorts)",

        "21:9": "Ultra-wide cinematic"

      },

      noteNext: "* Picking an aspect immediately moves to the next step."

    },

    mode: {

      label: "Mode Preset",

      photoreal: { name:"Photoreal", desc:"Photo-realistic look" },

      cinematic: { name:"Cinematic", desc:"Film tone and contrast" },

      niji: { name:"Anime (Niji)", desc:"Anime-style colors/details" }

    },

    subject: { label:"Subject", placeholder:"e.g. dreamy cherry blossom boulevard" },

    ccl: { title:"Camera / Composition / Lighting", camera:"Camera", composition:"Composition", lighting:"Lighting" },

    quality: { title:"Quality / Emphasis", stylize:"Stylize (--stylize)", stylizeHint:"0–1000", chaos:"Chaos (--chaos)", chaosHint:"0–100", q:"Quality (--q)", qHint:"0.5 / 1 / 2", next:"Next" },

    final: { helper:"Use the top section to copy the final prompt or tweak parameters." },

    common: { next:"Next" }

  }

} as const;

export function useT() {

  const { locale } = useLocale();

  const t = (path: string): string => {

    const parts = path.split(".");

    let cur: any = dict[locale] ?? dict.ko;

    for (const p of parts) cur = cur?.[p];

    return (typeof cur === "string" ? cur : path);

  };

  const d = (path: string): any => { // 객체도 필요할 때

    const parts = path.split(".");

    let cur: any = dict[locale] ?? dict.ko;

    for (const p of parts) cur = cur?.[p];

    return cur;

  };

  return { t, d, locale };

}
