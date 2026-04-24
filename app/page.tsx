import Link from "next/link";

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
            먼저 발 프로필을 만들면 내 발 기준의 참고용 사이즈 판단을 바로 시작할 수 있어요.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/onboarding" className="btn-primary">
            발 프로필 만들기
          </Link>
          <Link href="/shoes" className="btn-secondary border-neutral-200 text-neutral-500 hover:text-neutral-700">
            신발 선택하기
          </Link>
        </div>

        <div className="grid gap-1 rounded-lg border border-neutral-100 bg-neutral-50/60 px-2 py-1.5 text-xs text-neutral-500 sm:grid-cols-3">
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-[11px] font-medium text-neutral-400">1</span>
            <span>발 프로필 만들기</span>
          </div>

          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-[11px] font-medium text-neutral-400">2</span>
            <span>신발 선택하기</span>
          </div>

          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-[11px] font-medium text-neutral-400">3</span>
            <span>구매 사이즈 판단 확인</span>
          </div>
        </div>
      </div>
    </section>
  );
}
