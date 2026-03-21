import { FootProfile, FootSelfInput, MockAnalysisOutput, ShoeReview, SizeRecommendation } from "@/types";

function roundToNearestFive(value: number): number {
  return Math.round(value / 5) * 5;
}

function estimateSizeFromFootLength(lengthMm: number): number {
  return roundToNearestFive(lengthMm + 10);
}

export function normalizeFootProfile(analysis: MockAnalysisOutput, selfInput: FootSelfInput): FootProfile {
  const notes: string[] = [];

  if (selfInput.commonIssue === "heel_slip" && analysis.heelSlipTendency !== "low") {
    notes.push("촬영 이미지 기준 추정에서도 뒤꿈치 고정 이슈 가능성이 보여요.");
  }

  if (selfInput.preferredFit === "roomy" && analysis.forefootWidth !== "narrow") {
    notes.push("여유 핏 선호와 발 앞쪽 볼륨이 잘 맞는 편입니다.");
  }

  return {
    footLengthMm: selfInput.actualFootLengthMm,
    forefootWidth: analysis.forefootWidth,
    instepHeight: analysis.instepHeight,
    toeShape: analysis.toeShape,
    heelSlipTendency: analysis.heelSlipTendency,
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
  if (lengthDelta <= 3) reasons.push(`실측 발 길이 차이가 ${lengthDelta}mm로 매우 작아요.`);

  if (user.forefootWidth === reviewer.forefootWidth) reasons.push("발볼 경향이 비슷해 앞쪽 압박 체감도 유사할 가능성이 있어요.");
  if (user.instepHeight === reviewer.instepHeight) reasons.push("발등 높이가 비슷해 끈 조임/압박 느낌이 유사할 수 있어요.");
  if (user.toeShape === reviewer.toeShape) reasons.push("발가락 모양이 비슷해 앞코 공간 체감 참고에 도움이 됩니다.");

  return reasons.slice(0, 2);
}

export function generateSizeRecommendation(user: FootProfile, reviews: ShoeReview[]): SizeRecommendation {
  const similar = getSimilarReviews(user, reviews).filter((r) => r.similarity >= 65).slice(0, 5);

  let adjustment = 0;
  const rationale: string[] = [];

  if (user.forefootWidth === "wide") {
    adjustment += 5;
    rationale.push("앞발 너비가 넓은 편으로 보여 앞쪽 압박 완화를 위해 +5mm 여유를 우선 고려했어요.");
  }

  if (user.instepHeight === "high") {
    adjustment += 5;
    rationale.push("발등 높이가 있어 끈/혀 압박 완화를 위해 +5mm 여유를 반영했어요.");
  }

  const upsizeVotes = similar.filter((r) => r.purchasedSize > r.usualSize).length;
  const trueSizeVotes = similar.filter((r) => r.purchasedSize === r.usualSize).length;

  if (upsizeVotes > trueSizeVotes) {
    rationale.push("비슷한 발의 핏 리뷰에서 업사이징 선택이 더 많았어요.");
  } else {
    adjustment -= 5;
    rationale.push("비슷한 발의 핏 리뷰에서 정사이즈 선택이 더 많았어요.");
  }

  if (user.heelSlipTendency === "high" && adjustment > 0) {
    adjustment -= 5;
    rationale.push("뒤꿈치 들림 경향을 고려해 과한 업사이징은 줄였어요.");
  }

  const baseSize = user.purchasedShoeSizeMm ?? estimateSizeFromFootLength(user.footLengthMm);
  const recommendedSize = baseSize + (adjustment >= 5 ? 5 : 0);

  return {
    recommendedSize,
    rationale,
    recommendationNote: "실측 발 길이(mm), 착화 경험, 비슷한 발의 핏 리뷰를 함께 반영한 참고용 추천입니다."
  };
}
