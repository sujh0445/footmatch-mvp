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
            내 발 프로필 만들기
          </Link>
          <Link href="/shoes" className="btn-secondary">
            신발 둘러보기
          </Link>
        </div>

        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-900">발 정보 입력</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-900">신발 선택</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-900">추천 확인</p>
          </div>
        </div>
      </div>
    </section>
  );
}
