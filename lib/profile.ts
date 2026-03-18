import { FootProfile, FootSelfInput, MockAnalysisOutput, ShoeReview, SizeRecommendation } from "@/types";

export function normalizeFootProfile(analysis: MockAnalysisOutput, selfInput: FootSelfInput): FootProfile {
  const notes: string[] = [];

  if (selfInput.commonIssue === "heel_slip" && analysis.heelSlipTendency !== "low") {
    notes.push("자가 입력한 뒤꿈치 들림 경향이 분석 결과와 유사합니다.");
  }

  if (selfInput.preferredFit === "roomy" && analysis.forefootWidth !== "narrow") {
    notes.push("여유 핏 선호와 현재 발볼 볼륨이 잘 맞을 가능성이 있습니다.");
  }

  return {
    footLengthMm: analysis.footLengthMm,
    forefootWidth: analysis.forefootWidth,
    instepHeight: analysis.instepHeight,
    toeShape: analysis.toeShape,
    heelSlipTendency: analysis.heelSlipTendency,
    leftRightDifference: analysis.leftRightDifference,
    usualSneakerSize: selfInput.usualSneakerSize,
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

export function generateSizeRecommendation(user: FootProfile, reviews: ShoeReview[]): SizeRecommendation {
  const similar = getSimilarReviews(user, reviews).filter((r) => r.similarity >= 65).slice(0, 5);

  let adjustment = 0;
  const rationale: string[] = [];

  if (user.forefootWidth === "wide") {
    adjustment += 5;
    rationale.push("비슷한 발볼 사용자들은 반 사이즈 업에서 압박이 줄어드는 경우가 많았습니다.");
  }

  if (user.instepHeight === "high") {
    adjustment += 5;
    rationale.push("발등이 높은 프로필은 반 사이즈 업에서 발등 압박이 줄었다는 리뷰가 많았습니다.");
  }

  const upsizeVotes = similar.filter((r) => r.purchasedSize > r.usualSize).length;
  const trueSizeVotes = similar.filter((r) => r.purchasedSize === r.usualSize).length;

  if (upsizeVotes > trueSizeVotes) {
    rationale.push("유사도가 높은 리뷰어 다수가 업사이징을 선택했습니다.");
  } else {
    adjustment -= 5;
    rationale.push("유사도가 높은 리뷰어 다수가 정사이즈를 선택했습니다.");
  }

  if (user.heelSlipTendency === "high" && adjustment > 0) {
    rationale.push("뒤꿈치 들림 경향을 고려해 과도한 사이즈 업은 피했습니다.");
  }

  const recommendedSize = user.usualSneakerSize + (adjustment >= 5 ? 5 : 0);

  return {
    recommendedSize,
    rationale,
    prototypeNote: "로컬 규칙과 데모 리뷰 데이터 기반의 프로토타입 추천입니다."
  };
}
