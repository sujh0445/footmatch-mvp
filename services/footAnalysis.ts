import { MockAnalysisOutput } from "@/types";

export interface AnalyzeFootInput {
  topViewFileName: string;
  sideViewFileName: string;
}

const toeShapes: MockAnalysisOutput["toeShapeHint"][] = ["egyptian", "greek", "square"];
const widths: MockAnalysisOutput["forefootWidthHint"][] = ["narrow", "normal", "wide"];
const insteps: MockAnalysisOutput["instepHint"][] = ["low", "normal", "high"];
const pressureRisk: MockAnalysisOutput["pressureRiskHint"][] = ["low", "medium", "high"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  }
  return hash;
}

/**
 * 시범용 발 형태 분석 서비스.
 *
 * 향후 실제 비전 모델/API로 교체할 때 이 함수만 바꾸면 됩니다.
 * 길이(mm)는 여기서 추정하지 않고, 사용자 입력값을 우선 사용합니다.
 */
export async function analyzeFootPhotos(input: AnalyzeFootInput): Promise<MockAnalysisOutput> {
  const seed = hashString(`${input.topViewFileName}-${input.sideViewFileName}`);

  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    forefootWidthHint: widths[seed % widths.length],
    toeShapeHint: toeShapes[Math.floor(seed / 11) % toeShapes.length],
    instepHint: insteps[Math.floor(seed / 7) % insteps.length],
    pressureRiskHint: pressureRisk[Math.floor(seed / 13) % pressureRisk.length],
    confidenceNote: "사진 분석은 촬영 각도와 조명에 따라 달라질 수 있어 참고용으로 반영됩니다."
  };
}
