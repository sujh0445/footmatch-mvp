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
          사이즈 판단 시작하기
        </button>
      </div>
    );
  }

  const issueSummary =
    selfInput.commonIssues.length > 0
      ? selfInput.commonIssues.map((issue) => issueMap[issue]).join(", ")
      : "해당 없음";
  const photoStatus = analysis.photoUploaded ? "업로드 완료" : "사진 없이 진행";

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="card space-y-3">
        <h1 className="text-2xl font-semibold">발 프로필</h1>
        <p className="text-sm text-neutral-600">이 프로필을 기준으로 신발별 사이즈 판단과 비교 후보를 확인합니다.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard label="발길이" value={`${profile.footLengthMm} mm`} />
        <InfoCard label="평소 사이즈" value={selfInput.purchasedShoeSizeMm ? `${selfInput.purchasedShoeSizeMm} mm` : "미입력"} />
        <InfoCard label="발볼 때문에 크게 사는 편" value={labelize(selfInput.sizeUpForWidth)} />
        <InfoCard label="발등 압박 경험" value={labelize(selfInput.instepPressureExperience)} />
        <InfoCard label="선택한 불편 포인트" value={issueSummary} />
        <InfoCard label="사진 업로드 여부" value={photoStatus} />
      </div>

      <div className="card space-y-3 text-sm text-neutral-700">
        <h2 className="text-lg font-semibold">핏 기준</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <SummaryItem label="선호 핏" value={fitMap[selfInput.preferredFit]} />
          <SummaryItem label="발 형태 기준" value={`${valueMap[profile.forefootWidth]} / ${valueMap[profile.instepHeight]}`} />
        </div>
      </div>

      <div className="card space-y-3 text-sm text-neutral-700">
        <h2 className="text-lg font-semibold">사진 참고</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-700">
            {analysis.photoUploaded ? "보조 반영" : "사진 없음"}
          </span>
          <span className="text-xs text-neutral-500">신뢰도 {(analysis.confidence * 100).toFixed(0)}%</span>
        </div>
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
          신발 선택하기
        </button>
        <button className="btn-secondary" onClick={() => router.push("/onboarding")}>
          발 프로필 수정
        </button>
        <button
          className="btn-danger"
          onClick={() => {
            const ok = window.confirm("저장된 발 프로필과 사진 결과를 모두 지울까요?");
            if (!ok) return;
            clearFootmatchProfile();
            router.push("/onboarding");
          }}
        >
          프로필 초기화
        </button>
      </div>
    </section>
  );
}

const issueMap = {
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
