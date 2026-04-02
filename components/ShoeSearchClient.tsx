"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { shoes } from "@/data/shoes";

const categoryLabel: Record<string, string> = {
  running: "러닝",
  lifestyle: "라이프스타일",
  training: "트레이닝"
};

export function ShoeSearchClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "running" | "lifestyle" | "training">("all");

  const filtered = useMemo(() => {
    return shoes.filter((shoe) => {
      const categoryMatch = category === "all" || shoe.category === category;
      const queryMatch = `${shoe.brand} ${shoe.modelName}`.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  return (
    <section className="space-y-5">
      <div className="card space-y-3">
        <h1 className="text-2xl font-semibold">신발 보기</h1>
        <p className="text-sm text-neutral-600">대표 이미지와 간단한 핏 요약을 기준으로 먼저 훑어보고, 상세에서 추천과 리뷰를 확인해보세요.</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input" placeholder="브랜드 또는 모델 검색" />
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="select">
            <option value="all">전체 카테고리</option>
            <option value="running">러닝</option>
            <option value="lifestyle">라이프스타일</option>
            <option value="training">트레이닝</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((shoe) => (
          <Link key={shoe.id} href={`/shoes/${shoe.id}`} className="card overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-md">
            <img src={shoe.imageSrc} alt={shoe.imageAlt} className="h-48 w-full object-cover" />
            <div className="space-y-2 p-5">
              <p className="text-xs uppercase tracking-wide text-neutral-500">{categoryLabel[shoe.category]}</p>
              <h2 className="text-lg font-semibold">
                {shoe.brand} {shoe.modelName}
              </h2>
              <p className="text-sm text-neutral-600">{shoe.fitSummary}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? <div className="card text-sm text-neutral-600">검색 결과가 없습니다. 다른 키워드로 시도해보세요.</div> : null}
    </section>
  );
}
