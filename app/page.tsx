import { ProfileAwareCtas } from "@/components/ProfileAwareCtas";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl space-y-6 py-6">
      <div className="card space-y-5 p-7 sm:p-9">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            FootMatch
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            사고 싶은 신발의 구매 사이즈를, 내 발 기준으로 가볍게 판단해보세요
          </h1>

          <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
            먼저 가벼운 발 프로필을 만들고, 사고 싶은 신발을 고르면 추천 사이즈와 이유, 참고 리뷰를 빠르게 확인할 수 있어요.
          </p>
        </div>

        <ProfileAwareCtas />

        <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            빠른 흐름
          </p>

          <div className="mt-3 grid gap-2 text-xs text-neutral-500 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
              <span className="text-[11px] font-medium text-neutral-400">1</span>
              <span>발 프로필 만들기</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
              <span className="text-[11px] font-medium text-neutral-400">2</span>
              <span>신발 선택하기</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
              <span className="text-[11px] font-medium text-neutral-400">3</span>
              <span>추천 사이즈, 이유, 참고 리뷰 확인</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
