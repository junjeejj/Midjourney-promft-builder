export type Lang = "ko" | "en";

export const SITE_TEXT = {
  ko: {
    siteName: "이미지 생성 프롬프트 빌더",
    brandLine: "템플릿 · 가이드 · 예시",
    heroTitle: "이미지 생성 프롬프트를 빠르고 깔끔하게",
    heroSubtitle:
      "옵션을 골라 문구를 만들고 한 번에 복사하세요. 비공식 도구이며 특정 서비스와 제휴하지 않습니다.",
    disclaimerShort: "비공식 도구(제휴/공식 아님).",
    disclaimerLong:
      "이 사이트는 특정 브랜드/서비스와 제휴·공식 관계가 없는 비공식 프롬프트 작성 도구입니다. 입력/결과물의 사용 책임은 사용자에게 있으며, 성인/폭력/불법/도박 등 정책상 민감한 요청은 제한될 수 있습니다.",
    seo: {
      defaultTitle: "이미지 생성 프롬프트 빌더 | 템플릿 · 가이드 · 예시",
      defaultDescription:
        "이미지 생성 프롬프트를 쉽고 안전하게 작성하세요. 스타일·구도·조명·재질 옵션을 조합해 문구를 만들고, 가이드/예시로 품질을 높입니다. 비공식 도구이며 특정 서비스와 제휴하지 않습니다.",
      keywords:
        "프롬프트, 프롬프트 빌더, 이미지 생성, 템플릿, 가이드, 예시, prompt builder, image prompt",
    },
    nav: {
      builder: "빌더",
      templates: "템플릿",
      guides: "가이드",
      examples: "예시",
      pricing: "가격",
      favorites: "즐겨찾기",
      settings: "설정",
      about: "About",
      contact: "Contact",
      privacy: "개인정보처리방침",
      terms: "이용약관",
      login: "로그인",
    },
    language: {
      label: "언어선택",
      switchTo: "EN",
    },
    auth: {
      login: "로그인",
      logout: "로그아웃",
      viewProfile: "내 정보 보기",
      user: "사용자",
      userMenu: "사용자 메뉴 열기",
    },
    credits: {
      label: "크레딧",
      buy: "크레딧 구매",
      colon: "크레딧: ",
    },
    login: {
      title: "로그인",
      success: "로그인 성공",
      failed: "로그인 실패",
      emailLogin: "이메일 로그인",
      signup: "회원가입",
      signupSuccess: "회원가입 성공. 이메일 확인 필요할 수 있음",
      signupFailed: "회원가입 실패",
      oauthRedirect: "리다이렉트 중…",
      oauthFailed: "OAuth 실패",
      oauthFailedMessage: "OAuth 로그인에 실패했습니다.",
      orOAuth: "또는 OAuth:",
      checkSession: "세션 다시 확인",
      sessionNone: "(없음)",
      sessionLabel: "세션: ",
    },
    adLabel: "광고",
    report: {
      button: "문제 신고",
      title: "문제 신고",
      subtitle:
        "광고 심사/정책 대응을 위해, 부적절한 프롬프트나 오류를 운영자에게 전달할 수 있어요.",
      placeholder: "예) 성인/폭력 키워드 포함, 오타/버그, 스팸 등",
      submit: "신고 보내기",
      close: "닫기",
      done: "접수되었습니다. 감사합니다!",
    },
  },
  en: {
    siteName: "Image Prompt Builder",
    brandLine: "Templates · Guides · Examples",
    heroTitle: "Build image prompts faster, cleaner",
    heroSubtitle:
      "Pick options, generate a prompt, and copy in one click. This is an unofficial tool and not affiliated with any service.",
    disclaimerShort: "Unofficial tool (not affiliated).",
    disclaimerLong:
      "This website is an unofficial prompt-writing tool and is not affiliated with any brand or service. You are responsible for how you use inputs/outputs. Requests involving adult content, excessive violence, illegal activity, or gambling may be restricted.",
    seo: {
      defaultTitle: "Image Prompt Builder | Templates · Guides · Examples",
      defaultDescription:
        "Create image prompts safely and consistently. Combine style, composition, lighting, and material options—then learn with guides and examples. Unofficial tool; not affiliated with any service.",
      keywords:
        "prompt, prompt builder, image generation, templates, guides, examples, image prompt",
    },
    nav: {
      builder: "Builder",
      templates: "Templates",
      guides: "Guides",
      examples: "Examples",
      pricing: "Pricing",
      favorites: "Favorites",
      settings: "Settings",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      login: "Login",
    },
    language: {
      label: "Language",
      switchTo: "KO",
    },
    auth: {
      login: "Login",
      logout: "Log out",
      viewProfile: "View Profile",
      user: "User",
      userMenu: "Open user menu",
    },
    credits: {
      label: "Credits",
      buy: "Buy Credits",
      colon: "Credits: ",
    },
    login: {
      title: "Login",
      success: "Login successful",
      failed: "Login failed",
      emailLogin: "Email login",
      signup: "Sign up",
      signupSuccess: "Sign up successful. Email verification may be required",
      signupFailed: "Sign up failed",
      oauthRedirect: "Redirecting…",
      oauthFailed: "OAuth failed",
      oauthFailedMessage: "OAuth login failed",
      orOAuth: "Or OAuth:",
      checkSession: "Check session again",
      sessionNone: "(None)",
      sessionLabel: "Session: ",
    },
    adLabel: "Ad",
    report: {
      button: "Report",
      title: "Report an issue",
      subtitle:
        "Help us with policy/quality: report unsafe prompts, bugs, or spam.",
      placeholder: "e.g., unsafe keywords, typo/bug, spam…",
      submit: "Send report",
      close: "Close",
      done: "Received. Thank you!",
    },
  },
} as const;

export const NAV_ITEMS: Array<{ to: string; key: keyof typeof SITE_TEXT.ko.nav }> = [
  { to: "/builder", key: "builder" },
  { to: "/templates", key: "templates" },
  { to: "/guides", key: "guides" },
  { to: "/examples", key: "examples" },
  { to: "/pricing", key: "pricing" },
];

