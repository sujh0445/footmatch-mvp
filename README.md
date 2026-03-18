# FootMatch MVP

FootMatch MVP는 발 형태 유사도를 기반으로 신발 사이즈 후기를 탐색하는 MVP 웹앱입니다.

## MVP 범위

다음 흐름이 구현되어 있습니다.

1. 랜딩 페이지
2. 발 온보딩 입력
3. 발 사진 업로드 (윗면/옆면)
4. 목업 발 분석 결과
5. 신발 검색 및 카테고리 필터
6. 신발 상세 + 유사 발 리뷰
7. 규칙 기반 사이즈 추천
8. 구조화 리뷰 제출

## 목업(Mock) 처리된 영역

- 발 사진 분석은 `services/footAnalysis.ts`의 결정론적 목업 함수로 동작합니다.
- 신발/리뷰 데이터는 `data/` 폴더의 로컬 TypeScript 데이터입니다.
- 리뷰 제출은 데모 UI 동작만 수행하며 서버 저장은 없습니다.
- 인증 및 외부 API는 사용하지 않습니다.

## 아키텍처 (CV 연동 확장 포인트 유지)

현재 구조는 이후 실제 비전 모델로 교체하기 쉽도록 분리되어 있습니다.

- 업로드 UI: `components/UploadAnalyzer.tsx`
- 분석 서비스 레이어: `services/footAnalysis.ts`
- 프로필 정규화/추천 로직: `lib/profile.ts`

실제 CV 추론 연동 시 `analyzeFootPhotos` 구현만 교체하고, 반환 타입 구조를 유지하면 나머지 UI/추천 흐름을 그대로 활용할 수 있습니다.

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
