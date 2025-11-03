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

    params: { panel: "필수/추가 파라미터" },

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

    final: { helper:"오른쪽에서 최종 프롬프트를 복사하거나 파라미터를 조정하세요." },

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

    params: { panel: "Required / Extra Parameters" },

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

    final: { helper:"Use the right side to copy the final prompt or tweak parameters." },

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
