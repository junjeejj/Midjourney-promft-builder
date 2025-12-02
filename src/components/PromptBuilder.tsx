import React, { useMemo, useState } from 'react';



type Language = 'en' | 'ko';



type PromptOption = {

  id: string;

  value: string;   // 실제 프롬프트에 들어갈 영어

  labelKo: string; // 한국어 짧은 설명

};



type SubGroup = {

  id: string;

  labelEn: string;

  labelKo: string;

  maxSelected?: number;

  options: PromptOption[];

};



type PromptCategory = {

  id: string;

  labelEn: string;

  labelKo: string;

  type: 'single' | 'multi';

  maxSelected?: number;

  options?: PromptOption[]; // 단일 레벨용

  subGroups?: SubGroup[];   // 대분류 안의 소분류 (드롭박스들)

};



type PromptParams = {

  aspectRatio: string;

  stylize: number;

  chaos: number;

  quality: number;

  seed?: string;

};



type SelectionsState = Record<string, string[]>;



// ---------------- CATEGORIES (대분류) ----------------

const CATEGORIES: PromptCategory[] = [

  // 1) Mood & Genre (+ 감정, 장르 패키지)

  {

    id: 'moodGenre',

    labelEn: 'Mood & Genre',

    labelKo: '무드 & 장르',

    type: 'multi',

    maxSelected: 6,

    options: [

      { id: 'animeStyle', value: 'anime style', labelKo: '애니메이션 스타일' },

      { id: 'blockbusterStyle', value: 'blockbuster style', labelKo: '블록버스터 느낌' },

      { id: 'comingOfAge', value: 'coming-of-age', labelKo: '성장물 분위기' },

      { id: 'cosmicHorror', value: 'cosmic horror', labelKo: '코즈믹 호러' },

      { id: 'cyberNoir', value: 'cyber-noir', labelKo: '사이버 누아르' },

      { id: 'cyberpunk', value: 'cyberpunk', labelKo: '사이버펑크 스타일' },

      { id: 'darkAndMoody', value: 'dark and moody', labelKo: '어둡고 우울한 분위기' },

      { id: 'darkFantasy', value: 'dark fantasy', labelKo: '다크 판타지' },

      { id: 'dieselpunk', value: 'dieselpunk', labelKo: '디젤펑크 스타일' },

      { id: 'disneyStyle', value: 'disney style', labelKo: '디즈니 애니 느낌' },

      { id: 'dreamy', value: 'dreamy', labelKo: '몽환적인' },

      { id: 'editorial', value: 'editorial', labelKo: '패션 화보 같은' },

      { id: 'epic', value: 'epic', labelKo: '장엄한 / 스케일 큰' },

      { id: 'fantasy', value: 'fantasy', labelKo: '판타지' },

      { id: 'fantastical', value: 'fantastical', labelKo: '판타지 같은' },

      { id: 'filmNoir', value: 'film noir', labelKo: '고전 누아르 영화 느낌' },

      { id: 'filmStill', value: 'film still', labelKo: '영화 한 장면 같은' },

      { id: 'foundFootage', value: 'found footage vibe', labelKo: '파운드 푸티지 느낌' },

      { id: 'ghibliStyle', value: 'ghibli-inspired style', labelKo: '지브리 감성 스타일' },

      { id: 'gothicHorror', value: 'gothic horror', labelKo: '고딕 호러' },

      { id: 'hardScifi', value: 'hard sci-fi', labelKo: '하드 SF' },

      { id: 'heroicFantasy', value: 'heroic fantasy', labelKo: '영웅 판타지' },

      { id: 'highDrama', value: 'high drama', labelKo: '극도로 극적인' },

      { id: 'highFashion', value: 'high fashion', labelKo: '하이패션 느낌의' },

      { id: 'hollywoodStyle', value: 'hollywood style', labelKo: '헐리우드 영화 스타일' },

      { id: 'hyperrealistic', value: 'hyperrealistic', labelKo: '초사실적인' },

      { id: 'intimidating', value: 'intimidating', labelKo: '위압적인' },

      { id: 'kDramaStyle', value: 'korean drama style', labelKo: '한국 드라마 스타일' },

      { id: 'kpopMVStyle', value: 'k-pop music video style', labelKo: 'K-POP 뮤비 스타일' },

      { id: 'mangaStyle', value: 'manga style', labelKo: '만화 스타일' },

      { id: 'mechaScifi', value: 'mecha sci-fi', labelKo: '메카 SF' },

      { id: 'melancholic', value: 'melancholic', labelKo: '서글픈 / 우울한' },

      { id: 'movieStill', value: 'movie still', labelKo: '영화 스틸컷 같은' },

      { id: 'mysterious', value: 'mysterious', labelKo: '수수께끼 같은' },

      { id: 'neoNoir', value: 'neo-noir', labelKo: '현대식 누아르 느낌' },

      { id: 'noir', value: 'noir', labelKo: '누아르 분위기' },

      { id: 'nostalgic', value: 'nostalgic', labelKo: '향수 어린' },

      { id: 'photorealistic', value: 'photorealistic', labelKo: '사진처럼 사실적인' },

      { id: 'playful', value: 'playful', labelKo: '장난기 있는' },

      { id: 'pixarStyle', value: 'pixar style', labelKo: '픽사 애니 느낌' },

      { id: 'psychologicalHorror', value: 'psychological horror', labelKo: '심리 공포' },

      { id: 'realistic', value: 'realistic', labelKo: '사실적인' },

      { id: 'romantic', value: 'romantic', labelKo: '로맨틱한' },

      { id: 'serene', value: 'serene', labelKo: '고요하고 평화로운' },

      { id: 'sliceOfLife', value: 'slice-of-life', labelKo: '일상물 분위기' },

      { id: 'slasherHorror', value: 'slasher horror', labelKo: '슬래셔 호러' },

      { id: 'solarpunk', value: 'solarpunk', labelKo: '솔라펑크 스타일' },

      { id: 'spaceOpera', value: 'space opera', labelKo: '스페이스 오페라' },

      { id: 'steampunk', value: 'steampunk', labelKo: '스팀펑크 스타일' },

      { id: 'surreal', value: 'surreal', labelKo: '초현실적인' },

      { id: 'technoThriller', value: 'techno-thriller', labelKo: '테크노 스릴러' },

      { id: 'tenseAtmosphere', value: 'tense atmosphere', labelKo: '긴장감 넘치는 분위기' },

      { id: 'terrifying', value: 'terrifying', labelKo: '공포스러운' },

      { id: 'triumphant', value: 'triumphant', labelKo: '승리감 가득한' },

      { id: 'ultraCinematic', value: 'ultra cinematic', labelKo: '초영화적인' },

      { id: 'vogueStyle', value: 'vogue style', labelKo: '보그 잡지 스타일' },

      { id: 'webtoonStyle', value: 'webtoon style', labelKo: '웹툰 스타일' },

      { id: 'whimsical', value: 'whimsical', labelKo: '엉뚱하고 동화 같은' },

      { id: 'y2k', value: 'y2k aesthetic', labelKo: 'Y2K 감성' },

      { id: 'vaporwave', value: 'vaporwave aesthetic', labelKo: '베이퍼웨이브 미학' },

      { id: 'synthwave', value: 'synthwave aesthetic', labelKo: '신스웨이브 미학' },

      { id: 'darkAcademia', value: 'dark academia aesthetic', labelKo: '다크 아카데미아 감성' },

      { id: 'cottagecore', value: 'cottagecore aesthetic', labelKo: '시골 힐링 감성' },

      { id: 'eerie', value: 'eerie', labelKo: '으스스한' },

      { id: 'hopeful', value: 'hopeful', labelKo: '희망적인' },

      { id: 'dramatic', value: 'dramatic', labelKo: '드라마틱한 / 극적인' },

      { id: 'cinematic', value: 'cinematic', labelKo: '영화 같은' }

    ]

  },



  // 2) Scene Type / Timing

  {

    id: 'sceneType',

    labelEn: 'Scene Type',

    labelKo: '장면 타입',

    type: 'multi',

    maxSelected: 4,

    options: [

      { id: 'actionScene', value: 'action scene', labelKo: '액션 장면' },

      { id: 'aftermathScene', value: 'aftermath scene', labelKo: '사건 후의 장면' },

      { id: 'battleScene', value: 'battle scene', labelKo: '전투 장면' },

      { id: 'chaseScene', value: 'chase scene', labelKo: '추격 장면' },

      { id: 'cityscape', value: 'cityscape', labelKo: '도시 전경' },

      { id: 'dreamSequence', value: 'dream sequence', labelKo: '꿈속 장면' },

      { id: 'documentary', value: 'documentary style', labelKo: '다큐멘터리 스타일' },

      { id: 'emotionalCloseup', value: 'emotional close-up', labelKo: '감정이 강조된 클로즈업' },

      { id: 'epicLandscape', value: 'epic landscape', labelKo: '장엄한 풍경' },

      { id: 'establishingShot', value: 'establishing shot', labelKo: '배경 소개용 와이드 샷' },

      { id: 'explosionScene', value: 'explosion scene', labelKo: '폭발 장면' },

      { id: 'fightScene', value: 'fight scene', labelKo: '격투 장면' },

      { id: 'finalBoss', value: 'final boss confrontation', labelKo: '최종 보스 대면 장면' },

      { id: 'fullBodyShot', value: 'full body shot', labelKo: '전신 샷' },

      { id: 'groupShot', value: 'group shot', labelKo: '여러 명이 함께 나온 샷' },

      { id: 'interiorScene', value: 'interior scene', labelKo: '실내 장면' },

      { id: 'impactMoment', value: 'impact moment', labelKo: '충돌하는 바로 그 순간' },

      { id: 'justBeforeImpact', value: 'just before impact', labelKo: '충돌 직전 순간' },

      { id: 'landscape', value: 'landscape', labelKo: '풍경 장면' },

      { id: 'midAction', value: 'mid-action', labelKo: '액션 한가운데 순간' },

      { id: 'midAir', value: 'mid-air', labelKo: '공중에 떠 있는 순간' },

      { id: 'nightmareSequence', value: 'nightmare sequence', labelKo: '악몽 장면' },

      { id: 'portrait', value: 'portrait', labelKo: '인물 초상' },

      { id: 'characterPortrait', value: 'character portrait', labelKo: '캐릭터 초상' },

      { id: 'preBattleTension', value: 'pre-battle tension', labelKo: '전투 직전 긴장감' },

      { id: 'quietBeforeStorm', value: 'quiet before the storm', labelKo: '폭풍 전의 고요' },

      { id: 'streetPhotography', value: 'street photography', labelKo: '스트리트 사진 스타일' },

      { id: 'transformationScene', value: 'transformation scene', labelKo: '변신 장면' },

      { id: 'victoryMoment', value: 'victory moment', labelKo: '승리의 순간' },

      { id: 'warZone', value: 'war zone', labelKo: '전쟁터 장면' },

      { id: 'dramaticCloseup', value: 'dramatic close-up', labelKo: '드라마틱한 클로즈업' }

    ]

  },



  // 3) Subject & Character / Anatomy

  {

    id: 'subjectCharacter',

    labelEn: 'Subject & Character',

    labelKo: '피사체 & 캐릭터',

    type: 'multi',

    maxSelected: 8,

    options: [

      { id: 'calmExpression', value: 'calm expression', labelKo: '차분한 표정' },

      { id: 'cinematicArmor', value: 'cinematic armor', labelKo: '영화 같은 갑옷' },

      { id: 'confidentStance', value: 'confident stance', labelKo: '자신감 있는 자세' },

      { id: 'detailedHands', value: 'detailed hands', labelKo: '손 디테일이 살아있는' },

      { id: 'detailedSkinPores', value: 'detailed skin pores', labelKo: '피부 모공까지 표현된' },

      { id: 'dynamicGesture', value: 'dynamic gesture', labelKo: '역동적인 제스처' },

      { id: 'dynamicPose', value: 'dynamic pose', labelKo: '역동적인 포즈' },

      { id: 'dramaticExpression', value: 'dramatic expression', labelKo: '드라마틱한 표정' },

      { id: 'expressiveHands', value: 'expressive hands', labelKo: '표정 있는 손 제스처' },

      { id: 'fierceGaze', value: 'fierce gaze', labelKo: '사나운 시선' },

      { id: 'flowingHair', value: 'flowing hair', labelKo: '흐르는 머리카락' },

      { id: 'freckles', value: 'freckles', labelKo: '주근깨 표현' },

      { id: 'glossySkin', value: 'glossy skin', labelKo: '광나는 피부' },

      { id: 'heroicPose', value: 'heroic pose', labelKo: '영웅적인 포즈' },

      { id: 'highFashionOutfit', value: 'high fashion outfit', labelKo: '하이패션 의상' },

      { id: 'intenseExpression', value: 'intense expression', labelKo: '강렬한 표정' },

      { id: 'motionBlurHair', value: 'motion blur on hair', labelKo: '머리카락에 모션 블러' },

      { id: 'naturalBodyProportions', value: 'natural body proportions', labelKo: '자연스러운 신체 비율' },

      { id: 'naturalPose', value: 'natural pose', labelKo: '자연스러운 포즈' },

      { id: 'perfectSkin', value: 'perfect skin', labelKo: '잡티 없는 피부' },

      { id: 'realisticAnatomy', value: 'realistic anatomy', labelKo: '사실적인 인체 구조' },

      { id: 'streetwear', value: 'streetwear', labelKo: '스트리트 패션' },

      { id: 'strongSilhouette', value: 'strong silhouette', labelKo: '실루엣이 뚜렷한' },

      { id: 'subtleExpression', value: 'subtle expression', labelKo: '미묘한 표정' },

      { id: 'tacticalGear', value: 'tactical gear', labelKo: '전술 장비 복장' },

      { id: 'wetSkin', value: 'wet skin', labelKo: '젖은 피부' },

      { id: 'windInHair', value: 'wind in hair', labelKo: '머리가 바람에 휘날리는' },

      { id: 'actionPose', value: 'action pose', labelKo: '액션 포즈' },

      { id: 'futuristicArmor', value: 'futuristic armor', labelKo: '미래적인 갑옷' }

    ]

  },



  // 4) Camera & Lens (대분류) - 소분류: 카메라 / 렌즈 / 샷 타입 / 심도

  {

    id: 'cameraLens',

    labelEn: 'Camera & Lens',

    labelKo: '카메라 & 렌즈',

    type: 'multi',

    maxSelected: 12,

    subGroups: [

      {

        id: 'cameraType',

        labelEn: 'Camera',

        labelKo: '카메라',

        options: [

          { id: 'shot35mmFilm', value: 'shot on 35mm film', labelKo: '35mm 필름 촬영 느낌' },

          { id: 'shotDSLR', value: 'shot on DSLR', labelKo: 'DSLR로 찍은 느낌' },

          { id: 'shotMirrorless', value: 'shot on mirrorless', labelKo: '미러리스로 찍은 느낌' },

          { id: 'shotRED', value: 'shot on RED camera', labelKo: 'RED 카메라 촬영 느낌' },

          { id: 'shotARRI', value: 'shot on ARRI Alexa', labelKo: 'ARRI Alexa 촬영 느낌' },

          { id: 'shotIMAX70', value: 'shot on IMAX 70mm', labelKo: 'IMAX 70mm 촬영 느낌' },

          { id: 'handheldShot', value: 'handheld shot', labelKo: '손으로 든 불안정한 샷' },

          { id: 'stabilizedShot', value: 'stabilized shot', labelKo: '짐벌로 안정화된 샷' }

        ]

      },

      {

        id: 'lensFocal',

        labelEn: 'Lens',

        labelKo: '렌즈',

        options: [

          { id: '24mm', value: '24mm lens', labelKo: '24mm 렌즈, 광각' },

          { id: '35mm', value: '35mm lens', labelKo: '35mm 렌즈, 영화 표준' },

          { id: '50mm', value: '50mm lens', labelKo: '50mm 렌즈, 클래식 인물' },

          { id: '85mm', value: '85mm lens', labelKo: '85mm 렌즈, 망원 인물' },

          { id: 'macroLens', value: 'macro lens', labelKo: '매크로 렌즈, 극접사' },

          { id: 'fisheyeLens', value: 'fisheye lens', labelKo: '어안 렌즈' },

          { id: 'tiltShiftLens', value: 'tilt-shift lens', labelKo: '틸트시프트 렌즈' }

        ]

      },

      {

        id: 'shotType',

        labelEn: 'Shot Type',

        labelKo: '샷 타입',

        options: [

          { id: 'closeUp', value: 'close-up', labelKo: '클로즈업 샷' },

          { id: 'extremeCloseUp', value: 'extreme close-up', labelKo: '극단 클로즈업' },

          { id: 'mediumShot', value: 'medium shot', labelKo: '상반신 정도 샷' },

          { id: 'wideShot', value: 'wide shot', labelKo: '와이드 샷' },

          { id: 'panoramicShot', value: 'panoramic shot', labelKo: '파노라마 샷' },

          { id: 'povShot', value: 'POV shot', labelKo: 'POV, 시점 샷' },

          { id: 'overShoulder', value: 'over-the-shoulder shot', labelKo: '어깨 너머 샷' },

          { id: 'centeredShot', value: 'centered shot', labelKo: '중앙 구도 샷' },

          { id: 'topDownShot', value: 'top-down shot', labelKo: '위에서 내려다본 샷' },

          { id: 'highAngleShot', value: 'high angle shot', labelKo: '하이 앵글 샷' },

          { id: 'lowAngleShot', value: 'low angle shot', labelKo: '로우 앵글 샷' },

          { id: 'droneShot', value: 'drone shot', labelKo: '드론 샷' },

          { id: 'dutchAngle', value: 'dutch angle', labelKo: '더치 앵글(기울어진 샷)' }

        ]

      },

      {

        id: 'depthOfField',

        labelEn: 'Depth of Field',

        labelKo: '심도 & 보케',

        options: [

          { id: 'f1_2', value: 'f/1.2', labelKo: 'f/1.2, 매우 얕은 심도' },

          { id: 'f1_4', value: 'f/1.4', labelKo: 'f/1.4, 아웃포커싱 강함' },

          { id: 'f1_8', value: 'f/1.8', labelKo: 'f/1.8, 아웃포커싱' },

          { id: 'f2_8', value: 'f/2.8', labelKo: 'f/2.8, 적당한 심도' },

          { id: 'f8', value: 'f/8', labelKo: 'f/8, 전체 선명' },

          { id: 'shallowDoF', value: 'shallow depth of field', labelKo: '얕은 심도' },

          { id: 'deepDoF', value: 'deep depth of field', labelKo: '깊은 심도' },

          { id: 'creamyBokeh', value: 'creamy bokeh', labelKo: '크리미한 보케' },

          { id: 'anamorphicBokeh', value: 'anamorphic bokeh', labelKo: '아나몰픽 보케' },

          { id: 'subjectSharp', value: 'subject in sharp focus', labelKo: '피사체만 매우 선명' }

        ]

      }

    ]

  },



  // 5) Lighting + Lens artifacts

  {

    id: 'lighting',

    labelEn: 'Lighting & Lens FX',

    labelKo: '조명 & 렌즈 효과',

    type: 'multi',

    maxSelected: 8,

    options: [

      { id: 'backlighting', value: 'backlighting', labelKo: '역광' },

      { id: 'blueHourLighting', value: 'blue hour lighting', labelKo: '블루아워 조명' },

      { id: 'cinematicLighting', value: 'cinematic lighting', labelKo: '영화 같은 조명' },

      { id: 'chromaticAberration', value: 'chromatic aberration', labelKo: '색수차 효과' },

      { id: 'dramaticLighting', value: 'dramatic lighting', labelKo: '극적인 조명' },

      { id: 'filmBurn', value: 'film burn', labelKo: '필름 탄 자국 효과' },

      { id: 'godRays', value: 'god rays', labelKo: '빛줄기 효과' },

      { id: 'goldenHour', value: 'golden hour lighting', labelKo: '골든아워 조명' },

      { id: 'highKeyLighting', value: 'high-key lighting', labelKo: '밝은 톤 위주 조명' },

      { id: 'lensFlare', value: 'lens flare', labelKo: '렌즈 플레어' },

      { id: 'lightLeak', value: 'light leak', labelKo: '필름 빛 샘 효과' },

      { id: 'lowKeyLighting', value: 'low-key lighting', labelKo: '어두운 톤 위주 조명' },

      { id: 'moonlight', value: 'moonlight', labelKo: '달빛 조명' },

      { id: 'moodyLighting', value: 'moody lighting', labelKo: '어둡고 분위기 있는 조명' },

      { id: 'naturalLighting', value: 'natural lighting', labelKo: '자연광' },

      { id: 'neonLighting', value: 'neon lighting', labelKo: '네온 조명' },

      { id: 'rimLighting', value: 'rim lighting', labelKo: '림라이트' },

      { id: 'softBloom', value: 'soft bloom', labelKo: '부드러운 빛 번짐' },

      { id: 'softNaturalLight', value: 'soft natural light', labelKo: '부드러운 자연광' },

      { id: 'studioLighting', value: 'studio lighting', labelKo: '스튜디오 조명' },

      { id: 'sunsetLighting', value: 'sunset lighting', labelKo: '노을 조명' },

      { id: 'threePointLighting', value: 'three-point lighting', labelKo: '3점 조명' },

      { id: 'uplight', value: 'uplight', labelKo: '아래에서 비추는 조명' },

      { id: 'vignetting', value: 'vignetting', labelKo: '비네팅, 가장자리 어두워짐' },

      { id: 'volumetricLighting', value: 'volumetric lighting', labelKo: '볼류메트릭 라이트' },

      { id: 'anamorphicLensFlare', value: 'anamorphic lens flare', labelKo: '아나몰픽 렌즈 플레어' },

      { id: 'softboxLighting', value: 'softbox lighting', labelKo: '소프트박스 조명' }

    ]

  },



  // 6) Detail & Quality + Post-processing

  {

    id: 'detailQuality',

    labelEn: 'Detail, Quality & Grading',

    labelKo: '디테일, 퀄리티 & 보정',

    type: 'multi',

    maxSelected: 8,

    options: [

      { id: '4k', value: '4k', labelKo: '4K 해상도급' },

      { id: '8k', value: '8k', labelKo: '8K 해상도급' },

      { id: 'clearFeatures', value: 'clear features', labelKo: '윤곽이 뚜렷한' },

      { id: 'cinematicGrading', value: 'cinematic grading', labelKo: '영화식 색보정' },

      { id: 'crossProcessing', value: 'cross processing', labelKo: '크로스 프로세싱 느낌' },

      { id: 'crushedBlacks', value: 'crushed blacks', labelKo: '블랙을 강하게 눌러서 어두운 톤' },

      { id: 'filmEmulation', value: 'film emulation', labelKo: '필름 색감 에뮬레이션' },

      { id: 'flawless', value: 'flawless', labelKo: '결점 없는' },

      { id: 'hdr', value: 'HDR', labelKo: 'HDR, 하이 다이내믹 레인지' },

      { id: 'highContrastEditing', value: 'high contrast editing', labelKo: '고대비 편집' },

      { id: 'highResolution', value: 'high resolution', labelKo: '고해상도' },

      { id: 'highlyDetailed', value: 'highly detailed', labelKo: '디테일 풍부' },

      { id: 'insanelyDetailed', value: 'insanely detailed', labelKo: '말도 안 되게 디테일한' },

      { id: 'intricateDetails', value: 'intricate details', labelKo: '정교한 디테일' },

      { id: 'liftedBlacks', value: 'lifted blacks', labelKo: '블랙을 살짝 올린 바랜 느낌' },

      { id: 'matteFinishGrading', value: 'matte finish grading', labelKo: '무광톤 색보정' },

      { id: 'polished', value: 'polished', labelKo: '매끈하게 다듬어진' },

      { id: 'sharpDetails', value: 'sharp details', labelKo: '날카로운 디테일' },

      { id: 'softContrastEditing', value: 'soft contrast editing', labelKo: '부드러운 대비 편집' },

      { id: 'softGlowEffect', value: 'soft glow effect', labelKo: '부드러운 글로우 효과' },

      { id: 'ultraDetailed', value: 'ultra detailed', labelKo: '초고디테일' },

      { id: 'ultraHighResolution', value: 'ultra high resolution', labelKo: '초고해상도' },

      { id: 'washedOutColors', value: 'washed-out colors', labelKo: '색이 바랜, 물 빠진 색감' },

      { id: 'luxurious', value: 'luxurious', labelKo: '호화로운' },

      { id: 'elegant', value: 'elegant', labelKo: '우아한' },

      { id: 'sharpenedDetails', value: 'sharpened details', labelKo: '샤픈된 디테일' }

    ]

  },



  // 7) Color & Look + descriptive adjectives

  {

    id: 'colorLook',

    labelEn: 'Color & Look',

    labelKo: '색감 & 룩',

    type: 'multi',

    maxSelected: 6,

    options: [

      { id: 'blackAndWhite', value: 'black and white', labelKo: '흑백' },

      { id: 'coolTones', value: 'cool tones', labelKo: '차가운 색조' },

      { id: 'delicate', value: 'delicate', labelKo: '섬세한' },

      { id: 'desaturated', value: 'desaturated', labelKo: '채도가 낮은' },

      { id: 'glossy', value: 'glossy', labelKo: '광택 나는' },

      { id: 'gritty', value: 'gritty', labelKo: '거칠고 현실적인' },

      { id: 'highContrast', value: 'high contrast', labelKo: '명암 대비 강함' },

      { id: 'iridescentColors', value: 'iridescent colors', labelKo: '무지개빛 색감' },

      { id: 'jagged', value: 'jagged', labelKo: '울퉁불퉁하고 날카로운' },

      { id: 'luminous', value: 'luminous', labelKo: '빛나는' },

      { id: 'majestic', value: 'majestic', labelKo: '장엄한' },

      { id: 'mutedColors', value: 'muted colors', labelKo: '톤 다운된 색감' },

      { id: 'neonColors', value: 'neon colors', labelKo: '네온 컬러' },

      { id: 'ominous', value: 'ominous', labelKo: '불길한' },

      { id: 'organic', value: 'organic', labelKo: '유기적인, 자연스러운' },

      { id: 'pastelColors', value: 'soft pastel colors', labelKo: '파스텔톤 색감' },

      { id: 'richColors', value: 'rich colors', labelKo: '풍부한 색감' },

      { id: 'saturated', value: 'saturated colors', labelKo: '색이 진한, 포화된' },

      { id: 'subdued', value: 'subdued colors', labelKo: '톤이 눌린, 조용한 색감' },

      { id: 'tealOrange', value: 'teal and orange color grading', labelKo: '틸앤오렌지 색보정' },

      { id: 'translucent', value: 'translucent', labelKo: '반투명한' },

      { id: 'velvety', value: 'velvety', labelKo: '벨벳처럼 부드러운' },

      { id: 'vibrantColors', value: 'vibrant colors', labelKo: '생동감 있는 색감' },

      { id: 'vividColors', value: 'vivid colors', labelKo: '선명한 색감' },

      { id: 'warmTones', value: 'warm tones', labelKo: '따뜻한 색조' },

      { id: 'geometric', value: 'geometric', labelKo: '기하학적인' },

      { id: 'mechanical', value: 'mechanical', labelKo: '기계적인' }

    ]

  },



  // 8) Environment, Location, Weather, Texture

  {

    id: 'environmentLocation',

    labelEn: 'Environment & Location',

    labelKo: '환경 & 장소',

    type: 'multi',

    maxSelected: 8,

    options: [

      { id: 'abandonedBuilding', value: 'abandoned building', labelKo: '폐건물' },

      { id: 'abandonedThemePark', value: 'abandoned theme park', labelKo: '폐놀이공원' },

      { id: 'ancientRuins', value: 'ancient ruins', labelKo: '고대 유적' },

      { id: 'amusementPark', value: 'amusement park', labelKo: '놀이공원' },

      { id: 'classroomInterior', value: 'classroom interior', labelKo: '교실 실내' },

      { id: 'cliffEdge', value: 'cliff edge', labelKo: '절벽 가장자리' },

      { id: 'cozyCafeInterior', value: 'cozy cafe interior', labelKo: '아늑한 카페 실내' },

      { id: 'crowdedStreet', value: 'crowded street', labelKo: '사람 많은 거리' },

      { id: 'deepOcean', value: 'deep ocean', labelKo: '깊은 바다' },

      { id: 'denseFog', value: 'dense fog', labelKo: '짙은 안개' },

      { id: 'dustParticles', value: 'dust particles', labelKo: '먼지 입자들' },

      { id: 'emptyStreet', value: 'empty street', labelKo: '텅 빈 거리' },

      { id: 'enchantedForest', value: 'enchanted forest', labelKo: '마법 같은 숲' },

      { id: 'festivalLights', value: 'festival lights', labelKo: '축제 조명 가득한 거리' },

      { id: 'filmGrain', value: 'film grain', labelKo: '필름 그레인' },

      { id: 'gentleSnowfall', value: 'gentle snowfall', labelKo: '부드럽게 내리는 눈' },

      { id: 'hauntedForest', value: 'haunted forest', labelKo: '귀신 나올 것 같은 숲' },

      { id: 'japaneseStreet', value: 'japanese street', labelKo: '일본 거리' },

      { id: 'koreanTraditionalHouse', value: 'korean traditional house', labelKo: '한국 한옥' },

      { id: 'lakesideAtDusk', value: 'lakeside at dusk', labelKo: '해질녘 호숫가' },

      { id: 'lightFog', value: 'light fog', labelKo: '옅은 안개' },

      { id: 'luxuryPenthouse', value: 'luxury penthouse', labelKo: '럭셔리 펜트하우스' },

      { id: 'medievalTown', value: 'medieval town', labelKo: '중세 마을' },

      { id: 'mountainPeak', value: 'mountain peak', labelKo: '산 정상' },

      { id: 'neonStreet', value: 'neon street', labelKo: '네온 간판 거리' },

      { id: 'officeInterior', value: 'office interior', labelKo: '사무실 내부' },

      { id: 'postApocalypticCity', value: 'post-apocalyptic city', labelKo: '포스트 아포칼립스 도시' },

      { id: 'rainyNight', value: 'rainy night', labelKo: '비 오는 밤' },

      { id: 'rooftopAtNight', value: 'rooftop at night', labelKo: '밤의 옥상' },

      { id: 'ruinedCity', value: 'ruined city', labelKo: '폐허가 된 도시' },

      { id: 'snowstorm', value: 'snowstorm', labelKo: '눈보라' },

      { id: 'spaceStationCorridor', value: 'space station corridor', labelKo: '우주정거장 복도' },

      { id: 'spaceshipInterior', value: 'spaceship interior', labelKo: '우주선 내부' },

      { id: 'stormySky', value: 'stormy sky', labelKo: '폭풍우 치는 하늘' },

      { id: 'subwayStation', value: 'subway station', labelKo: '지하철역' },

      { id: 'trainInterior', value: 'train interior', labelKo: '기차 내부' },

      { id: 'underwaterScene', value: 'underwater scene', labelKo: '수중 장면' },

      { id: 'wetSurfaces', value: 'wet surfaces', labelKo: '젖은 표면' }

    ]

  },



  // 9) Time & Culture / Era

  {

    id: 'timeCulture',

    labelEn: 'Time & Culture',

    labelKo: '시대 & 문화',

    type: 'multi',

    maxSelected: 4,

    options: [

      { id: 'ancientEra', value: 'ancient era', labelKo: '고대 시대' },

      { id: 'cottagecoreEra', value: 'cottagecore aesthetic', labelKo: '시골 힐링 감성' },

      { id: 'distantFuture', value: 'distant future', labelKo: '머나먼 미래' },

      { id: 'early2000s', value: 'early 2000s style', labelKo: '2000년대 초반 스타일' },

      { id: 'industrialEra', value: 'industrial era', labelKo: '산업 혁명 시대' },

      { id: 'medievalEra', value: 'medieval era', labelKo: '중세 시대' },

      { id: 'modernDay', value: 'modern day', labelKo: '현대 배경' },

      { id: 'nearFuture', value: 'near future', labelKo: '가까운 미래' },

      { id: 'postApocalypticFuture', value: 'post-apocalyptic future', labelKo: '종말 이후의 미래' },

      { id: 'prehistoricEra', value: 'prehistoric era', labelKo: '선사 시대' },

      { id: 'retroFuturism', value: 'retro-futurism', labelKo: '옛 사람들이 상상한 미래' },

      { id: 'solarpunkCulture', value: 'solarpunk culture', labelKo: '솔라펑크 문화' },

      { id: 'victorianEra', value: 'victorian era', labelKo: '빅토리아 시대' },

      { id: '1920sStyle', value: '1920s style', labelKo: '1920년대 스타일' },

      { id: '1950sStyle', value: '1950s style', labelKo: '1950년대 스타일' },

      { id: '1980sStyle', value: '1980s style', labelKo: '1980년대 스타일' },

      { id: '1990sStyle', value: '1990s style', labelKo: '1990년대 스타일' }

    ]

  },



  // 10) Era / Media / Film Look (시대 / 매체 / 화풍)

  {

    id: 'timeMediaArtStyle',

    labelEn: 'Era / Media / Film Look',

    labelKo: '시대 / 매체 / 화풍',

    type: 'multi',

    maxSelected: 4,

    options: [

      { id: 'film35mm', value: '35mm film', labelKo: '35mm 필름 느낌' },

      { id: 'analogFilm', value: 'analog film', labelKo: '아날로그 필름 느낌' },

      { id: 'filmPhotography', value: 'film photography', labelKo: '필름 사진 스타일' },

      { id: 'kodakPortra', value: 'kodak portra style', labelKo: '코닥 포트라 필름 느낌' },

      { id: 'kodakGold', value: 'kodak gold style', labelKo: '코닥 골드 필름 느낌' },

      { id: 'fujiFilm', value: 'fuji film style', labelKo: '후지 필름 느낌' },

      { id: 'vintagePhoto', value: 'vintage photo', labelKo: '빈티지 사진 느낌' },

      { id: 'retroPhoto', value: 'retro photo', labelKo: '레트로 사진 느낌' },

      { id: 'polaroidStyle', value: 'polaroid style', labelKo: '폴라로이드 느낌' }

    ]

  },



  // 11) Composition & Perspective

  {

    id: 'composition',

    labelEn: 'Composition & Perspective',

    labelKo: '구도 & 퍼스펙티브',

    type: 'multi',

    maxSelected: 4,

    options: [

      { id: 'centeredComposition', value: 'centered composition', labelKo: '중앙 구도' },

      { id: 'dynamicComposition', value: 'dynamic composition', labelKo: '역동적인 구도' },

      { id: 'leadingLines', value: 'leading lines', labelKo: '리딩 라인 구도' },

      { id: 'negativeSpace', value: 'negative space', labelKo: '여백을 많이 둔 구도' },

      { id: 'perspective', value: 'perspective', labelKo: '원근감 있는 구도' },

      { id: 'ruleOfThirds', value: 'rule of thirds composition', labelKo: '삼분할 구도' },

      { id: 'symmetricalComposition', value: 'symmetrical composition', labelKo: '좌우 대칭 구도' },

      { id: 'wideAnglePerspective', value: 'wide angle perspective', labelKo: '광각 원근' }

    ]

  },



  // 12) Usage & Output

  {

    id: 'usageOutput',

    labelEn: 'Usage & Output',

    labelKo: '용도 & 출력',

    type: 'multi',

    maxSelected: 4,

    options: [

      { id: 'bookCover', value: 'book cover', labelKo: '책 표지' },

      { id: 'coverArt', value: 'cover art', labelKo: '커버 아트용' },

      { id: 'keyVisual', value: 'key visual', labelKo: '키 비주얼' },

      { id: 'lightNovelCover', value: 'light novel cover', labelKo: '라노벨 표지' },

      { id: 'mobileWallpaper', value: 'mobile wallpaper', labelKo: '모바일 배경화면용' },

      { id: 'posterArt', value: 'poster art', labelKo: '포스터용 아트' },

      { id: 'splashArt', value: 'splash art', labelKo: '게임 스플래시 아트' },

      { id: 'streamingThumbnail', value: 'streaming thumbnail', labelKo: '스트리밍 썸네일' },

      { id: 'thumbnailImage', value: 'thumbnail image', labelKo: '썸네일 이미지' },

      { id: 'wallpaper', value: 'wallpaper', labelKo: '배경화면용' }

    ]

  },



  // 13) Negative / Clean-up

  {

    id: 'negative',

    labelEn: 'Negative / Clean-up',

    labelKo: '네거티브 / 제한',

    type: 'multi',

    options: [

      { id: 'noText', value: 'text', labelKo: '텍스트' },

      { id: 'noLogo', value: 'logo', labelKo: '로고' },

      { id: 'noWatermark', value: 'watermark', labelKo: '워터마크' },

      { id: 'noBorder', value: 'border', labelKo: '테두리' },

      { id: 'noFrame', value: 'frame', labelKo: '프레임' },

      { id: 'noBlur', value: 'blur', labelKo: '블러' },

      { id: 'noGrain', value: 'grain', labelKo: '그레인' },

      { id: 'noNoise', value: 'noise', labelKo: '노이즈' },

      { id: 'simpleBackground', value: 'clutter', labelKo: '복잡한 요소' }

    ]

  }

];



const TEXT = {

  en: {

    languageLabel: 'Language',

    categoriesTitle: 'Categories',

    subjectTitle: 'Subject / Content (what to draw)',

    subjectPlaceholder: 'e.g. a cyberpunk girl standing in the rain, holding a katana',

    paramsTitle: 'Midjourney Parameters',

    aspectRatio: 'Aspect Ratio (--ar)',

    stylize: 'Stylize (--s)',

    chaos: 'Chaos (--chaos)',

    quality: 'Quality (--q)',

    seed: 'Seed (--seed)',

    seedPlaceholder: 'optional (number)',

    finalPromptTitle: 'Prompt Preview (with hints)',

    copyButton: 'Copy to clipboard',

    copyHint:

      'Buttons or dropdowns show "Korean short label / English". The actual prompt uses English only.',

    resetCategory: 'Clear this category',

    dropdownPlaceholder: 'Select an option...',

    subgroupTitleSuffix: '', // e.g. '(dropdown)'

    hintsTitle: 'Selected options (grouped by category)'

  },

  ko: {

    languageLabel: '언어',

    categoriesTitle: '카테고리',

    subjectTitle: 'Subject / Content (무엇을 그릴지)',

    subjectPlaceholder: '예: a cyberpunk girl standing in the rain, holding a katana',

    paramsTitle: 'Midjourney 파라미터',

    aspectRatio: '종횡비 (--ar)',

    stylize: '스타일 강도 (--s)',

    chaos: '혼돈도 (--chaos)',

    quality: '품질 (--q)',

    seed: '시드 (--seed)',

    seedPlaceholder: '선택 (숫자)',

    finalPromptTitle: '프롬프트 미리보기 (힌트 포함)',

    copyButton: '클립보드에 복사',

    copyHint:

      '버튼/드롭다운에는 "한글 짧은 설명 / 영어"가 보이고, 실제 프롬프트에는 영어만 들어갑니다.',

    resetCategory: '이 카테고리 선택 초기화',

    dropdownPlaceholder: '선택하세요...',

    subgroupTitleSuffix: ' (드롭다운)',

    hintsTitle: '선택된 옵션 (카테고리별)'

  }

} as const;



type OptionEntry = {

  categoryId: string;

  option: PromptOption;

};



function getAllOptionsForCategory(cat: PromptCategory): PromptOption[] {

  const base = cat.options ?? [];

  const subs = cat.subGroups ? cat.subGroups.flatMap((sg) => sg.options) : [];

  const map = new Map<string, PromptOption>();

  [...base, ...subs].forEach((opt) => {

    if (!map.has(opt.value)) {

      map.set(opt.value, opt);

    }

  });

  return Array.from(map.values());

}



function buildPrompt(subject: string, selections: SelectionsState, params: PromptParams): string {

  const blocks: string[] = [];



  const orderedCategoryIds = [

    'moodGenre',

    'sceneType',

    'subjectCharacter',

    'cameraLens',

    'lighting',

    'detailQuality',

    'colorLook',

    'environmentLocation',

    'composition',

    'timeCulture',

    'timeMediaArtStyle',

    'usageOutput'

  ];



  const getSelectedValues = (id: string): string[] => selections[id] || [];



  orderedCategoryIds.forEach((catId) => {

    const values = getSelectedValues(catId);

    if (values.length > 0) {

      blocks.push(values.join(', '));

    }

  });



  if (subject.trim()) {

    // mood, scene 뒤에 subject 끼워 넣기

    blocks.splice(2, 0, subject.trim());

  }



  const negativeValues = getSelectedValues('negative');



  const paramParts: string[] = [];

  if (params.aspectRatio) paramParts.push(`--ar ${params.aspectRatio}`);

  if (params.stylize) paramParts.push(`--s ${params.stylize}`);

  if (params.chaos) paramParts.push(`--chaos ${params.chaos}`);

  if (params.quality) paramParts.push(`--q ${params.quality}`);

  if (params.seed && params.seed.trim()) paramParts.push(`--seed ${params.seed.trim()}`);

  if (negativeValues.length > 0) {

    paramParts.push(`--no ${negativeValues.join(', ')}`);

  }



  const base = blocks.join(', ');

  if (paramParts.length === 0) return base;

  return `${base} ${paramParts.join(' ')}`;

}



const PromptBuilder: React.FC = () => {

  const [language, setLanguage] = useState<Language>('ko');

  const [subject, setSubject] = useState('');

  const [selections, setSelections] = useState<SelectionsState>({});

  const [params, setParams] = useState<PromptParams>({

    aspectRatio: '9:16',

    stylize: 750,

    chaos: 0,

    quality: 1

  });



  // 왼쪽 메뉴: 대분류만 노출

  const [activeCategoryId, setActiveCategoryId] = useState<string>(CATEGORIES[0]?.id ?? '');



  // 각 소분류 드롭박스의 현재 선택값

  const [subSelects, setSubSelects] = useState<Record<string, string>>({});



  const t = TEXT[language];



  const fullPrompt = useMemo(

    () => buildPrompt(subject, selections, params),

    [subject, selections, params]

  );



  const handleToggleValue = (category: PromptCategory, value: string) => {

    if (!value) return;

    setSelections((prev) => {

      const current = prev[category.id] || [];

      const already = current.includes(value);

      let next: string[];

      if (already) {

        next = current.filter((v) => v !== value);

      } else {

        next = [...current, value];

        const limit = category.maxSelected;

        if (limit && next.length > limit) {

          next = next.slice(next.length - limit);

        }

      }

      return { ...prev, [category.id]: next };

    });

  };



  const handleSubSelectChange = (

    category: PromptCategory,

    subgroup: SubGroup,

    value: string

  ) => {

    const key = `${category.id}:${subgroup.id}`;

    setSubSelects((prev) => ({ ...prev, [key]: value }));

    const opt = subgroup.options.find((o) => o.value === value);

    if (!opt) return;

    handleToggleValue(category, opt.value);

  };



  const handleParamChange = (field: keyof PromptParams, value: string | number) => {

    setParams((prev) => ({

      ...prev,

      [field]: typeof prev[field] === 'number' ? Number(value) : value

    }));

  };



  const activeCategory = useMemo(

    () => CATEGORIES.find((c) => c.id === activeCategoryId) ?? CATEGORIES[0],

    [activeCategoryId]

  );



  const selectedEntriesByCategory = useMemo(() => {

    return CATEGORIES.map((cat) => {

      const values = selections[cat.id] || [];

      if (!values.length) return null;

      const allOpts = getAllOptionsForCategory(cat);

      const picked = allOpts.filter((o) => values.includes(o.value));

      if (!picked.length) return null;

      return {

        categoryId: cat.id,

        categoryLabelEn: cat.labelEn,

        categoryLabelKo: cat.labelKo,

        options: picked

      };

    }).filter(Boolean) as {

      categoryId: string;

      categoryLabelEn: string;

      categoryLabelKo: string;

      options: PromptOption[];

    }[];

  }, [selections]);



  const getOptionLabel = (opt: PromptOption) => `${opt.labelKo} / ${opt.value}`;



  return (

    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">

      {/* 상단: 언어 선택 */}

      <div className="flex justify-end mb-1">

        <label className="flex items-center gap-2 text-xs">

          <span className="font-semibold">{t.languageLabel}</span>

          <select

            className="border rounded px-2 py-1 text-xs"

            value={language}

            onChange={(e) => setLanguage(e.target.value as Language)}

          >

            <option value="en">English</option>

            <option value="ko">한국어</option>

          </select>

        </label>

      </div>



      <div className="flex flex-col md:flex-row gap-4">

        {/* 왼쪽: 대분류 카테고리 메뉴 (31개 컨셉 중 현재는 13개) */}

        <aside className="w-full md:w-1/4 border rounded-lg p-3 max-h-[80vh] overflow-auto">

          <h2 className="font-bold mb-2 text-sm">

            {t.categoriesTitle}

          </h2>

          <ul className="space-y-1">

            {CATEGORIES.map((cat) => {

              const isActive = activeCategoryId === cat.id;

              const mainLabel = language === 'en' ? cat.labelEn : cat.labelKo;

              const subLabel = language === 'en' ? cat.labelKo : cat.labelEn;

              return (

                <li key={cat.id}>

                  <button

                    type="button"

                    className={`w-full text-left px-2 py-1 rounded text-xs ${

                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'

                    }`}

                    onClick={() => setActiveCategoryId(cat.id)}

                  >

                    {mainLabel}{' '}

                    <span className="text-[10px] text-gray-300">/</span>{' '}

                    <span className="text-[10px] text-gray-800">{subLabel}</span>

                  </button>

                </li>

              );

            })}

          </ul>

        </aside>



        {/* 가운데: Subject + 활성 카테고리 세부 설정 */}

        <main className="flex-1 flex flex-col gap-3">

          {/* Subject */}

          <section className="border rounded-lg p-3">

            <h2 className="font-bold mb-2 text-sm">{t.subjectTitle}</h2>

            <textarea

              className="w-full border rounded p-2 text-sm min-h-[70px]"

              placeholder={t.subjectPlaceholder}

              value={subject}

              onChange={(e) => setSubject(e.target.value)}

            />

          </section>



          {/* 활성 카테고리: 드롭다운 or 버튼들 */}

          <section className="border rounded-lg p-3 flex flex-col gap-3">

            <div className="flex items-center justify-between mb-1">

              <div>

                <h2 className="font-bold text-sm">

                  {language === 'en' ? activeCategory.labelEn : activeCategory.labelKo}{' '}

                  <span className="text-[11px] text-gray-500">

                    / {language === 'en' ? activeCategory.labelKo : activeCategory.labelEn}

                  </span>

                </h2>

                {activeCategory.maxSelected && (

                  <p className="text-[11px] text-gray-500">

                    (max {activeCategory.maxSelected} options)

                  </p>

                )}

              </div>

              <button

                type="button"

                className="text-[11px] text-red-500 underline"

                onClick={() =>

                  setSelections((prev) => ({

                    ...prev,

                    [activeCategory.id]: []

                  }))

                }

              >

                {t.resetCategory}

              </button>

            </div>



            {/* 소분류(드롭다운)가 있는 카테고리: 예) 카메라 & 렌즈 */}

            {activeCategory.subGroups && activeCategory.subGroups.length > 0 ? (

              <div className="space-y-3">

                {activeCategory.subGroups.map((sg) => {

                  const key = `${activeCategory.id}:${sg.id}`;

                  const selectedValue = subSelects[key] ?? '';

                  return (

                    <div key={sg.id} className="border rounded p-2">

                      <label className="block text-xs font-semibold mb-1">

                        {language === 'en' ? sg.labelEn : sg.labelKo}

                        {t.subgroupTitleSuffix}

                      </label>

                      <select

                        className="w-full border rounded px-2 py-1 text-xs"

                        value={selectedValue}

                        onChange={(e) =>

                          handleSubSelectChange(activeCategory, sg, e.target.value)

                        }

                      >

                        <option value="">{t.dropdownPlaceholder}</option>

                        {sg.options.map((opt) => (

                          <option key={opt.id} value={opt.value}>

                            {getOptionLabel(opt)}

                          </option>

                        ))}

                      </select>



                      {/* 이 소분류 안에서 선택된 옵션 힌트 */}

                      <div className="mt-1 text-[11px] text-gray-600">

                        {(() => {

                          const catSelected = selections[activeCategory.id] || [];

                          const picked = sg.options.filter((o) =>

                            catSelected.includes(o.value)

                          );

                          if (!picked.length) return null;

                          return (

                            <div>

                              {picked.map((o) => (

                                <div key={o.id}>

                                  • {o.value} – {o.labelKo}

                                </div>

                              ))}

                            </div>

                          );

                        })()}

                      </div>

                    </div>

                  );

                })}

              </div>

            ) : (

              // 평범한 카테고리는 버튼으로 나열

              <div className="flex flex-wrap gap-2">

                {(activeCategory.options ?? []).map((opt) => {

                  const selected = (selections[activeCategory.id] || []).includes(opt.value);

                  return (

                    <button

                      key={opt.id}

                      type="button"

                      className={`text-xs px-2 py-1 rounded border ${

                        selected

                          ? 'bg-blue-600 text-white border-blue-600'

                          : 'bg-white hover:bg-gray-100'

                      }`}

                      onClick={() => handleToggleValue(activeCategory, opt.value)}

                    >

                      {getOptionLabel(opt)}

                    </button>

                  );

                })}

              </div>

            )}

          </section>



          {/* 파라미터 */}

          <section className="border rounded-lg p-3">

            <h2 className="font-bold mb-2 text-sm">{t.paramsTitle}</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">

              <div>

                <label className="block mb-1">{t.aspectRatio}</label>

                <select

                  className="w-full border rounded p-1"

                  value={params.aspectRatio}

                  onChange={(e) => handleParamChange('aspectRatio', e.target.value)}

                >

                  <option value="1:1">1:1</option>

                  <option value="3:2">3:2</option>

                  <option value="4:5">4:5</option>

                  <option value="9:16">9:16</option>

                  <option value="16:9">16:9</option>

                </select>

              </div>

              <div>

                <label className="block mb-1">{t.stylize}</label>

                <input

                  type="number"

                  className="w-full border rounded p-1"

                  min={0}

                  max={1000}

                  step={50}

                  value={params.stylize}

                  onChange={(e) => handleParamChange('stylize', e.target.value)}

                />

              </div>

              <div>

                <label className="block mb-1">{t.chaos}</label>

                <input

                  type="number"

                  className="w-full border rounded p-1"

                  min={0}

                  max={100}

                  step={5}

                  value={params.chaos}

                  onChange={(e) => handleParamChange('chaos', e.target.value)}

                />

              </div>

              <div>

                <label className="block mb-1">{t.quality}</label>

                <select

                  className="w-full border rounded p-1"

                  value={params.quality}

                  onChange={(e) => handleParamChange('quality', e.target.value)}

                >

                  <option value={0.25}>0.25</option>

                  <option value={0.5}>0.5</option>

                  <option value={1}>1</option>

                  <option value={2}>2</option>

                </select>

              </div>

              <div>

                <label className="block mb-1">{t.seed}</label>

                <input

                  type="text"

                  className="w-full border rounded p-1"

                  value={params.seed ?? ''}

                  onChange={(e) => handleParamChange('seed', e.target.value)}

                  placeholder={t.seedPlaceholder}

                />

              </div>

            </div>

          </section>

        </main>



        {/* 오른쪽: 프롬프트 미리보기 + 힌트 */}

        <aside className="w-full md:w-1/3 border rounded-lg p-3 flex flex-col">

          <h2 className="font-bold mb-2 text-sm">{t.finalPromptTitle}</h2>

          <textarea

            className="w-full border rounded p-2 text-xs flex-1 mb-2"

            value={fullPrompt}

            readOnly

          />

          <button

            type="button"

            className="text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 self-start"

            onClick={() => {

              navigator.clipboard.writeText(fullPrompt).catch(() => {});

            }}

          >

            {t.copyButton}

          </button>

          <p className="mt-1 text-[11px] text-gray-500">

            {t.copyHint}

          </p>



          <div className="mt-3 border-t pt-2 max-h-40 overflow-auto text-[11px]">

            <div className="font-semibold mb-1">{t.hintsTitle}</div>

            {selectedEntriesByCategory.length === 0 && (

              <p className="text-gray-400">–</p>

            )}

            {selectedEntriesByCategory.map((cat) => (

              <div key={cat.categoryId} className="mb-1">

                <div className="font-semibold">

                  {cat.categoryLabelEn} / {cat.categoryLabelKo}

                </div>

                <ul className="ml-3 list-disc">

                  {cat.options.map((opt) => (

                    <li key={opt.id}>

                      {opt.value} – {opt.labelKo}

                    </li>

                  ))}

                </ul>

              </div>

            ))}

          </div>

        </aside>

      </div>

    </div>

  );

};



export default PromptBuilder;
