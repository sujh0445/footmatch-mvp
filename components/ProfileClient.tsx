"use client";

import { useRouter } from "next/navigation";
import { getAnalysisResult, getFootProfile, getSelfInput, clearFootmatchProfile } from "@/lib/storage";

const valueMap: Record<string, string> = {
  narrow: "좁은 편",
  normal: "보통",
  wide: "넓은 편",
  low: "낮은 편",
  high: "높은 편",
  egyptian: "엄지발가락이 더 긴 편",
  greek: "둘째발가락이 더 긴 편",
  square: "앞쪽 발가락 길이가 비슷한 편",
  small: "작은 편",
  medium: "중간 정도",
  large: "큰 편"
};

export function ProfileClient() {
  const router = useRouter();
  const profile = getFootProfile();
  const analysis = getAnalysisResult();
  const selfInput = getSelfInput();

  if (!profile || !selfInput || !analysis) {
    return (
      <div className="card max-w-2xl space-y-3 text-sm text-neutral-700">
        <p>아직 저장된 발 프로필이 없습니다.</p>
        <button onClick={() => router.push("/onboarding")} className="btn-primary">
          발 분석하기
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="card space-y-3">
        <h1 className="text-2xl font-semibold">내 발 프로필</h1>
        <p className="text-sm text-neutral-600">
          이 정보는 실측 발길이와 착화 경험을 중심으로 정리한 참고용 프로필입니다. 사진 결과는 보조 힌트로만 사용합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard label="실측 발길이" value={`${profile.footLengthMm} mm`} />
        <InfoCard label="앞발 너비" value={valueMap[profile.forefootWidth]} />
        <InfoCard label="발등 높이" value={valueMap[profile.instepHeight]} />
        <InfoCard label="발가락 형태" value={valueMap[profile.toeShape]} />
        <InfoCard label="뒤꿈치 들림 경향" value={valueMap[profile.heelSlipTendency]} />
        <InfoCard label="좌우 차이" value={valueMap[profile.leftRightDifference]} />
      </div>

      <div className="card space-y-3 text-sm text-neutral-700">
        <h2 className="text-lg font-semibold">입력 기준 요약</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>평소 자주 구매하는 사이즈: {selfInput.purchasedShoeSizeMm ? `${selfInput.purchasedShoeSizeMm}mm` : "미입력"}</li>
          <li>발볼 때문에 크게 사는 편: {labelize(selfInput.sizeUpForWidth)}</li>
          <li>발등 눌림 경험: {labelize(selfInput.instepPressureExperience)}</li>
          <li>자주 느끼는 불편: {issueMap[selfInput.commonIssue]}</li>
          <li>선호 핏: {fitMap[selfInput.preferredFit]}</li>
        </ul>
      </div>

      <div className="card space-y-3 text-sm text-neutral-700">
        <h2 className="text-lg font-semibold">사진 참고 힌트</h2>
        <p>
          사진 기반 형태 정보는 참고용입니다. 추천에는 실측 발길이와 착화 경험을 더 중요하게 반영했습니다.
        </p>
        <p className="text-xs text-neutral-500">사진 반영 신뢰도: {(analysis.confidence * 100).toFixed(0)}%</p>
        {profile.notes?.length ? (
          <ul className="list-disc space-y-1 pl-5">
            {profile.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary" onClick={() => router.push("/shoes")}>
          신발 추천 보러가기
        </button>
        <button className="btn-secondary" onClick={() => router.push("/onboarding")}>
          다시 분석하기
        </button>
        <button
          className="rounded-2xl border border-rose-300 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
          onClick={() => {
            const ok = window.confirm("저장된 발 정보를 지우고 처음부터 다시 하시겠어요?");
            if (!ok) return;
            clearFootmatchProfile();
            router.push("/onboarding");
          }}
        >
          처음부터 다시 하기
        </button>
      </div>
    </section>
  );
}

const issueMap = {
  none: "해당 없음",
  toe_tightness: "발가락 공간 부족",
  width_pressure: "앞볼 압박",
  instep_pressure: "발등 답답함",
  heel_slip: "뒤꿈치 들림"
};

const fitMap = {
  snug: "딱 맞는 느낌",
  regular: "정사이즈 느낌",
  roomy: "앞쪽 여유 있는 느낌"
};

function labelize(value: "rarely" | "sometimes" | "often") {
  return value === "rarely" ? "거의 아니다" : value === "sometimes" ? "가끔 그렇다" : "자주 그렇다";
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
