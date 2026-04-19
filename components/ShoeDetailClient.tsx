"use client";

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

  return (
    <section className="space-y-6">
      <div className="card space-y-3 overflow-hidden p-0">
        <img src={shoe.imageSrc} alt={shoe.imageAlt} className="h-64 w-full object-cover" />
        <div className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wide text-neutral-500">{categoryLabel[shoe.category]}</p>
          <h1 className="text-3xl font-semibold">
            {shoe.brand} {shoe.modelName}
          </h1>
          <p className="text-neutral-700">{shoe.fitSummary}</p>
          <p className="text-sm text-neutral-600">기본 경향: {shoe.sizingTendency}</p>
          {shoe.productUrl ? (
            <a href={shoe.productUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4">
              공식 제품 정보 보기
            </a>
          ) : null}
        </div>
      </div>

      {profile ? (
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">내 발 기준 추천</h2>
          {recommendation ? (
            <>
              <p className="text-2xl font-semibold">추천 사이즈 {recommendation.recommendedSize}</p>
              <div className="space-y-1 text-sm text-neutral-700">
                {recommendation.rationale.slice(0, 2).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <p className="text-xs text-neutral-500">주의 포인트: {recommendation.recommendationNote}</p>
            </>
          ) : null}
        </div>
      ) : (
        <div className="card space-y-3 text-sm text-neutral-700">
          <p>내 발 기준으로 보려면 발 프로필을 입력해주세요.</p>
          <div className="mt-3">
            <Link href="/onboarding" className="btn-primary">
              발 프로필 입력하기
            </Link>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="space-y-3">
          <div className="card space-y-3 text-sm text-neutral-600">
            <h3 className="text-base font-semibold text-neutral-900">아직 등록된 핏 리뷰가 적어요</h3>
            <Link href="/review" className="btn-secondary">
              첫 리뷰 남기기
            </Link>
          </div>
        </div>
      ) : profile ? (
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">내 발과 비슷한 리뷰</h2>
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
            <h2 className="text-xl font-semibold">전체 리뷰</h2>
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
            내 리뷰 등록하기
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
            내 리뷰 등록하기
          </Link>
        </div>
      )}
    </section>
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
