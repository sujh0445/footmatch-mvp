"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { normalizeFootProfile } from "@/lib/profile";
import { getAnalysisResult, getSelfInput, saveFootProfile } from "@/lib/storage";

export function AnalysisResultClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = useMemo(() => {
    const analysis = getAnalysisResult();
    const selfInput = getSelfInput();
    if (!analysis || !selfInput) return null;

    return { analysis, selfInput, profile: normalizeFootProfile(analysis, selfInput) };
  }, []);

  useEffect(() => {
    setReady(true);
    if (!state) setError("온보딩 또는 업로드 데이터가 없습니다. 처음부터 다시 진행해주세요.");
  }, [state]);

  if (!ready) return null;

  if (error || !state) {
    return (
      <div className="card max-w-2xl text-sm text-neutral-600">
        {error}
        <button onClick={() => router.push("/onboarding")} className="btn-primary mt-4">
          온보딩으로 이동
        </button>
      </div>
    );
  }

  const { analysis, profile } = state;

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">발 분석 결과 (MVP 목업)</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ResultCard label="발 길이" value={`${analysis.footLengthMm} mm`} />
        <ResultCard label="발볼" value={analysis.forefootWidth} />
        <ResultCard label="발등" value={analysis.instepHeight} />
        <ResultCard label="발가락 형태" value={analysis.toeShape} />
        <ResultCard label="뒤꿈치 들림 경향" value={analysis.heelSlipTendency} />
        <ResultCard label="좌우 차이" value={analysis.leftRightDifference} />
      </div>

      <div className="card space-y-2 text-sm text-neutral-700">
        <p className="font-medium">신뢰도 안내</p>
        <p>현재는 MVP 데모 결과입니다. 실제 비전 모델 연동 시 정확도가 향상됩니다.</p>
        <p className="text-xs text-neutral-500">목업 분석 신뢰도: {(analysis.confidence * 100).toFixed(0)}%</p>
      </div>

      <button
        className="btn-primary"
        onClick={() => {
          saveFootProfile(profile);
          router.push("/shoes");
        }}
      >
        프로필 저장 후 계속
      </button>
    </section>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  const valueMap: Record<string, string> = {
    narrow: "좁음",
    normal: "보통",
    wide: "넓음",
    low: "낮음",
    high: "높음",
    egyptian: "이집트형",
    greek: "그리스형",
    square: "스퀘어형",
    medium: "중간",
    small: "작음",
    large: "큼"
  };

  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-2 text-xl font-semibold">{valueMap[value] ?? value}</p>
    </div>
  );
}
