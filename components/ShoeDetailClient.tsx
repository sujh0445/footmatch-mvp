"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { shoeReviews } from "@/data/reviews";
import { FootProfileChips } from "@/components/FootProfileChips";
import { explainSimilarity, generateSizeRecommendation, getSimilarReviews } from "@/lib/profile";
import { getFootProfile } from "@/lib/storage";
import { ShoeModel, ShoeReview } from "@/types";

const categoryLabel: Record<string, string> = {
  running: "러닝",
  lifestyle: "라이프스타일",
  training: "트레이닝"
};

const useCaseLabel: Record<string, string> = {
  daily: "데일리",
  walking: "워킹",
  running: "러닝",
  gym: "헬스",
  style: "스타일"
};

const fitLabel: Record<string, string> = {
  tight: "타이트",
  true: "정사이즈",
  roomy: "여유",
  secure: "단단함",
  ok: "보통",
  loose: "느슨함",
  long: "길게 느낌"
};

export function ShoeDetailClient({ shoe }: { shoe: ShoeModel }) {
  const profile = useMemo(() => getFootProfile(), []);
  const reviews = shoeReviews.filter((review) => review.shoeId === shoe.id);
  const similarReviews = profile ? getSimilarReviews(profile, reviews).slice(0, 5) : [];
  const similarReviewIds = new Set(similarReviews.map((review) => review.id));
  const remainingReviews = profile ? reviews.filter((review) => !similarReviewIds.has(review.id)) : reviews;
  const recommendation = profile ? generateSizeRecommendation(profile, reviews) : null;
  const similarReasonSummary =
    profile && similarReviews.length > 0
      ? Array.from(
          new Set(similarReviews.flatMap((review) => explainSimilarity(profile, review.reviewerFootProfile)))
        ).slice(0, 4)
      : [];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        {profile ? (
          <div className="card space-y-4 border-neutral-900 bg-neutral-900 text-white">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">사이즈 판단</p>
                <div>
                  <h1 className="text-3xl font-semibold">
                    {shoe.brand} {shoe.modelName}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/75">
                    내 발 기준과 비슷한 리뷰를 기준으로 먼저 확인할 사이즈를 정리했어요.
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/75">
                {categoryLabel[shoe.category]}
              </span>
            </div>

            {recommendation ? (
              <>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <DecisionMetric label="추천 사이즈" value={`${recommendation.recommendedSize}mm`} tone="dark" />
                  <DecisionMetric
                    label="비교 사이즈"
                    value={getComparisonCandidate(recommendation) ? `${getComparisonCandidate(recommendation)}mm` : "동일 사이즈 우선"}
                    tone="dark"
                  />
                  <InfoCard
                    label="이유"
                    text={getPrimaryReason(recommendation)}
                    tone="dark"
                  />
                  <InfoCard
                    label="주의 포인트"
                    text={getCautionText(recommendation)}
                    tone="dark"
                  />
                </div>

                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white/70">추천 사이즈</p>
                        <p className="mt-1 text-2xl font-semibold">{getDecisionSentence(recommendation)}</p>
                      </div>
                      <p className="text-sm text-white/65">{shoe.sizingTendency}</p>
                    </div>
                    <p className="mt-3 text-sm text-white/75">{recommendation.recommendationNote}</p>
                  </div>

                  {similarReviews.length > 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-white p-4 text-neutral-900">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold">근거 리뷰</p>
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                          {similarReviews.length}개 반영
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-neutral-700">비슷한 발 프로필 리뷰를 먼저 보여드려요.</p>
                      {similarReasonSummary.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {similarReasonSummary.map((reason) => (
                            <span key={reason} className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700">
                              {reason}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <div className="card space-y-4 border-neutral-900 bg-neutral-900 text-white">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">사이즈 판단</p>
              <h1 className="text-3xl font-semibold">
                {shoe.brand} {shoe.modelName}
              </h1>
              <p className="max-w-2xl text-sm text-white/75">발 프로필을 만들면 이 신발의 추천 사이즈와 근거 리뷰를 바로 볼 수 있어요.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoCard label="추천 사이즈" text="발 프로필을 만들면 바로 확인할 수 있어요." tone="dark" />
              <InfoCard label="비교 사이즈" text="내 발 기준으로 함께 비교할 사이즈를 보여드려요." tone="dark" />
              <InfoCard label="근거 리뷰" text="비슷한 발 프로필 리뷰를 먼저 정리해드려요." tone="dark" />
            </div>
            <div>
              <Link href="/onboarding" className="btn-primary">
                사이즈 판단 시작하기
              </Link>
            </div>
          </div>
        )}

        <div className="card overflow-hidden p-0">
          <div className="relative h-56 w-full">
            <Image src={shoe.imageSrc} alt={shoe.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 32vw, 100vw" />
          </div>
          <div className="space-y-3 p-5">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-neutral-500">제품 정보</p>
              <p className="text-sm font-medium text-neutral-900">{shoe.fitSummary}</p>
            </div>
            <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-2 lg:grid-cols-1">
              <InfoCard label="기본 핏" text={shoe.sizingTendency} />
              <InfoCard label="사용 장면" text={categoryLabel[shoe.category]} />
            </div>
            {shoe.productUrl ? (
              <a href={shoe.productUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4">
                공식 정보
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="space-y-3">
          <div className="card space-y-3 text-sm text-neutral-600">
            <h3 className="text-base font-semibold text-neutral-900">아직 등록된 핏 리뷰가 적어요</h3>
            <Link href="/review" className="btn-secondary">
              첫 핏 리뷰 남기기
            </Link>
          </div>
        </div>
      ) : profile ? (
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">근거 리뷰</h2>
            <div className="grid gap-4">
              {similarReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  reasons={explainSimilarity(profile, review.reviewerFootProfile)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">전체 핏 리뷰</h2>
            {remainingReviews.length > 0 ? (
              <div className="grid gap-4">
                {remainingReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="card text-sm text-neutral-600">나머지 리뷰가 없습니다.</div>
            )}
          </section>

          <Link href="/review" className="btn-secondary">
            리뷰 작성
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">전체 핏 리뷰</h2>
          <div className="grid gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <Link href="/review" className="btn-secondary">
            리뷰 작성
          </Link>
        </div>
      )}
    </section>
  );
}

function getComparisonCandidate(recommendation: { recommendedSize: number; baseSize: number }) {
  return recommendation.recommendedSize !== recommendation.baseSize ? recommendation.baseSize : null;
}

function getDecisionSentence(recommendation: { recommendedSize: number; baseSize: number }) {
  const comparisonCandidate = getComparisonCandidate(recommendation);
  return comparisonCandidate
    ? `${recommendation.recommendedSize}mm를 우선 추천합니다.`
    : `${recommendation.recommendedSize}mm를 먼저 확인하세요.`;
}

function buildEvidenceItems(recommendation: { rationale: string[] }) {
  const [lengthReason, pressureReason, reviewReason] = recommendation.rationale;
  const items = [
    { label: "발길이 기준", text: lengthReason },
    { label: "압박 경험", text: pressureReason },
    { label: "비슷한 리뷰", text: reviewReason }
  ];

  return items.filter((item): item is { label: string; text: string } => Boolean(item.text));
}

function getPrimaryReason(recommendation: { rationale: string[] }) {
  return buildEvidenceItems(recommendation)
    .map((item) => item.text)
    .join(" ");
}

function getCautionText(recommendation: { recommendedSize: number; baseSize: number }) {
  const comparisonCandidate = getComparisonCandidate(recommendation);

  return comparisonCandidate
    ? `압박을 피하려면 ${recommendation.recommendedSize}mm를 우선 보고, 딱 맞게 신는 편이면 ${comparisonCandidate}mm와 비교하세요.`
    : "압박 경험이 적은 기준입니다. 브랜드별 착화감 차이는 비슷한 핏 리뷰로 한 번 더 확인하세요.";
}

function InfoCard({ label, text, tone = "light" }: { label: string; text: string; tone?: "light" | "dark" }) {
  const isDark = tone === "dark";

  return (
    <div
      className={
        isDark
          ? "rounded-3xl border border-white/10 bg-white/5 p-4"
          : "rounded-3xl border border-neutral-200 bg-neutral-50 p-4"
      }
    >
      <p className={isDark ? "text-xs font-medium text-white/60" : "text-xs font-medium text-neutral-500"}>{label}</p>
      <p className={isDark ? "mt-1 text-sm text-white/85" : "mt-1 text-sm text-neutral-800"}>{text}</p>
    </div>
  );
}

function DecisionMetric({ label, value, tone = "light" }: { label: string; value: string; tone?: "light" | "dark" }) {
  const isDark = tone === "dark";

  return (
    <div
      className={
        isDark
          ? "rounded-3xl border border-white/10 bg-white/5 p-4"
          : "rounded-3xl border border-neutral-200 bg-white p-4"
      }
    >
      <p className={isDark ? "text-xs font-medium text-white/60" : "text-xs font-medium text-neutral-500"}>{label}</p>
      <p className={isDark ? "mt-1 text-lg font-semibold text-white" : "mt-1 text-lg font-semibold"}>{value}</p>
    </div>
  );
}

function ReviewCard({ review, reasons = [] }: { review: ShoeReview; reasons?: string[] }) {
  return (
    <article className="card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-neutral-600">사용 목적: {useCaseLabel[review.useCase]}</p>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
          {reasons.length > 0 ? `비슷한 이유 ${reasons.length}개` : "핏 리뷰"}
        </span>
      </div>

      {reasons.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {reasons.map((reason) => (
            <span key={reason} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700">
              {reason}
            </span>
          ))}
        </div>
      ) : null}

      <FootProfileChips profile={review.reviewerFootProfile} />

      <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <p>
          평소 자주 신는 운동화 사이즈 <span className="font-medium">{review.usualSize}</span>
        </p>
        <p>
          구매 사이즈 <span className="font-medium">{review.purchasedSize}</span>
        </p>
        <p>
          발볼 핏 <span className="font-medium">{fitLabel[review.fitWidth]}</span>
        </p>
        <p>
          발등 핏 <span className="font-medium">{fitLabel[review.fitInstep]}</span>
        </p>
      </div>
      <p className="text-sm text-neutral-700">“{review.comment}”</p>
      <p className="text-xs text-neutral-600">불편 포인트: {review.painPoint}</p>
      <p className="text-xs text-neutral-600">좋았던 포인트: {review.comfortPoint}</p>
    </article>
  );
}
