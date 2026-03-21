"use client";

import { FormEvent, useState } from "react";
import { shoes } from "@/data/shoes";

const defaultForm = {
  shoeId: shoes[0].id,
  usualPurchasedSizeMm: 270,
  purchasedSizeMm: 270,
  forefootPressure: "sometimes",
  instepPressure: "rarely",
  heelSlip: "rarely",
  heelLiningWear: "rarely",
  comfort: 4,
  comment: "",
  tags: [] as string[]
};

const tags = ["장거리 워킹", "헬스", "러닝", "일상 착용"];

export function ReviewForm() {
  const [form, setForm] = useState(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setForm((p) => ({ ...p, tags: p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : [...p.tags, tag] }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <form className="card space-y-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-semibold">핏 리뷰 작성</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            신발 모델
            <select className="select mt-1" value={form.shoeId} onChange={(e) => setForm((p) => ({ ...p, shoeId: e.target.value }))}>
              {shoes.map((shoe) => (
                <option key={shoe.id} value={shoe.id}>{shoe.brand} {shoe.modelName}</option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            평소 구매 사이즈(mm)
            <input className="input mt-1" type="number" step={5} value={form.usualPurchasedSizeMm} onChange={(e) => setForm((p) => ({ ...p, usualPurchasedSizeMm: Number(e.target.value) }))} />
          </label>

          <label className="text-sm">
            이번 구매 사이즈(mm)
            <input className="input mt-1" type="number" step={5} value={form.purchasedSizeMm} onChange={(e) => setForm((p) => ({ ...p, purchasedSizeMm: Number(e.target.value) }))} />
          </label>

          <label className="text-sm">
            편안함 점수 (1-5)
            <input className="input mt-1" type="number" min={1} max={5} value={form.comfort} onChange={(e) => setForm((p) => ({ ...p, comfort: Number(e.target.value) }))} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["앞볼 압박", "forefootPressure"],
            ["발등 압박", "instepPressure"],
            ["뒤꿈치 들뜸", "heelSlip"],
            ["오래 신었을 때 뒤축 안감 마모", "heelLiningWear"]
          ].map(([label, key]) => (
            <label key={key} className="text-sm">
              {label}
              <select className="select mt-1" value={form[key as keyof typeof form] as string} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}>
                <option value="often">자주</option>
                <option value="sometimes">가끔</option>
                <option value="rarely">거의 없음</option>
              </select>
            </label>
          ))}
        </div>

        <label className="text-sm">
          코멘트
          <textarea className="input mt-1 min-h-24" value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))} placeholder="예: 끈을 느슨하게 묶으면 발이 조금 놀지만, 앞볼 압박은 줄었습니다." required />
        </label>

        <div className="space-y-2">
          <p className="text-sm font-medium">활동 태그 (선택)</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-1 text-xs ${form.tags.includes(tag) ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-700"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" type="submit">핏 리뷰 제출 (데모)</button>
      </form>

      {submitted ? <div className="card text-sm text-emerald-700">감사합니다! 핏 리뷰가 데모 세션에 반영되었습니다.</div> : null}
    </section>
  );
}
