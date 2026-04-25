"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveSelfInput } from "@/lib/storage";
import { CommonIssue, FootSelfInput } from "@/types";

const initial: Omit<FootSelfInput, "actualFootLengthMm" | "purchasedShoeSizeMm"> = {
  sizeUpForWidth: "sometimes",
  instepPressureExperience: "rarely",
  commonIssues: [],
  preferredFit: "regular"
};

const issueOptions: Array<{ value: CommonIssue; label: string }> = [
  { value: "width_pressure", label: "앞볼 압박" },
  { value: "instep_pressure", label: "발등 답답함" },
  { value: "toe_tightness", label: "발가락 공간 부족" },
  { value: "heel_slip", label: "뒤꿈치 들림" }
];

const fitOptions: Array<{ value: FootSelfInput["preferredFit"]; label: string }> = [
  { value: "snug", label: "딱 맞게" },
  { value: "regular", label: "정사이즈" },
  { value: "roomy", label: "앞쪽 여유" }
];

export function OnboardingForm() {
  const [form, setForm] = useState(initial);
  const [actualFootLengthInput, setActualFootLengthInput] = useState("255");
  const [purchasedShoeSizeInput, setPurchasedShoeSizeInput] = useState("270");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const actualFootLengthMm = Number(actualFootLengthInput);
    const purchasedShoeSizeMm = purchasedShoeSizeInput.trim() ? Number(purchasedShoeSizeInput) : undefined;

    if (!actualFootLengthInput.trim() || Number.isNaN(actualFootLengthMm) || actualFootLengthMm < 220 || actualFootLengthMm > 320) {
      setError("실측 발길이를 220-320mm 사이로 입력해주세요.");
      return;
    }

    if (
      purchasedShoeSizeMm !== undefined &&
      (Number.isNaN(purchasedShoeSizeMm) || purchasedShoeSizeMm < 220 || purchasedShoeSizeMm > 320)
    ) {
      setError("자주 구매하는 신발 사이즈는 220-320mm 사이로 입력해주세요.");
      return;
    }

    setError("");
    saveSelfInput({
      ...form,
      actualFootLengthMm,
      purchasedShoeSizeMm
    });
    router.push("/upload");
  };

  const toggleIssue = (issue: CommonIssue) => {
    setForm((prev) => ({
      ...prev,
      commonIssues: prev.commonIssues.includes(issue)
        ? prev.commonIssues.filter((item) => item !== issue)
        : [...prev.commonIssues, issue]
    }));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="card mx-auto max-w-3xl space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">사이즈 판단 시작</p>
        <h1 className="text-2xl font-semibold">내 발 기준이 될 발 프로필 만들기</h1>
        <p className="text-sm text-neutral-600">
          이 단계는 정밀 측정이 아니라, 사고 싶은 신발의 구매 사이즈를 판단하기 위한 기준을 빠르게 정리하는 단계입니다.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
        입력이 끝나면 선택 입력인 사진 참고 단계로 넘어가고, 그다음 신발별 추천 사이즈와 이유, 참고 리뷰를 확인할 수 있어요.
      </div>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">기본 정보</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            실측 발길이(mm) *
            <input
              type="number"
              min={220}
              max={320}
              step={1}
              value={actualFootLengthInput}
              onChange={(e) => setActualFootLengthInput(e.target.value)}
              className="input mt-1"
              required
            />
          </label>

          <label className="block text-sm">
            평소 자주 구매하는 신발 사이즈 (선택)
            <input
              type="number"
              min={220}
              max={320}
              step={5}
              value={purchasedShoeSizeInput}
              onChange={(e) => setPurchasedShoeSizeInput(e.target.value)}
              className="input mt-1"
              placeholder="예: 270"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">압박 경험</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            발볼 때문에 크게 사는 편인가요?
            <select
              className="select mt-1"
              value={form.sizeUpForWidth}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  sizeUpForWidth: e.target.value as FootSelfInput["sizeUpForWidth"]
                }))
              }
            >
              <option value="rarely">거의 아니다</option>
              <option value="sometimes">가끔 그렇다</option>
              <option value="often">자주 그렇다</option>
            </select>
          </label>

          <label className="block text-sm">
            발등이 눌려 답답했던 적이 있나요?
            <select
              className="select mt-1"
              value={form.instepPressureExperience}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  instepPressureExperience: e.target.value as FootSelfInput["instepPressureExperience"]
                }))
              }
            >
              <option value="rarely">거의 없다</option>
              <option value="sometimes">가끔 있다</option>
              <option value="often">자주 있다</option>
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">핏 성향</h2>

        <div className="space-y-2 text-sm">
          자주 느끼는 불편
          <div className="grid gap-2 sm:grid-cols-2">
            {issueOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleIssue(option.value)}
                className={[
                  "rounded-2xl border px-4 py-3 text-left text-sm transition",
                  form.commonIssues.includes(option.value)
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm">선호 핏</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {fitOptions.map((option) => {
              const selected = form.preferredFit === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, preferredFit: option.value }))}
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    selected
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                  ].join(" ")}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button className="btn-primary w-full" type="submit">
          다음: 선택 입력 확인하기
        </button>
      </div>
    </form>
  );
}
