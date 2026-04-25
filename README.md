# FootMatch MVP

FootMatch MVP는 이미 사고 싶은 신발의 구매 사이즈를 내 발 기준으로 판단하도록 돕는 MVP 웹앱입니다.

핵심 흐름은 다음과 같습니다.

1. 가벼운 발 프로필 만들기
2. 사고 싶은 신발 선택하기
3. 추천 사이즈, 이유, 참고 리뷰 확인하기

## MVP 범위

다음 흐름이 구현되어 있습니다.

1. 랜딩 페이지
2. 발 프로필 온보딩 입력
3. 선택 입력인 발 사진 업로드 (윗면/옆면)
4. 내 발 기준 프로필 생성
5. 신발 검색 및 카테고리 필터
6. 신발 상세에서 구매 사이즈 판단 확인
7. 규칙 기반 추천 사이즈와 비교 후보 제시
8. 구조화 리뷰 제출

## 목업(Mock) 처리된 영역

- 발 사진 분석은 `services/footAnalysis.ts`의 결정론적 목업 함수로 동작합니다.
- 신발/리뷰 데이터는 `data/` 폴더의 로컬 TypeScript 데이터입니다.
- 리뷰 제출은 데모 UI 동작만 수행하며 서버 저장은 없습니다.
- 인증 및 외부 API는 사용하지 않습니다.

## 제품 포지셔닝 원칙

- FootMatch는 신발 추천 서비스가 아니라 구매 사이즈 판단 지원 서비스입니다.
- 사진은 정밀 측정이 아니라 보조 참고 입력입니다.
- 핵심 결과 순서는 `추천 사이즈 -> 이유 -> 참고 리뷰`입니다.

## 아키텍처 (CV 연동 확장 포인트 유지)

현재 구조는 이후 실제 비전 모델로 교체하기 쉽도록 분리되어 있습니다.

- 업로드 UI: `components/UploadAnalyzer.tsx`
- 분석 서비스 레이어: `services/footAnalysis.ts`
- 프로필 정규화/추천 로직: `lib/profile.ts`

실제 CV 추론 연동 시 `analyzeFootPhotos` 구현만 교체하고, 반환 타입 구조를 유지하면 나머지 사이즈 판단 흐름을 그대로 활용할 수 있습니다.

## 로컬 실행 방법 (정확한 순서)

### 1) 요구사항

- Node.js 18.17+ (권장: Node.js 20 LTS)
- npm 9+

### 2) 프로젝트 폴더로 이동

```bash
cd /workspace/footmatch-mvp
```

### 3) 의존성 설치

```bash
npm install
```

### 4) 개발 서버 실행

```bash
npm run dev
```

### 5) 브라우저 접속

- http://localhost:3000

## 프로덕션 실행 방법

```bash
npm run build
npm run start
```

## package.json 스크립트

- `npm run dev` : 개발 서버
- `npm run build` : 프로덕션 빌드
- `npm run start` : 빌드 결과 실행
- `npm run lint` : ESLint 검사
