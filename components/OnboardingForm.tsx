"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveSelfInput } from "@/lib/storage";
import { FootSelfInput } from "@/types";

const initial: FootSelfInput = {
  actualFootLengthMm: 260,
  usualPurchasedSizeMm: undefined,
  forefootSizingUpFrequency: "sometimes",
  forefootPressureFrequency: "sometimes",
  instepPressureFrequency: "rarely",
  preferredFit: "regular",
  toeShape: "unknown"
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
    <form onSubmit={onSubmit} className="card mx-auto max-w-3xl space-y-5">
      <h1 className="text-2xl font-semibold">내 발 기준 정보 입력</h1>
      <p className="text-sm text-neutral-600">정확한 측정 도구가 아니라, 구매 실패를 줄이기 위한 사이즈 판단 보조 서비스입니다.</p>

      <section className="space-y-3 rounded-xl border border-neutral-200 p-4">
        <p className="text-sm font-semibold">필수 입력</p>
        <label className="block text-sm">
          실제 발길이(mm)
          <input type="number" min={200} max={330} step={1} value={form.actualFootLengthMm} onChange={(e) => setForm((p) => ({ ...p, actualFootLengthMm: Number(e.target.value) }))} className="input mt-1" required />
          <span className="mt-1 block text-xs text-neutral-500">맨발 기준 가장 긴 발의 길이를 입력해주세요. 왼발과 오른발 길이가 다르면 더 긴 쪽 기준으로 입력해주세요.</span>
        </label>

        <label className="block text-sm">
          발볼 때문에 반업 또는 한 치수 크게 사는 편인가요?
          <select className="select mt-1" value={form.forefootSizingUpFrequency} onChange={(e) => setForm((p) => ({ ...p, forefootSizingUpFrequency: e.target.value as FootSelfInput["forefootSizingUpFrequency"] }))}>
            <option value="often">자주 그렇다</option>
            <option value="sometimes">가끔 그렇다</option>
            <option value="rarely">거의 없다</option>
          </select>
        </label>

        <label className="block text-sm">
          신발 신을 때 앞볼이 자주 끼는 편인가요?
          <select className="select mt-1" value={form.forefootPressureFrequency} onChange={(e) => setForm((p) => ({ ...p, forefootPressureFrequency: e.target.value as FootSelfInput["forefootPressureFrequency"] }))}>
            <option value="often">자주 낀다</option>
            <option value="sometimes">가끔 낀다</option>
            <option value="rarely">거의 없다</option>
          </select>
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-neutral-200 p-4">
        <p className="text-sm font-semibold">선택 입력</p>
        <label className="block text-sm">
          평소 구매하는 운동화 사이즈(mm)
          <input type="number" min={200} max={340} step={5} value={form.usualPurchasedSizeMm ?? ""} onChange={(e) => setForm((p) => ({ ...p, usualPurchasedSizeMm: e.target.value ? Number(e.target.value) : undefined }))} className="input mt-1" />
          <span className="mt-1 block text-xs text-neutral-500">발볼이나 발등 때문에 크게 사는 경우가 있다면 실제 구매 사이즈를 적어주세요.</span>
        </label>

        <label className="block text-sm">
          신발 끈 부분이나 발등이 눌려 답답한 적이 있나요?
          <select className="select mt-1" value={form.instepPressureFrequency} onChange={(e) => setForm((p) => ({ ...p, instepPressureFrequency: e.target.value as FootSelfInput["instepPressureFrequency"] }))}>
            <option value="often">자주 있다</option>
            <option value="sometimes">가끔 있다</option>
            <option value="rarely">거의 없다</option>
          </select>
        </label>

        <label className="block text-sm">
          어떤 착용감을 선호하나요?
          <select className="select mt-1" value={form.preferredFit} onChange={(e) => setForm((p) => ({ ...p, preferredFit: e.target.value as FootSelfInput["preferredFit"] }))}>
            <option value="snug">딱 맞게</option>
            <option value="regular">보통</option>
            <option value="roomy">여유 있게</option>
          </select>
        </label>

        <label className="block text-sm">
          발가락 형태
          <select className="select mt-1" value={form.toeShape} onChange={(e) => setForm((p) => ({ ...p, toeShape: e.target.value as FootSelfInput["toeShape"] }))}>
            <option value="unknown">잘 모르겠어요</option>
            <option value="egyptian">큰발가락이 가장 길어요 (이집트형)</option>
            <option value="greek">둘째 발가락이 더 길어요 (그리스형)</option>
            <option value="square">앞쪽 발가락 길이가 비슷해요 (스퀘어형)</option>
          </select>
          <div className="mt-2 flex gap-2 text-xs text-neutral-500">
            <span>🦶 이집트형</span>
            <span>🦶 그리스형</span>
            <span>🦶 스퀘어형</span>
          </div>
        </label>
      </section>

      <button className="btn-primary w-full" type="submit">
        사진 업로드(선택)로 이동
      </button>
    </form>
  );
}
