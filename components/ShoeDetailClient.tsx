"use client";

import Link from "next/link";
import { useMemo } from "react";
import { shoeReviews } from "@/data/reviews";
import { FootProfileChips } from "@/components/FootProfileChips";
import { explainSimilarity, generateSizeRecommendation, getSimilarReviews } from "@/lib/profile";
import { getFootProfile } from "@/lib/storage";
import { ShoeModel } from "@/types";

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
  const recommendation = profile ? generateSizeRecommendation(profile, reviews) : null;

  return (
    <section className="space-y-6">
      {profile ? (
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">추천 사이즈</h2>
          {recommendation ? (
            <>
              <p className="text-2xl font-semibold">{recommendation.recommendedSize} mm</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
                {recommendation.rationale.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="text-xs text-neutral-500">{recommendation.recommendationNote}</p>
              <div className="overflow-hidden rounded-2xl border border-neutral-200">
                <img src={shoe.imageSrc} alt={shoe.imageAlt} className="h-56 w-full object-cover" />
                <div className="space-y-2 p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">추천 모델</p>
                  <p className="text-lg font-semibold">{shoe.brand} {shoe.modelName}</p>
                  <p className="text-sm text-neutral-600">추천 사이즈 기준으로 먼저 비교해보기 좋은 모델입니다.</p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div className="card text-sm text-neutral-700">
          개인화 추천을 보려면 먼저 발 프로필을 저장해주세요.
          <div className="mt-3">
            <Link href="/onboarding" className="btn-primary">
              발 분석하기
            </Link>
          </div>
        </div>
      )}

      <div className="card space-y-3 overflow-hidden p-0">
        <img src={shoe.imageSrc} alt={shoe.imageAlt} className="h-64 w-full object-cover" />
        <div className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-wide text-neutral-500">{categoryLabel[shoe.category]}</p>
          <h1 className="text-3xl font-semibold">
            {shoe.brand} {shoe.modelName}
          </h1>
          <p className="text-neutral-700">{shoe.fitSummary}</p>
          <p className="text-sm text-neutral-600">일반적인 사이징 경향: {shoe.sizingTendency}</p>
          {shoe.productUrl ? (
            <a href={shoe.productUrl} target="_blank" rel="noreferrer" className="inline-flex text-sm font-medium text-neutral-900 underline underline-offset-4">
              공식 제품 정보 보기
            </a>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">나와 발이 비슷한 사용자 리뷰</h2>
        <p className="text-sm text-neutral-600">
          아래 핏 리뷰는 실측 발길이, 발볼, 발등, 발가락 형태가 비슷한 사용자 순으로 보여드립니다.
        </p>
        {similarReviews.length > 0 ? (
          <div className="grid gap-4">
            {similarReviews.map((review) => {
              const reasons = profile ? explainSimilarity(profile, review.reviewerFootProfile) : [];
              return (
                <article key={review.id} className="card space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-neutral-600">사용 목적: {useCaseLabel[review.useCase]}</p>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                      {reasons.length > 0 ? `비슷한 이유 ${reasons.length}개` : "참고 리뷰"}
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
            })}
          </div>
        ) : (
          <div className="card text-sm text-neutral-600">이 모델에 대한 리뷰가 아직 없습니다.</div>
        )}
      </div>

      <Link href="/review" className="btn-secondary">
        내 리뷰 등록하기
      </Link>
    </section>
  );
}
