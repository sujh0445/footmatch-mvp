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
        <h1 className="text-2xl font-semibold">신발 검색</h1>
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input" placeholder="브랜드 또는 모델 검색" />
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="select">
            <option value="all">전체 카테고리</option>
            <option value="running">러닝</option>
            <option value="lifestyle">라이프스타일</option>
            <option value="training">트레이닝</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((shoe) => (
          <Link key={shoe.id} href={`/shoes/${shoe.id}`} className="card transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs uppercase tracking-wide text-neutral-500">{categoryLabel[shoe.category]}</p>
            <h2 className="mt-1 text-lg font-semibold">
              {shoe.brand} {shoe.modelName}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">{shoe.fitSummary}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? <div className="card text-sm text-neutral-600">검색 결과가 없습니다. 다른 키워드로 시도해보세요.</div> : null}
    </section>
  );
}
