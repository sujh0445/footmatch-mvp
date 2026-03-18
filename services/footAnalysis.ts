import { MockAnalysisOutput } from "@/types";

export interface AnalyzeFootInput {
  topViewFileName: string;
  sideViewFileName: string;
}

const toeShapes: MockAnalysisOutput["toeShape"][] = ["egyptian", "greek", "square"];
const widths: MockAnalysisOutput["forefootWidth"][] = ["narrow", "normal", "wide"];
const insteps: MockAnalysisOutput["instepHeight"][] = ["low", "normal", "high"];
const heelTendency: MockAnalysisOutput["heelSlipTendency"][] = ["low", "medium", "high"];
const lrDiff: MockAnalysisOutput["leftRightDifference"][] = ["small", "medium", "large"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  }
  return hash;
}

/**
 * Mock computer-vision analysis service.
 *
 * Replace this function with a real API/model call later.
 * Keep the returned structure stable so downstream normalization and recommendation logic remain unchanged.
 */
export async function analyzeFootPhotos(input: AnalyzeFootInput): Promise<MockAnalysisOutput> {
  const seed = hashString(`${input.topViewFileName}-${input.sideViewFileName}`);

  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    footLengthMm: 245 + (seed % 35),
    forefootWidth: widths[seed % widths.length],
    instepHeight: insteps[Math.floor(seed / 7) % insteps.length],
    toeShape: toeShapes[Math.floor(seed / 11) % toeShapes.length],
    heelSlipTendency: heelTendency[Math.floor(seed / 13) % heelTendency.length],
    leftRightDifference: lrDiff[Math.floor(seed / 17) % lrDiff.length],
    confidence: 0.67
  };
}
