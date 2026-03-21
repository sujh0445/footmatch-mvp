export type Frequency = "often" | "sometimes" | "rarely";
export type WidthCategory = "narrow" | "normal" | "wide";
export type InstepCategory = "low" | "normal" | "high" | "unknown";
export type ToeShape = "egyptian" | "greek" | "square" | "unknown";

export interface FootSelfInput {
  actualFootLengthMm: number;
  usualPurchasedSizeMm?: number;
  forefootSizingUpFrequency: Frequency;
  forefootPressureFrequency: Frequency;
  instepPressureFrequency: Frequency;
  preferredFit: "snug" | "regular" | "roomy";
  toeShape: ToeShape;
}

export interface PhotoShapeHints {
  forefootWidthHint: WidthCategory;
  toeShapeHint: ToeShape;
  instepHint: InstepCategory;
  pressureRiskHint: "low" | "medium" | "high";
  confidenceNote: string;
}

export interface FootProfile {
  actualFootLengthMm: number;
  usualPurchasedSizeMm?: number;
  forefootSizingUpFrequency: Frequency;
  forefootPressureFrequency: Frequency;
  instepPressureFrequency: Frequency;
  preferredFit: "snug" | "regular" | "roomy";
  toeShape: ToeShape;
  photoHints?: PhotoShapeHints;
  notes: string[];
}

export interface MockAnalysisOutput extends PhotoShapeHints {}

export interface ShoeModel {
  id: string;
  brand: string;
  modelName: string;
  category: "running" | "lifestyle" | "training";
  fitSummary: string;
  sizingTendency: string;
}

export interface ShoeReview {
  id: string;
  shoeId: string;
  reviewerFootProfile: Pick<FootProfile, "actualFootLengthMm" | "usualPurchasedSizeMm" | "forefootSizingUpFrequency" | "forefootPressureFrequency" | "toeShape">;
  usualPurchasedSizeMm: number;
  purchasedSizeMm: number;
  forefootPressure: Frequency;
  instepPressure: Frequency;
  heelSlip: Frequency;
  heelLiningWear: Frequency;
  comfortRating: number;
  comment: string;
  useCase: "daily" | "walking" | "running" | "gym" | "style";
  tags?: string[];
}

export interface SizeRecommendation {
  recommendedSizeMm: number;
  headline: string;
  rationale: string[];
  prototypeNote: string;
}
