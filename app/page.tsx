import { ProfileAwareCtas } from "@/components/ProfileAwareCtas";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl space-y-6 py-6">
      <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-[linear-gradient(135deg,#faf7f2_0%,#ffffff_55%,#f2f2f1_100%)] p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                  FootMatch
                </span>
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
                  Size Judgment App
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                  사고 싶은 신발의 구매 사이즈를
                  <br className="hidden sm:block" />내 발 기준으로 바로 판단하세요
                </h1>

                <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
                  발 프로필을 기준으로, 원하는 신발의 추천 사이즈와 근거를 빠르게 확인합니다.
                </p>
              </div>

              <ProfileAwareCtas className="flex flex-col gap-3 sm:flex-row" />

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
                  발 프로필 기준
                </span>
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
                  사진은 선택 입력
                </span>
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700">
                  추천 사이즈 + 근거
                </span>
              </div>
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-white/90 p-5 shadow-[0_12px_30px_rgba(17,24,39,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">앱 흐름</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">세 단계로 끝나는 판단</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-right">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">준비 기준</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">내 발 기준</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  {
                    step: "01",
                    title: "신발 선택",
                    body: "모델 고르기"
                  },
                  {
                    step: "02",
                    title: "내 발 기준",
                    body: "프로필 확인"
                  },
                  {
                    step: "03",
                    title: "사이즈 판단",
                    body: "추천 확인"
                  }
                ].map((item) => (
                  <div
                    key={item.step}
                    className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-3"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-neutral-900 shadow-sm">
                      {item.step}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                      <p className="mt-1 text-sm text-neutral-600">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-neutral-100 bg-neutral-50/70 p-5 sm:grid-cols-3 sm:p-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">1단계</p>
            <p className="mt-2 text-base font-semibold text-neutral-900">신발 선택</p>
            <p className="mt-1 text-sm text-neutral-600">보고 싶은 모델 고르기</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">2단계</p>
            <p className="mt-2 text-base font-semibold text-neutral-900">내 발 기준</p>
            <p className="mt-1 text-sm text-neutral-600">가볍게 기준 맞추기</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">3단계</p>
            <p className="mt-2 text-base font-semibold text-neutral-900">사이즈 판단</p>
            <p className="mt-1 text-sm text-neutral-600">추천과 근거 확인</p>
          </div>
        </div>
      </div>
    </section>
  );
}
