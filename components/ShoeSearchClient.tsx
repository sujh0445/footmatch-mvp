"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { shoes } from "@/data/shoes";
import { getFootProfile } from "@/lib/storage";

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

export function ShoeSearchClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "running" | "lifestyle" | "training">("all");
  const [brand, setBrand] = useState("all");

  const profile = useMemo(() => getFootProfile(), []);
  const brands = useMemo(() => Array.from(new Set(shoes.map((shoe) => shoe.brand))).sort(), []);

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
              <h1 className="text-2xl font-semibold">신발 선택</h1>
              <p className="text-sm text-neutral-600">
                사고 싶은 신발을 먼저 고르면, 내 발 기준으로 사이즈 판단과 핏 리뷰를 바로 확인할 수 있어요.
              </p>
            </div>
            <Link href="/profile" className="shrink-0 text-sm font-medium text-neutral-900 underline underline-offset-4">
              발 프로필 보기
            </Link>
          </div>
        </section>
      ) : (
        <div className="card flex flex-col gap-3 text-sm text-neutral-700 sm:flex-row sm:items-center sm:justify-between">
          <p>먼저 신발을 고르세요. 발 프로필을 만들면 내 발 기준으로 사이즈 판단을 바로 볼 수 있어요.</p>
          <Link href="/onboarding" className="btn-primary">
            사이즈 판단 시작하기
          </Link>
        </div>
      )}

      <div className="card space-y-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">신발 찾기</h2>
          <p className="text-sm text-neutral-600">
            브랜드나 모델명을 찾아, 사이즈를 확인하고 싶은 신발을 직접 선택하세요.
          </p>
        </div>

        <div className="space-y-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input"
            placeholder="사고 싶은 브랜드 또는 모델명 입력"
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
      <div className="relative h-48 w-full">
        <Image src={shoe.imageSrc} alt={shoe.imageAlt} fill className="object-cover" sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {categoryLabel[shoe.category]}
          </p>
          <span className="text-xs text-neutral-400">사이즈 판단</span>
        </div>

        <h2 className="text-lg font-semibold">
          {shoe.brand} {shoe.modelName}
        </h2>

        <div className="space-y-2">
          <p className="text-xs font-medium text-neutral-500">사이즈 판단 힌트</p>

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
