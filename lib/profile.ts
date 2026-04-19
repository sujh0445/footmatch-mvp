import { FootProfile, FootSelfInput, MockAnalysisOutput, ShoeReview, SizeRecommendation } from "@/types";

function roundToNearestFive(value: number): number {
  return Math.round(value / 5) * 5;
}

function estimateSizeFromFootLength(lengthMm: number): number {
  return roundToNearestFive(lengthMm + 10);
}

export function createFallbackAnalysis(selfInput: FootSelfInput): MockAnalysisOutput {
  const forefootWidth =
    selfInput.sizeUpForWidth === "often" ? "wide" : selfInput.sizeUpForWidth === "sometimes" ? "normal" : "narrow";

  const instepHeight =
    selfInput.instepPressureExperience === "often"
      ? "high"
      : selfInput.instepPressureExperience === "sometimes"
        ? "normal"
        : "low";

  return {
    forefootWidth,
    instepHeight,
    toeShape: "egyptian",
    heelSlipTendency: selfInput.commonIssues.includes("heel_slip") ? "high" : "medium",
    leftRightDifference: "small",
    confidence: 0.42,
    photoUploaded: false
  };
}

export function normalizeFootProfile(analysis: MockAnalysisOutput, selfInput: FootSelfInput): FootProfile {
  const notes: string[] = [];

  if (selfInput.sizeUpForWidth === "often") {
    notes.push("발볼 때문에 반업 또는 크게 사는 편이라는 경험을 반영했어요.");
  } else if (selfInput.sizeUpForWidth === "sometimes") {
    notes.push("신발에 따라 앞볼 여유를 더 찾는 편으로 보았어요.");
  }

  if (selfInput.instepPressureExperience === "often") {
    notes.push("발등 눌림 경험이 잦아 발등 압박에 더 민감한 편으로 보았어요.");
  }

  if (analysis.confidence < 0.5) {
    notes.push("사진 없이 분석했거나 사진 신뢰도가 낮아 형태 정보는 참고용으로만 반영했어요.");
  }

  return {
    footLengthMm: selfInput.actualFootLengthMm,
    forefootWidth: selfInput.sizeUpForWidth === "often" ? "wide" : analysis.forefootWidth,
    instepHeight: selfInput.instepPressureExperience === "often" ? "high" : analysis.instepHeight,
    toeShape: analysis.toeShape,
    heelSlipTendency: selfInput.commonIssues.includes("heel_slip") ? "high" : analysis.heelSlipTendency,
    leftRightDifference: analysis.leftRightDifference,
    purchasedShoeSizeMm: selfInput.purchasedShoeSizeMm,
    notes
  };
}

const widthWeight = { narrow: 0, normal: 1, wide: 2 };
const instepWeight = { low: 0, normal: 1, high: 2 };
const heelWeight = { low: 0, medium: 1, high: 2 };
const lrWeight = { small: 0, medium: 1, large: 2 };

export function calculateProfileSimilarity(user: FootProfile, reviewer: FootProfile): number {
  let score = 100;
  const lengthDelta = Math.abs(user.footLengthMm - reviewer.footLengthMm);
  score -= Math.min(24, lengthDelta * 1.6);
  score -= Math.abs(widthWeight[user.forefootWidth] - widthWeight[reviewer.forefootWidth]) * 12;
  score -= Math.abs(instepWeight[user.instepHeight] - instepWeight[reviewer.instepHeight]) * 10;
  score -= Math.abs(heelWeight[user.heelSlipTendency] - heelWeight[reviewer.heelSlipTendency]) * 8;
  score -= Math.abs(lrWeight[user.leftRightDifference] - lrWeight[reviewer.leftRightDifference]) * 6;
  if (user.toeShape !== reviewer.toeShape) score -= 7;
  return Math.max(0, Math.round(score));
}

export function getSimilarReviews(user: FootProfile, reviews: ShoeReview[]): (ShoeReview & { similarity: number })[] {
  return reviews
    .map((review) => ({ ...review, similarity: calculateProfileSimilarity(user, review.reviewerFootProfile) }))
    .sort((a, b) => b.similarity - a.similarity);
}

export function explainSimilarity(user: FootProfile, reviewer: FootProfile): string[] {
  const reasons: string[] = [];

  const lengthDelta = Math.abs(user.footLengthMm - reviewer.footLengthMm);
  if (lengthDelta <= 3) reasons.push(`실측 길이 ${reviewer.footLengthMm}mm로 매우 가까움`);
  if (user.forefootWidth === reviewer.forefootWidth) reasons.push("발볼 경향 유사");
  if (user.instepHeight === reviewer.instepHeight) reasons.push("발등 경향 유사");
  if (user.toeShape === reviewer.toeShape) reasons.push("발가락 형태 유사");

  return reasons.slice(0, 3);
}

export function generateSizeRecommendation(user: FootProfile, reviews: ShoeReview[]): SizeRecommendation {
  const similar = getSimilarReviews(user, reviews).filter((r) => r.similarity >= 60).slice(0, 5);

  let baseSize = user.purchasedShoeSizeMm ?? estimateSizeFromFootLength(user.footLengthMm);
  let adjustment = 0;
  const rationale: string[] = [
    `실측 발길이 ${user.footLengthMm}mm 기준 기본 추천은 ${baseSize}mm로 잡았어요.`
  ];

  if (user.forefootWidth === "wide") {
    adjustment += 5;
  }
  if (user.instepHeight === "high") {
    adjustment += 5;
  }

  if (adjustment > 0) {
    rationale.push("앞볼 또는 발등 압박 경험을 반영해 여유 쪽으로 먼저 보았어요.");
  } else {
    rationale.push("압박 경험이 크지 않아 기본 사이즈를 우선 기준으로 두었어요.");
  }

  if (similar.length > 0) {
    const upsizeVotes = similar.filter((r) => r.purchasedSize > r.usualSize).length;
    const trueSizeVotes = similar.filter((r) => r.purchasedSize === r.usualSize).length;

    if (upsizeVotes > trueSizeVotes) {
      adjustment = Math.max(adjustment, 5);
      rationale.push("비슷한 발 조건의 핏 리뷰에서 반업/여유 선택이 더 많았어요.");
    } else {
      rationale.push("비슷한 발 조건의 핏 리뷰에서는 정사이즈 선택도 충분히 많았어요.");
    }
  }

  const recommendedSize = baseSize + (adjustment >= 5 ? 5 : 0);

  return {
    recommendedSize,
    rationale: rationale.slice(0, 3),
    recommendationNote: "실측 발길이, 착화 경험, 유사 사용자 리뷰를 함께 반영한 참고용 추천입니다."
  };
}
