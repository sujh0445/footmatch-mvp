"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { shoeReviews } from "@/data/reviews";
import { FootProfileChips } from "@/components/FootProfileChips";
import { explainSimilarity, generateSizeRecommendation, getSimilarReviews } from "@/lib/profile";
import { getFootProfile } from "@/lib/storage";
import { ShoeReview } from "@/types";
import { getFitInsightDraftPreview } from "@/data/shoes";
import type { CatalogShoe } from "@/data/shoes";

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

export function ShoeDetailClient({ shoe }: { shoe: CatalogShoe }) {
  const profile = useMemo(() => getFootProfile(), []);
  const reviews = shoeReviews.filter((review) => review.shoeId === shoe.id);
  const similarReviews = profile ? getSimilarReviews(profile, reviews).slice(0, 5) : [];
  const similarReviewIds = new Set(similarReviews.map((review) => review.id));
  const remainingReviews = profile ? reviews.filter((review) => !similarReviewIds.has(review.id)) : reviews;
  const recommendation = profile ? generateSizeRecommendation(profile, reviews) : null;
  const fitInsightPreview = getFitInsightDraftPreview(shoe);
  const similarReasonSummary =
    profile && similarReviews.length > 0
      ? Array.from(
          new Set(similarReviews.flatMap((review) => explainSimilarity(profile, review.reviewerFootProfile)))
        ).slice(0, 4)
      : [];

  return (
    <section className="space-y-6">
      <div className="card space-y-3 overflow-hidden p-0">
        <div className="relative h-64 w-full">
          <Image src={shoe.imageSrc} alt={shoe.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
        </div>
        <div className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wide text-neutral-500">{categoryLabel[shoe.category]}</p>
          <h1 className="text-3xl font-semibold">
            {shoe.brand} {shoe.modelName}
          </h1>
          <p className="text-neutral-700">{shoe.fitSummary}</p>
          <p className="text-sm text-neutral-600">기본 경향: {shoe.sizingTendency}</p>
          {fitInsightPreview ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-700">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">핏 인사이트</p>
              <h2 className="mt-1 text-base font-semibold text-neutral-900">{fitInsightPreview.title}</h2>
              <p className="mt-2">{fitInsightPreview.summary}</p>
              <ul className="mt-3 space-y-1">
                {fitInsightPreview.lines.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {shoe.productUrl ? (
            <a href={shoe.productUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4">
              공식 정보
            </a>
          ) : null}
        </div>
      </div>

      {profile ? (
        <div className="card space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">사이즈 판단</h2>
            <p className="text-sm text-neutral-600">
              이 신발을 기준으로 내 발 기준과 비슷한 리뷰를 함께 보고, 먼저 확인할 사이즈를 정리했어요.
            </p>
          </div>
          {recommendation ? (
            <>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-sm font-medium text-neutral-600">추천 사이즈</p>
                <p className="mt-1 text-xl font-semibold">{getDecisionSentence(recommendation)}</p>
                {getComparisonCandidate(recommendation) ? (
                  <p className="mt-2 text-sm text-neutral-700">
                    딱 맞게 신는 편이면 {getComparisonCandidate(recommendation)}mm도 비교 후보입니다.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-neutral-700">압박 경험이 적다면 우선 추천 사이즈부터 확인하세요.</p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DecisionMetric label="우선 추천" value={`${recommendation.recommendedSize}mm`} />
                <DecisionMetric
                  label="비교 후보"
                  value={getComparisonCandidate(recommendation) ? `${getComparisonCandidate(recommendation)}mm` : "동일 사이즈 우선"}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold">추천 근거</h3>
                <div className="grid gap-2">
                  {buildEvidenceItems(recommendation).map((item) => (
                    <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-3 text-sm">
                      <p className="text-xs font-medium text-neutral-500">{item.label}</p>
                      <p className="mt-1 text-neutral-800">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm">
                <p className="font-semibold">주의 조건</p>
                <p className="mt-1 text-neutral-700">{getCautionText(recommendation)}</p>
                <p className="mt-2 text-xs text-neutral-500">판단 기준: {recommendation.recommendationNote}</p>
              </div>

              {similarReviews.length > 0 ? (
                <div className="space-y-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">근거 리뷰</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-neutral-600">
                      판단에 {similarReviews.length}개 반영
                    </span>
                  </div>
                  {similarReasonSummary.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {similarReasonSummary.map((reason) => (
                        <span key={reason} className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700">
                          {reason}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : (
        <div className="card space-y-3 text-sm text-neutral-700">
          <p>발 프로필을 만들면 이 신발의 사이즈 판단과 근거 리뷰를 내 발 기준으로 볼 수 있어요.</p>
          <div className="mt-3">
            <Link href="/onboarding" className="btn-primary">
              사이즈 판단 시작하기
            </Link>
          </div>
        </div>
      )}

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
          <h2 className="text-xl font-semibold">핏 리뷰</h2>
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

function getCautionText(recommendation: { recommendedSize: number; baseSize: number }) {
  const comparisonCandidate = getComparisonCandidate(recommendation);

  return comparisonCandidate
    ? `압박을 피하려면 ${recommendation.recommendedSize}mm를 우선 보고, 딱 맞게 신는 편이면 ${comparisonCandidate}mm와 비교하세요.`
    : "압박 경험이 적은 기준입니다. 브랜드별 착화감 차이는 비슷한 핏 리뷰로 한 번 더 확인하세요.";
}

function DecisionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
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
