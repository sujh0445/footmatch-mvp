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
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">핏 리뷰 작성</h1>
        <p className="text-sm text-neutral-600">30초 안에 남길 수 있어요.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <section className="card space-y-4">
          <div>
            <h2 className="text-lg font-semibold">기본 정보</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              신발 모델 <span className="text-neutral-500">(필수)</span>
              <select className="select mt-1" value={form.shoeId} onChange={(e) => setForm((p) => ({ ...p, shoeId: e.target.value }))}>
                {shoes.map((shoe) => (
                  <option key={shoe.id} value={shoe.id}>
                    {shoe.brand} {shoe.modelName}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              전체 핏 느낌 <span className="text-neutral-500">(필수)</span>
              <select className="select mt-1" value={form.fitResult} onChange={(e) => setForm((p) => ({ ...p, fitResult: e.target.value }))}>
                <option value="too small">작았음</option>
                <option value="true-to-size">정사이즈</option>
                <option value="too roomy">여유로움</option>
              </select>
            </label>

            <label className="text-sm">
              평소 자주 신는 운동화 사이즈 <span className="text-neutral-500">(필수)</span>
              <input className="input mt-1" type="number" step={5} value={form.usualSize} onChange={(e) => setForm((p) => ({ ...p, usualSize: Number(e.target.value) }))} />
            </label>

            <label className="text-sm">
              이 모델에서 구매한 사이즈 <span className="text-neutral-500">(필수)</span>
              <input className="input mt-1" type="number" step={5} value={form.purchasedSize} onChange={(e) => setForm((p) => ({ ...p, purchasedSize: Number(e.target.value) }))} />
            </label>
          </div>
        </section>

        <section className="card space-y-4">
          <div>
            <h2 className="text-lg font-semibold">착화 경험</h2>
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

          <label className="block text-sm">
            편안함 점수 <span className="text-neutral-500">(필수)</span>
            <input className="input mt-1" type="number" min={1} max={5} value={form.comfort} onChange={(e) => setForm((p) => ({ ...p, comfort: Number(e.target.value) }))} />
          </label>
        </section>

        <section className="card space-y-4">
          <div>
            <h2 className="text-lg font-semibold">한 줄 코멘트</h2>
          </div>

          <label className="text-sm">
            짧게 남겨주세요
            <textarea
              className="input mt-1 min-h-24"
              value={form.comment}
              onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              placeholder="예: 앞볼은 편했지만 오래 걸으면 발등이 조금 눌렸어요."
              required
            />
          </label>

          <div className="space-y-2 border-t border-neutral-200 pt-4">
            <p className="text-sm font-medium">선택 태그 <span className="font-normal text-neutral-500">(선택)</span></p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-1 text-xs ${form.tags.includes(tag) ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-700"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button className="btn-primary" type="submit">
            30초 핏 리뷰 제출
          </button>
        </div>
      </form>

      {submitted ? <div className="card text-sm text-emerald-700">리뷰가 임시 저장됐습니다.</div> : null}
    </section>
  );
}
