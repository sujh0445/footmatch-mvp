"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveSelfInput } from "@/lib/storage";
import { FootSelfInput } from "@/types";

const initial: FootSelfInput = {
  actualFootLengthMm: 255,
  purchasedShoeSizeMm: 270,
  widthSelfAssessment: "normal",
  instepSelfAssessment: "normal",
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
    <form onSubmit={onSubmit} className="card mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">발 정보를 입력해주세요</h1>
      <p className="text-sm text-neutral-600">실측 발 길이를 기준으로 추천하고, 사진은 발 모양 힌트를 보완하는 용도로만 사용합니다.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          실측 발 길이 (mm) *
          <input type="number" min={220} max={320} step={1} value={form.actualFootLengthMm} onChange={(e) => setForm((p) => ({ ...p, actualFootLengthMm: Number(e.target.value) }))} className="input mt-1" required />
        </label>

        <label className="block text-sm">
          최근 구매한 신발 사이즈 (선택)
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
          발볼 자가 진단
          <select className="select mt-1" value={form.widthSelfAssessment} onChange={(e) => setForm((p) => ({ ...p, widthSelfAssessment: e.target.value as FootSelfInput["widthSelfAssessment"] }))}>
            <option value="narrow">좁은 편</option>
            <option value="normal">보통</option>
            <option value="wide">넓은 편</option>
          </select>
        </label>

        <label className="block text-sm">
          발등 자가 진단
          <select className="select mt-1" value={form.instepSelfAssessment} onChange={(e) => setForm((p) => ({ ...p, instepSelfAssessment: e.target.value as FootSelfInput["instepSelfAssessment"] }))}>
            <option value="low">낮은 편</option>
            <option value="normal">보통</option>
            <option value="high">높은 편</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          자주 겪는 문제
          <select className="select mt-1" value={form.commonIssue} onChange={(e) => setForm((p) => ({ ...p, commonIssue: e.target.value as FootSelfInput["commonIssue"] }))}>
            <option value="toe_tightness">앞코가 답답함</option>
            <option value="width_pressure">발볼 압박</option>
            <option value="instep_pressure">발등 압박</option>
            <option value="heel_slip">뒤꿈치 들림</option>
            <option value="none">해당 없음</option>
          </select>
        </label>

        <label className="block text-sm">
          선호 핏
          <select className="select mt-1" value={form.preferredFit} onChange={(e) => setForm((p) => ({ ...p, preferredFit: e.target.value as FootSelfInput["preferredFit"] }))}>
            <option value="snug">딱 맞게</option>
            <option value="regular">정사이즈 느낌</option>
            <option value="roomy">여유 있게</option>
          </select>
        </label>
      </div>

      <button className="btn-primary w-full" type="submit">
        발 사진 업로드로 이동
      </button>
    </form>
  );
}
