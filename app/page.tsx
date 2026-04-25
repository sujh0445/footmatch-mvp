import { ProfileAwareCtas } from "@/components/ProfileAwareCtas";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl py-6">
      <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-[linear-gradient(135deg,#faf7f2_0%,#ffffff_55%,#f2f2f1_100%)] p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
                  사이즈 판단
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">FootMatch</h1>

                <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
                  발 프로필과 핏 리뷰를 바탕으로 사고 싶은 신발의 구매 사이즈를 빠르게 판단하세요.
                </p>
              </div>

              <ProfileAwareCtas className="flex flex-col gap-3 sm:flex-row" />

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
                  사이즈 판단
                </span>
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
                  발 프로필
                </span>
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
                  핏 리뷰
                </span>
              </div>
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-white/90 p-5 shadow-[0_12px_30px_rgba(17,24,39,0.06)] sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">흐름</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">신발 선택부터 빠르게</p>
                </div>
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                  홈
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  {
                    step: "01",
                    title: "신발 선택",
                    body: "보고 싶은 모델"
                  },
                  {
                    step: "02",
                    title: "발 프로필",
                    body: "내 발 기준 정리"
                  },
                  {
                    step: "03",
                    title: "사이즈 판단",
                    body: "핏 리뷰 확인"
                  }
                ].map((item, index, items) => (
                  <div
                    key={item.step}
                    className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-neutral-900 shadow-sm">
                      {item.step}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                      <p className="mt-1 text-xs text-neutral-500">{item.body}</p>
                    </div>
                    {index < items.length - 1 ? (
                      <span className="text-lg text-neutral-300" aria-hidden="true">
                        /
                      </span>
                    ) : (
                      <span aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 bg-neutral-50/70 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
              추천 사이즈
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
              이유
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
              참고 프로필
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
