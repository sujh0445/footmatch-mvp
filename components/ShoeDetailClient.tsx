"use client";

import Link from "next/link";
import { useMemo } from "react";
import { shoeReviews } from "@/data/reviews";
import { FootProfileChips } from "@/components/FootProfileChips";
import { SimilarityBadge } from "@/components/SimilarityBadge";
import { generateSizeRecommendation, getSimilarReviews } from "@/lib/profile";
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

export function ShoeDetailClient({ shoe }: { shoe: ShoeModel }) {
  const profile = useMemo(() => getFootProfile(), []);
  const reviews = shoeReviews.filter((review) => review.shoeId === shoe.id);
  const similarReviews = profile ? getSimilarReviews(profile, reviews) : [];
  const recommendation = profile ? generateSizeRecommendation(profile, reviews) : null;

  return (
    <section className="space-y-6">
      <div className="card space-y-2">
        <p className="text-xs uppercase tracking-wide text-neutral-500">{categoryLabel[shoe.category]}</p>
        <h1 className="text-3xl font-semibold">{shoe.brand} {shoe.modelName}</h1>
        <p className="text-neutral-700">{shoe.fitSummary}</p>
        <p className="text-sm text-neutral-600">일반적인 사이징 경향: {shoe.sizingTendency}</p>
      </div>

      {profile ? (
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">사이즈 제안</h2>
          {recommendation ? (
            <>
              <p className="text-lg font-medium">{recommendation.headline}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
                {recommendation.rationale.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="text-xs text-neutral-500">{recommendation.prototypeNote}</p>
            </>
          ) : null}
        </div>
      ) : (
        <div className="card text-sm text-neutral-700">
          개인화 제안을 보려면 먼저 발 프로필을 입력해주세요.
          <div className="mt-3"><Link href="/onboarding" className="btn-primary">발 프로필 시작</Link></div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">나와 비슷한 발의 핏 리뷰</h2>
        <div className="card text-sm text-neutral-700">
          이 섹션은 단순 평점이 아니라, <span className="font-medium">발길이 차이·앞볼 압박 경험·반업 성향</span>이 비슷한 사용자의 후기를 우선 보여줍니다.
          그래서 “왜 이 리뷰가 나에게 참고가 되는지”를 함께 확인할 수 있습니다.
        </div>

        {similarReviews.length > 0 ? (
          <div className="grid gap-4">
            {similarReviews.map((review) => (
              <article key={review.id} className="card space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-neutral-600">사용 목적: {useCaseLabel[review.useCase]}</p>
                  <SimilarityBadge score={review.similarity} />
                </div>
                <FootProfileChips profile={review.reviewerFootProfile} />
                <div className="rounded-xl bg-neutral-50 p-3 text-xs text-neutral-700">
                  <p className="font-medium">이 리뷰가 참고되는 이유</p>
                  <p className="mt-1">{review.similarityReasons.join(" · ")}</p>
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <p>평소 구매 <span className="font-medium">{review.usualPurchasedSizeMm}</span></p>
                  <p>이번 구매 <span className="font-medium">{review.purchasedSizeMm}</span></p>
                  <p>앞볼 압박 <span className="font-medium">{freq(review.forefootPressure)}</span></p>
                  <p>발등 압박 <span className="font-medium">{freq(review.instepPressure)}</span></p>
                  <p>뒤꿈치 들뜸 <span className="font-medium">{freq(review.heelSlip)}</span></p>
                  <p>뒤축 안감 마모 <span className="font-medium">{freq(review.heelLiningWear)}</span></p>
                </div>
                <p className="text-sm text-neutral-700">“{review.comment}”</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="card text-sm text-neutral-600">이 모델에 대한 데모 핏 리뷰가 아직 없습니다.</div>
        )}
      </div>

      <Link href="/review" className="btn-secondary">내 핏 리뷰 작성하기</Link>
    </section>
  );
}

function freq(v: string) {
  if (v === "often") return "자주";
  if (v === "sometimes") return "가끔";
  return "거의 없음";
}
