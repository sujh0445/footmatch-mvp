"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveSelfInput } from "@/lib/storage";
import { FootSelfInput } from "@/types";

const initial: FootSelfInput = {
  actualFootLengthMm: 255,
  purchasedShoeSizeMm: 270,
  sizeUpForWidth: "sometimes",
  instepPressureExperience: "rarely",
  commonIssue: "none",
  preferredFit: "regular"
};

const issueOptions: Array<{ value: FootSelfInput["commonIssue"]; label: string }> = [
  { value: "none", label: "해당 없음" },
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
  const [form, setForm] = useState<FootSelfInput>(initial);
  const router = useRouter();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveSelfInput(form);
    router.push("/upload");
  };

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Foot Profile</p>
        <h1 className="text-2xl font-semibold">발 정보를 입력해주세요</h1>
        <p className="text-sm text-neutral-600">
          FootMatch는 실측 발길이와 실제 착화 경험을 중심으로 보고,
          사진은 발 형태를 참고하는 보조 정보로만 사용합니다.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">1 / 3</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">기본 사이즈 정보</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">2 / 3</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">압박 경험</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">3 / 3</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">핏 성향</p>
        </div>
      </div>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">기본 사이즈 정보</h2>
          <p className="text-sm text-neutral-600">
            가장 기본이 되는 정보예요. 모르면 대략적으로 입력해도 됩니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            실측 발길이(mm) *
            <input
              type="number"
              min={220}
              max={320}
              step={1}
              value={form.actualFootLengthMm}
              onChange={(e) => setForm((p) => ({ ...p, actualFootLengthMm: Number(e.target.value) }))}
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
              value={form.purchasedShoeSizeMm ?? ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  purchasedShoeSizeMm: e.target.value ? Number(e.target.value) : undefined
                }))
              }
              className="input mt-1"
              placeholder="예: 270"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">신발에서 자주 느끼는 압박</h2>
          <p className="text-sm text-neutral-600">
            발 모양 자체보다 실제로 어디가 불편했는지가 더 중요합니다.
          </p>
        </div>

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
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">선호하는 핏과 자주 느끼는 불편</h2>
          <p className="text-sm text-neutral-600">
            딱 맞는 쪽이 좋은지, 앞쪽 여유가 있는 쪽이 좋은지까지 같이 반영합니다.
          </p>
        </div>

        <label className="block text-sm">
          신발에서 자주 느끼는 불편은 무엇인가요?
          <select
            className="select mt-1"
            value={form.commonIssue}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                commonIssue: e.target.value as FootSelfInput["commonIssue"]
              }))
            }
          >
            {issueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

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
        <button className="btn-primary w-full" type="submit">
          프로필 저장하고 계속하기
        </button>
        <p className="text-center text-xs text-neutral-500">
          사진은 선택 입력입니다. 나중에 추가해도 됩니다.
        </p>
      </div>
    </form>
  );
}
