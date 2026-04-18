import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-4xl space-y-6 py-6">
      <div className="card space-y-4 p-7 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">FootMatch</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">내 발에 맞는 신발 사이즈 찾기</h1>
        <p className="text-sm text-neutral-600 sm:text-base">
          실측 발길이와 착화 경험, 비슷한 발의 핏 리뷰를 바탕으로 더 잘 맞는 신발 사이즈를 찾도록 돕습니다.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/onboarding" className="btn-primary">
            발 분석하기
          </Link>
          <Link href="/shoes" className="btn-secondary">
            신발 둘러보기
          </Link>
        </div>
      </div>
    </section>
  );
}
