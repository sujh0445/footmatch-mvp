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
            내 발에 맞는 신발 사이즈 찾기
          </h1>

          <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
            실측 발길이와 핏 리뷰로 사이즈를 비교합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/onboarding" className="btn-primary">
            발 프로필 만들기
          </Link>
          <Link href="/shoes" className="btn-secondary">
            신발 둘러보기
          </Link>
        </div>

        <div className="grid gap-1 rounded-lg border border-neutral-100 bg-neutral-50/60 px-2 py-1.5 text-xs text-neutral-500 sm:grid-cols-3">
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-[11px] font-medium text-neutral-400">1</span>
            <span>발 프로필</span>
          </div>

          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-[11px] font-medium text-neutral-400">2</span>
            <span>신발 선택</span>
          </div>

          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-[11px] font-medium text-neutral-400">3</span>
            <span>추천 확인</span>
          </div>
        </div>
      </div>
    </section>
  );
}
