export type WidthCategory = "narrow" | "normal" | "wide";
export type InstepCategory = "low" | "normal" | "high";
export type ToeShape = "egyptian" | "greek" | "square";
export type HeelSlipTendency = "low" | "medium" | "high";
export type LeftRightDifference = "small" | "medium" | "large";

export interface FootSelfInput {
  actualFootLengthMm: number;
  purchasedShoeSizeMm?: number;
  sizeUpForWidth: "rarely" | "sometimes" | "often";
  instepPressureExperience: "rarely" | "sometimes" | "often";
  commonIssue: "toe_tightness" | "width_pressure" | "instep_pressure" | "heel_slip" | "none";
  preferredFit: "snug" | "regular" | "roomy";
}

export interface FootProfile {
  footLengthMm: number;
  forefootWidth: WidthCategory;
  instepHeight: InstepCategory;
  toeShape: ToeShape;
  heelSlipTendency: HeelSlipTendency;
  leftRightDifference: LeftRightDifference;
  purchasedShoeSizeMm?: number;
  notes?: string[];
}

export interface MockAnalysisOutput {
  forefootWidth: WidthCategory;
  instepHeight: InstepCategory;
  toeShape: ToeShape;
  heelSlipTendency: HeelSlipTendency;
  leftRightDifference: LeftRightDifference;
  confidence: number;
}

export interface ShoeModel {
  id: string;
  brand: string;
  modelName: string;
  category: "running" | "lifestyle" | "training";
  fitSummary: string;
  sizingTendency: string;
  imageSrc: string;
  imageAlt: string;
  productUrl?: string;
}

export interface ShoeReview {
  id: string;
  shoeId: string;
  reviewerFootProfile: FootProfile;
  usualSize: number;
  purchasedSize: number;
  fitLength: "tight" | "true" | "long";
  fitWidth: "tight" | "true" | "roomy";
  fitInstep: "tight" | "true" | "roomy";
  heelLock: "secure" | "ok" | "loose";
  comfortRating: number;
  comment: string;
  painPoint: string;
  comfortPoint: string;
  useCase: "daily" | "walking" | "running" | "gym" | "style";
  tags?: string[];
}

export interface SizeRecommendation {
  recommendedSize: number;
  rationale: string[];
  recommendationNote: string;
}
