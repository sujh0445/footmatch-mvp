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

const fitOptions: Array<{ value: FootSelfInput["preferredFit"]; label: string; desc: string }> = [
  { value: "snug", label: "딱 맞는 느낌", desc: "발을 단단히 감싸는 느낌을 선호해요." },
  { value: "regular", label: "정사이즈 느낌", desc: "가장 무난한 착화감을 선호해요." },
  { value: "roomy", label: "앞쪽 여유 있는 느낌", desc: "발가락 공간이 조금 있는 편이 좋아요." }
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
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Foot Profile</p>
        <h1 className="text-2xl font-semibold">발 정보를 입력해주세요</h1>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>발 프로필 입력</span>
          <span>3단계</span>
        </div>
        <p className="text-sm text-neutral-600">
          실측 발길이와 착화 경험을 바탕으로 발 프로필을 입력합니다. 사진은 선택 입력입니다.
        </p>
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

        <div className="space-y-2">
          신발에서 자주 느끼는 불편은 무엇인가요?
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
          <p className="text-sm">어떤 착화감을 선호하나요?</p>
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
                  <p className={["mt-1 text-xs", selected ? "text-white/80" : "text-neutral-600"].join(" ")}>
                    {option.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button className="btn-primary w-full" type="submit">
          프로필 저장하고 계속하기
        </button>
        <p className="text-center text-xs text-neutral-500">
          다음 단계에서 사진을 선택으로 추가할 수 있습니다.
        </p>
      </div>
    </form>
  );
}
