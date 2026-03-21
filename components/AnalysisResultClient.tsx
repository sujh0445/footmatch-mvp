"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { shoeReviews } from "@/data/reviews";
import { generateSizeRecommendation, normalizeFootProfile } from "@/lib/profile";
import { getAnalysisResult, getSelfInput, saveFootProfile } from "@/lib/storage";

const toeLabel: Record<string, string> = {
  egyptian: "큰발가락이 가장 긴 편",
  greek: "둘째 발가락이 더 긴 편",
  square: "앞쪽 발가락 길이가 비슷한 편",
  unknown: "발가락 형태는 아직 미선택"
};

const toeJargon: Record<string, string> = {
  egyptian: "(이집트형)",
  greek: "(그리스형)",
  square: "(스퀘어형)",
  unknown: ""
};

export function AnalysisResultClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = useMemo(() => {
    const selfInput = getSelfInput();
    if (!selfInput) return null;
    const analysis = getAnalysisResult();
    const profile = normalizeFootProfile(selfInput, analysis);
    const recommendation = generateSizeRecommendation(profile, shoeReviews);
    return { analysis, profile, recommendation };
  }, []);

  useEffect(() => {
    setReady(true);
    if (!state) setError("입력 정보가 없습니다. 처음부터 다시 진행해주세요.");
  }, [state]);

  if (!ready) return null;

  if (error || !state) {
    return (
      <div className="card max-w-2xl text-sm text-neutral-600">
        {error}
        <button onClick={() => router.push("/onboarding")} className="btn-primary mt-4">
          입력 화면으로 이동
        </button>
      </div>
    );
  }

  const { analysis, profile, recommendation } = state;

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div className="card space-y-3 border-neutral-900 bg-neutral-900 text-white">
        <p className="text-xs uppercase tracking-wide text-neutral-300">사이즈 제안</p>
        <h1 className="text-4xl font-semibold">{recommendation.headline}</h1>
        <p className="text-sm text-neutral-200">정답을 단정하는 결과가 아니라, 실패 확률을 줄이기 위한 우선 검토 사이즈입니다.</p>
      </div>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">왜 이렇게 제안했나요?</h2>
        <ul className="space-y-2 text-sm text-neutral-700">
          {recommendation.rationale.map((item) => (
            <li key={item} className="rounded-lg bg-neutral-50 px-3 py-2">{item}</li>
          ))}
        </ul>
        <p className="text-xs text-neutral-500">{recommendation.prototypeNote}</p>
      </div>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">입력 정보 요약</h2>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p>실제 발길이 <span className="font-medium">{profile.actualFootLengthMm}mm</span></p>
          <p>평소 구매 사이즈 <span className="font-medium">{profile.usualPurchasedSizeMm ? `${profile.usualPurchasedSizeMm}mm` : "미입력"}</span></p>
          <p>앞볼 압박 경험 <span className="font-medium">{frequencyKr(profile.forefootPressureFrequency)}</span></p>
          <p>반업/업사이징 습관 <span className="font-medium">{frequencyKr(profile.forefootSizingUpFrequency)}</span></p>
          <p>발등 압박 경험 <span className="font-medium">{frequencyKr(profile.instepPressureFrequency)} (보조 참고)</span></p>
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">발가락 형태 안내</h2>
        <p className="text-sm text-neutral-700">
          {toeLabel[profile.toeShape]} {toeJargon[profile.toeShape]}
        </p>
        <p className="text-xs text-neutral-500">앞코가 낮거나 좁은 신발에서는 발가락 형태에 따라 압박 위치가 달라질 수 있어 참고합니다.</p>
      </div>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">사진 참고 정보</h2>
        {analysis ? (
          <>
            <p className="text-sm text-neutral-700">길이는 입력값 기준으로 사용됩니다. 사진은 발 형태 경향만 보조적으로 반영됩니다.</p>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              <li>앞발 너비 경향: <span className="font-medium">{widthKr(analysis.forefootWidthHint)}</span></li>
              <li>발가락 형태 힌트: <span className="font-medium">{toeLabel[analysis.toeShapeHint]} {toeJargon[analysis.toeShapeHint]}</span></li>
              <li>발등 경향: <span className="font-medium">{instepKr(analysis.instepHint)} (참고 수준)</span></li>
              <li>압박 가능성 힌트: <span className="font-medium">{riskKr(analysis.pressureRiskHint)}</span></li>
            </ul>
            <p className="text-xs text-neutral-500">{analysis.confidenceNote}</p>
          </>
        ) : (
          <p className="text-sm text-neutral-600">사진 없이 진행했기 때문에 입력 정보와 후기 데이터 중심으로 제안했습니다.</p>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={() => {
          saveFootProfile(profile);
          router.push("/shoes");
        }}
      >
        이 기준으로 신발별 핏 리뷰 보기
      </button>
    </section>
  );
}

function frequencyKr(value: string) {
  if (value === "often") return "자주";
  if (value === "sometimes") return "가끔";
  return "거의 없음";
}

function widthKr(value: string) {
  if (value === "wide") return "넓은 편";
  if (value === "narrow") return "좁은 편";
  return "보통";
}

function instepKr(value: string) {
  if (value === "high") return "높은 편";
  if (value === "low") return "낮은 편";
  return "보통";
}

function riskKr(value: string) {
  if (value === "high") return "높은 편";
  if (value === "low") return "낮은 편";
  return "중간";
}
