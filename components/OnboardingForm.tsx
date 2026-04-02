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

export function OnboardingForm() {
  const [form, setForm] = useState<FootSelfInput>(initial);
  const router = useRouter();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveSelfInput(form);
    router.push("/upload");
  };

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-2xl space-y-5">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">발 정보를 입력해주세요</h1>
        <p className="text-sm text-neutral-600">
          FootMatch는 실측 발길이와 실제 착화 경험을 중심으로 보고, 사진 결과는 참고용 형태 힌트로만 보조 반영합니다.
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          발볼 때문에 크게 사는 편인가요?
          <select
            className="select mt-1"
            value={form.sizeUpForWidth}
            onChange={(e) => setForm((p) => ({ ...p, sizeUpForWidth: e.target.value as FootSelfInput["sizeUpForWidth"] }))}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          신발에서 자주 느끼는 불편은 무엇인가요?
          <select
            className="select mt-1"
            value={form.commonIssue}
            onChange={(e) => setForm((p) => ({ ...p, commonIssue: e.target.value as FootSelfInput["commonIssue"] }))}
          >
            <option value="none">해당 없음</option>
            <option value="width_pressure">앞볼 압박</option>
            <option value="instep_pressure">발등 답답함</option>
            <option value="toe_tightness">발가락 공간 부족</option>
            <option value="heel_slip">뒤꿈치 들림</option>
          </select>
        </label>

        <label className="block text-sm">
          어떤 착화감을 선호하나요?
          <select
            className="select mt-1"
            value={form.preferredFit}
            onChange={(e) => setForm((p) => ({ ...p, preferredFit: e.target.value as FootSelfInput["preferredFit"] }))}
          >
            <option value="snug">딱 맞는 느낌</option>
            <option value="regular">정사이즈 느낌</option>
            <option value="roomy">앞쪽 여유 있는 느낌</option>
          </select>
        </label>
      </div>

      <button className="btn-primary w-full" type="submit">
        사진 단계로 이동
      </button>
    </form>
  );
}
