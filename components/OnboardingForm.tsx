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

const pressureOptions: Array<{
  value: FootSelfInput["sizeUpForWidth"];
  label: string;
}> = [
  { value: "rarely", label: "거의 없음" },
  { value: "sometimes", label: "가끔" },
  { value: "often", label: "자주" }
];

const instepOptions: Array<{
  value: FootSelfInput["instepPressureExperience"];
  label: string;
}> = [
  { value: "rarely", label: "거의 없음" },
  { value: "sometimes", label: "가끔" },
  { value: "often", label: "자주" }
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
    <form onSubmit={onSubmit} noValidate className="card mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">내 발 기준 만들기</p>
          <h1 className="text-2xl font-semibold">사이즈 판단에 쓸 내 발 기준</h1>
          <p className="text-sm text-neutral-600">핵심 정보만 빠르게 고르면 다음 단계에서 바로 신발 선택으로 이어집니다.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-600">
          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5">1. 내 발 기준 입력</span>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">2. 발 형태 힌트 보완</span>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">3. 신발 선택하기</span>
        </div>
      </div>

      <section className="space-y-4 rounded-[28px] border border-neutral-200 bg-white p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">기본 기준</p>
          <h2 className="text-lg font-semibold">발길이와 평소 사이즈</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
            <span className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">발길이</span>
            <input
              type="number"
              min={220}
              max={320}
              step={1}
              value={actualFootLengthInput}
              onChange={(e) => setActualFootLengthInput(e.target.value)}
              className="input mt-2 border-0 bg-white"
              required
            />
            <span className="mt-2 block text-xs text-neutral-500">220-320mm</span>
          </label>

          <label className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
            <span className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">평소 사이즈</span>
            <input
              type="number"
              min={220}
              max={320}
              step={5}
              value={purchasedShoeSizeInput}
              onChange={(e) => setPurchasedShoeSizeInput(e.target.value)}
              className="input mt-2 border-0 bg-white"
              placeholder="선택 입력"
            />
            <span className="mt-2 block text-xs text-neutral-500">예: 270mm</span>
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-[28px] border border-neutral-200 bg-white p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">압박 느낌</p>
          <h2 className="text-lg font-semibold">발볼 압박과 발등 답답함</h2>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-900">발볼 압박</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {pressureOptions.map((option) => {
                const selected = form.sizeUpForWidth === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, sizeUpForWidth: option.value }))}
                    className={[
                      "rounded-2xl border px-4 py-3 text-sm transition",
                      selected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400"
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-900">발등 답답함</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {instepOptions.map((option) => {
                const selected = form.instepPressureExperience === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, instepPressureExperience: option.value }))}
                    className={[
                      "rounded-2xl border px-4 py-3 text-sm transition",
                      selected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400"
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-[28px] border border-neutral-200 bg-white p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">핏 성향</p>
          <h2 className="text-lg font-semibold">불편 포인트와 선호 핏</h2>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-900">불편 포인트</p>
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
                    : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-neutral-400"
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-900">선호 핏</p>
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
                      : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-neutral-400"
                  ].join(" ")}
                >
                  <p className="text-sm font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
        다음 단계의 사진 입력은 선택입니다. 지금 만든 기준만으로도 신발 선택 단계까지 이어갈 수 있습니다.
      </div>

      <div className="space-y-3">
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button className="btn-primary w-full" type="submit">
          다음: 발 형태 힌트 보완
        </button>
      </div>
    </form>
  );
}
