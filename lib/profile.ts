import { FootProfile, FootSelfInput, Frequency, MockAnalysisOutput, ShoeReview, SizeRecommendation } from "@/types";

const frequencyWeight: Record<Frequency, number> = {
  often: 2,
  sometimes: 1,
  rarely: 0
};

const toeScore: Record<string, number> = {
  egyptian: 2,
  greek: 1,
  square: 0,
  unknown: 1
};

export function normalizeFootProfile(selfInput: FootSelfInput, analysis?: MockAnalysisOutput | null): FootProfile {
  const notes: string[] = ["길이는 입력값 기준으로 사용됩니다."];

  if (analysis) {
    notes.push("사진은 발 형태 경향을 참고용으로 분석합니다.");
  } else {
    notes.push("사진 없이 입력 정보 중심으로 추천이 생성됩니다.");
  }

  return {
    actualFootLengthMm: selfInput.actualFootLengthMm,
    usualPurchasedSizeMm: selfInput.usualPurchasedSizeMm,
    forefootSizingUpFrequency: selfInput.forefootSizingUpFrequency,
    forefootPressureFrequency: selfInput.forefootPressureFrequency,
    instepPressureFrequency: selfInput.instepPressureFrequency,
    preferredFit: selfInput.preferredFit,
    toeShape: selfInput.toeShape,
    photoHints: analysis ?? undefined,
    notes
  };
}

export function calculateProfileSimilarity(user: FootProfile, reviewer: ShoeReview["reviewerFootProfile"]): number {
  let score = 100;
  const lengthDelta = Math.abs(user.actualFootLengthMm - reviewer.actualFootLengthMm);
  score -= Math.min(30, lengthDelta * 2);

  score -= Math.abs(
    frequencyWeight[user.forefootSizingUpFrequency] - frequencyWeight[reviewer.forefootSizingUpFrequency]
  ) * 12;
  score -= Math.abs(
    frequencyWeight[user.forefootPressureFrequency] - frequencyWeight[reviewer.forefootPressureFrequency]
  ) * 14;

  const userToe = user.toeShape;
  const reviewerToe = reviewer.toeShape;
  score -= Math.abs(toeScore[userToe] - toeScore[reviewerToe]) * 5;

  return Math.max(0, Math.round(score));
}

function similarityReasons(user: FootProfile, reviewer: ShoeReview["reviewerFootProfile"]): string[] {
  const reasons: string[] = [];
  const lengthDelta = Math.abs(user.actualFootLengthMm - reviewer.actualFootLengthMm);
  if (lengthDelta <= 5) reasons.push("실제 발길이 차이가 작음");
  if (user.forefootPressureFrequency === reviewer.forefootPressureFrequency) reasons.push("앞볼 압박 경험이 비슷함");
  if (user.forefootSizingUpFrequency === reviewer.forefootSizingUpFrequency) reasons.push("반업/업사이징 성향이 비슷함");
  if (reasons.length === 0) reasons.push("핵심 착화 패턴 일부가 유사함");
  return reasons;
}

export function getSimilarReviews(user: FootProfile, reviews: ShoeReview[]) {
  return reviews
    .map((review) => ({
      ...review,
      similarity: calculateProfileSimilarity(user, review.reviewerFootProfile),
      similarityReasons: similarityReasons(user, review.reviewerFootProfile)
    }))
    .sort((a, b) => b.similarity - a.similarity);
}

export function generateSizeRecommendation(user: FootProfile, reviews: ShoeReview[]): SizeRecommendation {
  const similar = getSimilarReviews(user, reviews).filter((r) => r.similarity >= 60).slice(0, 5);
  const base = user.actualFootLengthMm;

  let adjustment = 0;
  const rationale: string[] = ["입력한 실제 발길이를 기준으로 시작했습니다."];

  if (user.forefootPressureFrequency === "often") {
    adjustment += 5;
    rationale.push("앞볼 압박 경험이 잦아 반업 쪽을 우선 검토했습니다.");
  } else if (user.forefootPressureFrequency === "sometimes") {
    adjustment += 2.5;
    rationale.push("앞볼 압박 경험을 반영해 약간 여유 있는 선택을 고려했습니다.");
  }

  if (user.forefootSizingUpFrequency === "often") {
    adjustment += 5;
    rationale.push("평소 발볼 때문에 크게 사는 성향을 반영했습니다.");
  }

  if (user.usualPurchasedSizeMm) {
    const habitGap = user.usualPurchasedSizeMm - user.actualFootLengthMm;
    if (habitGap >= 5) {
      adjustment = Math.max(adjustment, 5);
      rationale.push("평소 구매 사이즈 이력을 참고하면 반업이 더 무난할 수 있습니다.");
    }
  }

  const upVotes = similar.filter((r) => r.purchasedSizeMm > r.usualPurchasedSizeMm).length;
  const trueVotes = similar.filter((r) => r.purchasedSizeMm === r.usualPurchasedSizeMm).length;
  if (upVotes > trueVotes) rationale.push("나와 비슷한 발 후기에서 정사이즈보다 반업 의견이 더 많았습니다.");

  const recommendedSizeMm = Math.round((base + (adjustment >= 5 ? 5 : 0)) / 5) * 5;

  return {
    recommendedSizeMm,
    headline: `${recommendedSizeMm} 우선 검토`,
    rationale,
    prototypeNote: "결과는 구매 판단을 돕기 위한 참고 정보이며, 브랜드별 라스트 차이를 함께 확인해주세요."
  };
}
