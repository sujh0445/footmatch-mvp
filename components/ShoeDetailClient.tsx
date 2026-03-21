"use client";

import Link from "next/link";
import { useMemo } from "react";
import { shoeReviews } from "@/data/reviews";
import { FootProfileChips } from "@/components/FootProfileChips";
import { SimilarityBadge } from "@/components/SimilarityBadge";
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
  loose: "느슨함"
};

export function ShoeDetailClient({ shoe }: { shoe: ShoeModel }) {
  const profile = useMemo(() => getFootProfile(), []);
  const reviews = shoeReviews.filter((review) => review.shoeId === shoe.id);
  const similarReviews = profile ? getSimilarReviews(profile, reviews) : [];
  const recommendation = profile ? generateSizeRecommendation(profile, reviews) : null;

  return (
    <section className="space-y-6">
      {profile ? (
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">추천 사이즈</h2>
          {recommendation ? (
            <>
              <p className="text-2xl font-semibold">{recommendation.recommendedSize} mm</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
                {recommendation.rationale.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="text-xs text-neutral-500">{recommendation.prototypeNote}</p>
            </>
          ) : null}
        </div>
      ) : (
        <div className="card text-sm text-neutral-700">
          개인화 추천을 보려면 먼저 발 프로필을 저장해주세요.
          <div className="mt-3">
            <Link href="/onboarding" className="btn-primary">
              발 프로필 시작
            </Link>
          </div>
        </div>
      )}

      <div className="card space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500">{categoryLabel[shoe.category]}</p>
        <h1 className="text-3xl font-semibold">
          {shoe.brand} {shoe.modelName}
        </h1>
        <p className="text-neutral-700">{shoe.fitSummary}</p>
        <p className="text-sm text-neutral-600">일반적인 사이징 경향: {shoe.sizingTendency}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">나와 발이 비슷한 사용자 리뷰</h2>
        <p className="text-sm text-neutral-600">아래 리뷰는 실측 발 길이, 발볼, 발등, 발가락 모양이 유사한 순서대로 보여드려 실제 착화감 참고에 도움이 됩니다.</p>
        {similarReviews.length > 0 ? (
          <div className="grid gap-4">
            {similarReviews.map((review) => (
              <article key={review.id} className="card space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-neutral-600">사용 목적: {useCaseLabel[review.useCase]}</p>
                  <SimilarityBadge score={review.similarity} />
                </div>
                <FootProfileChips profile={review.reviewerFootProfile} />
                {profile ? (
                  <ul className="list-disc space-y-1 pl-5 text-xs text-neutral-600">
                    {explainSimilarity(profile, review.reviewerFootProfile).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <p>
                    평소 사이즈 <span className="font-medium">{review.usualSize}</span>
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
            ))}
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
