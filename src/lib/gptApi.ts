// OpenAI API를 사용한 미드저니 프롬프트 생성

export async function generatePromptFromSubject(subject: string): Promise<string> {
  // ⚠️ 실제 OpenAI API 호출은 제거했습니다.
  // 이 함수는 현재 프론트엔드 데모용 더미 응답만 반환합니다.
  // 실제 API 통신은 나중에 서버(API route)에서 처리할 예정입니다.
  
  return `a cinematic fantasy illustration of a powerful orc warrior sprinting forward, dynamic motion blur, dramatic lighting, ultra detailed, 4k, ${subject}`;
}

// 기존 함수명과의 호환성을 위한 별칭
export const generateMidjourneyPrompt = generatePromptFromSubject;
