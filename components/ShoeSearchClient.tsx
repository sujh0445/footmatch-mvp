"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { shoes } from "@/data/shoes";
import { getFootProfile } from "@/lib/storage";
import { FootProfile } from "@/types";

const categoryLabel: Record<string, string> = {
  running: "러닝",
  lifestyle: "라이프스타일",
  training: "트레이닝"
};

function getBadges(shoe: (typeof shoes)[number]) {
  const text = `${shoe.brand} ${shoe.modelName} ${shoe.fitSummary}`.toLowerCase();
  const badges: string[] = [];

  if (text.includes("정사이즈")) badges.push("정사이즈");
  if (text.includes("반업")) badges.push("반업 고려");
  if (text.includes("앞볼") || text.includes("타이트")) badges.push("앞볼 타이트");
  if (text.includes("여유")) badges.push("앞쪽 여유");
  if (text.includes("발등")) badges.push("발등 체크");
  if (text.includes("쿠션")) badges.push("쿠션감");
  if (text.includes("러닝")) badges.push("러닝용");
  if (text.includes("워크") || text.includes("보행")) badges.push("장시간 착용");

  if (badges.length === 0) {
    badges.push(categoryLabel[shoe.category]);
  }

  return badges.slice(0, 3);
}

function getRecommendationReasons(shoe: (typeof shoes)[number], profile: FootProfile) {
  const text = `${shoe.fitSummary} ${shoe.sizingTendency}`.toLowerCase();
  const reasons: string[] = [];

  if (profile.forefootWidth === "wide") {
    if (text.includes("여유") || text.includes("볼륨") || text.includes("넉넉")) reasons.push("앞볼 여유 우선");
    if (text.includes("타이트") || text.includes("좁")) reasons.push("앞볼 압박 주의");
  } else if (text.includes("정사이즈")) {
    reasons.push("정사이즈 후보");
  }

  if (profile.instepHeight === "high") {
    if (text.includes("압박이 과하지") || text.includes("발등 압박은") || text.includes("여유")) reasons.push("발등 부담 적음");
    if (text.includes("발등") && (text.includes("답답") || text.includes("조여") || text.includes("타이트"))) reasons.push("발등 압박 주의");
  }

  if (profile.heelSlipTendency === "high" && (text.includes("고정") || text.includes("잡아"))) {
    reasons.push("뒤꿈치 안정 우선");
  }

  if (text.includes("쿠션") || text.includes("장시간")) reasons.push("장시간 착용 후보");
  if (reasons.length === 0) reasons.push(categoryLabel[shoe.category]);

  return reasons.slice(0, 3);
}

function scoreShoeForProfile(shoe: (typeof shoes)[number], profile: FootProfile) {
  const text = `${shoe.fitSummary} ${shoe.sizingTendency}`.toLowerCase();
  let score = 0;

  if (text.includes("정사이즈")) score += 3;
  if (text.includes("여유") || text.includes("볼륨") || text.includes("넉넉")) score += profile.forefootWidth === "wide" ? 5 : 2;
  if (text.includes("쿠션") || text.includes("장시간")) score += 2;
  if (text.includes("고정") || text.includes("잡아")) score += profile.heelSlipTendency === "high" ? 3 : 1;

  if (profile.forefootWidth === "wide" && (text.includes("앞볼이 타이트") || text.includes("앞볼이 좁") || text.includes("좁게"))) {
    score -= 5;
  }
  if (profile.instepHeight === "high" && text.includes("발등") && (text.includes("답답") || text.includes("조여") || text.includes("타이트"))) {
    score -= 4;
  }
  if (profile.instepHeight === "high" && (text.includes("압박이 과하지") || text.includes("발등 압박은") || text.includes("여유"))) {
    score += 3;
  }

  return score;
}

export function ShoeSearchClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "running" | "lifestyle" | "training">("all");
  const [brand, setBrand] = useState("all");

  const profile = useMemo(() => getFootProfile(), []);
  const brands = useMemo(() => Array.from(new Set(shoes.map((shoe) => shoe.brand))).sort(), []);

  const recommendedShoes = useMemo(() => {
    if (!profile) return [];

    return [...shoes]
      .sort((a, b) => scoreShoeForProfile(b, profile) - scoreShoeForProfile(a, profile))
      .slice(0, 3);
  }, [profile]);

  const filtered = useMemo(() => {
    return shoes.filter((shoe) => {
      const categoryMatch = category === "all" || shoe.category === category;
      const brandMatch = brand === "all" || shoe.brand === brand;
      const queryMatch = `${shoe.brand} ${shoe.modelName}`.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && brandMatch && queryMatch;
    });
  }, [brand, category, query]);

  return (
    <section className="space-y-5">
      {profile ? (
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">사이즈 판단할 신발 선택</h1>
              <p className="text-sm text-neutral-600">
                사고 싶은 신발을 고르면 내 발 기준 우선 추천과 비교 후보를 볼 수 있어요.
              </p>
            </div>
            <Link href="/profile" className="shrink-0 text-sm font-medium text-neutral-900 underline underline-offset-4">
              내 발 프로필
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommendedShoes.map((shoe) => (
              <ShoeCard key={shoe.id} shoe={shoe} badges={getRecommendationReasons(shoe, profile)} decisionCta />
            ))}
          </div>
        </section>
      ) : (
        <div className="card flex flex-col gap-3 text-sm text-neutral-700 sm:flex-row sm:items-center sm:justify-between">
          <p>발 프로필을 만들면 신발별 사이즈 판단을 볼 수 있어요.</p>
          <Link href="/onboarding" className="btn-primary">
            사이즈 판단 시작하기
          </Link>
        </div>
      )}

      <div className="card space-y-3">
        <h2 className="text-2xl font-semibold">{profile ? "다른 신발 사이즈 판단하기" : "신발 보기"}</h2>

        <div className="space-y-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input"
            placeholder="브랜드 또는 모델명 입력"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            카테고리
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="select mt-1"
            >
              <option value="all">전체</option>
              <option value="running">러닝</option>
              <option value="lifestyle">라이프스타일</option>
              <option value="training">트레이닝</option>
            </select>
          </label>
          <label className="text-sm">
            브랜드
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="select mt-1"
            >
              <option value="all">전체</option>
              {brands.map((brandName) => (
                <option key={brandName} value={brandName}>
                  {brandName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">전체 신발에서 사이즈 판단하기</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((shoe) => {
          const badges = getBadges(shoe);

          return <ShoeCard key={shoe.id} shoe={shoe} badges={badges} />;
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-sm text-neutral-600">
          검색 결과가 없습니다.
        </div>
      ) : null}
    </section>
  );
}

function ShoeCard({ shoe, badges, decisionCta = false }: { shoe: (typeof shoes)[number]; badges: string[]; decisionCta?: boolean }) {
  return (
    <Link
      href={`/shoes/${shoe.id}`}
      className="card overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <img src={shoe.imageSrc} alt={shoe.imageAlt} className="h-48 w-full object-cover" />

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {categoryLabel[shoe.category]}
          </p>
          <span className="text-xs text-neutral-400">{decisionCta ? "판단 보기" : "상세 보기"}</span>
        </div>

        <h2 className="text-lg font-semibold">
          {shoe.brand} {shoe.modelName}
        </h2>

        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-700"
            >
              {badge}
            </span>
          ))}
        </div>

        <p className="text-sm text-neutral-600">{shoe.fitSummary}</p>
        {decisionCta ? (
          <p className="text-sm font-medium text-neutral-900 underline underline-offset-4">
            사이즈 판단 보기
          </p>
        ) : null}
      </div>
    </Link>
  );
}
