import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl space-y-6 py-6">
      <div className="card space-y-6 p-7 sm:p-10">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            FootMatch
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            내 발에 맞는 신발 사이즈 찾기
          </h1>

          <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
            실측 발길이와 착화 경험, 비슷한 발의 핏 리뷰를 바탕으로
            구매 실패를 줄이는 사이즈 추천을 제공합니다.
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
            <p className="text-sm font-medium text-neutral-900">1. 발 프로필 만들기</p>
            <p className="mt-1 text-sm text-neutral-600">
              실측 발길이와 착화 경험을 바탕으로 내 발 기준을 저장합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-900">2. 신발 둘러보기</p>
            <p className="mt-1 text-sm text-neutral-600">
              관심 있는 모델의 핏 특징과 사이징 경향을 확인합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-900">3. 추천 해석</p>
            <p className="mt-1 text-sm text-neutral-600">
              정사이즈, 반업 고려, 앞볼 타이트 같은 정보를 내 발 기준으로 읽습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
