"use client";

import { FormEvent, useState } from "react";
import { shoes } from "@/data/shoes";

const defaultForm = {
  shoeId: shoes[0].id,
  usualSize: 270,
  purchasedSize: 270,
  fitResult: "true-to-size",
  forefootPressure: "none",
  instepPressure: "none",
  heelSlip: "none",
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
                <option key={shoe.id} value={shoe.id}>
                  {shoe.brand} {shoe.modelName}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            전체 핏 느낌
            <select className="select mt-1" value={form.fitResult} onChange={(e) => setForm((p) => ({ ...p, fitResult: e.target.value }))}>
              <option value="too small">작았음</option>
              <option value="true-to-size">정사이즈</option>
              <option value="too roomy">여유로움</option>
            </select>
          </label>

          <label className="text-sm">
            평소 자주 신는 운동화 사이즈
            <input className="input mt-1" type="number" step={5} value={form.usualSize} onChange={(e) => setForm((p) => ({ ...p, usualSize: Number(e.target.value) }))} />
          </label>

          <label className="text-sm">
            이 모델에서 구매한 사이즈
            <input className="input mt-1" type="number" step={5} value={form.purchasedSize} onChange={(e) => setForm((p) => ({ ...p, purchasedSize: Number(e.target.value) }))} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["발볼 압박", "forefootPressure"],
            ["발등 압박", "instepPressure"],
            ["뒤꿈치 들림", "heelSlip"]
          ].map(([label, key]) => (
            <label key={key} className="text-sm">
              {label}
              <select className="select mt-1" value={form[key as keyof typeof form] as string} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}>
                <option value="none">없음</option>
                <option value="mild">약간</option>
                <option value="high">심함</option>
              </select>
            </label>
          ))}
        </div>

        <label className="text-sm">
          편안함 점수 (1-5)
          <input className="input mt-1" type="number" min={1} max={5} value={form.comfort} onChange={(e) => setForm((p) => ({ ...p, comfort: Number(e.target.value) }))} />
        </label>

        <label className="text-sm">
          코멘트
          <textarea
            className="input mt-1 min-h-24"
            value={form.comment}
            onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
            placeholder="앞볼은 어땠나요? 발등 압박은 있었나요? 오래 걸었을 때 편했나요?"
            required
          />
        </label>

        <div className="space-y-2">
          <p className="text-sm font-medium">선택 태그</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-1 text-xs ${form.tags.includes(tag) ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-700"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" type="submit">
          핏 리뷰 제출
        </button>
      </form>

      {submitted ? <div className="card text-sm text-emerald-700">감사합니다. 현재는 프로토타입이라 임시 저장만 되지만, 이후 추천 정확도 개선에 반영될 수 있습니다.</div> : null}
    </section>
  );
}
