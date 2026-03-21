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

  const { analysis, selfInput, profile } = state;

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">내 발 프로필 요약</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ResultCard label="실측 발 길이" value={`${selfInput.actualFootLengthMm} mm`} />
        <ResultCard label="앞발 너비" value={analysis.forefootWidth} />
        <ResultCard label="발등 높이" value={analysis.instepHeight} />
        <ResultCard label="발가락 형태" value={analysis.toeShape} />
        <ResultCard label="뒤꿈치 들림 경향" value={analysis.heelSlipTendency} />
        <ResultCard label="좌우 차이" value={analysis.leftRightDifference} />
      </div>

      <div className="card space-y-2 text-sm text-neutral-700">
        <p className="font-medium">사진 기준 참고 경향 안내</p>
        <p>사진은 발볼과 발 모양을 참고용으로 추정합니다. 실제 구매 습관과 앞볼 압박 경험을 더 중요하게 반영합니다.</p>
        <p className="text-xs text-neutral-500">사진 결과는 촬영 각도와 이미지에 따라 달라질 수 있습니다. 발볼 관련 결과는 참고용 힌트입니다. (참고 지표: {(analysis.confidence * 100).toFixed(0)}%)</p>
      </div>

      <button
        className="btn-primary"
        onClick={() => {
          saveFootProfile(profile);
          router.push("/shoes");
        }}
      >
        추천 확인하러 가기
      </button>
    </section>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  const valueMap: Record<string, string> = {
    narrow: "좁은 편으로 보일 수 있어요",
    normal: "보통으로 보일 수 있어요",
    wide: "보통~약간 넓은 편으로 보일 수 있어요",
    low: "낮은 편으로 보일 수 있어요",
    high: "높은 편으로 보일 수 있어요",
    egyptian: "엄지발가락이 더 길어 보이는 형태",
    greek: "둘째발가락이 더 길어 보이는 형태",
    square: "앞쪽 발가락 길이가 비슷해 보이는 형태",
    medium: "중간 정도",
    small: "작은 편",
    large: "큰 편"
  };

  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-2 text-xl font-semibold">{valueMap[value] ?? value}</p>
    </div>
  );
}
