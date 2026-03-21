import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-3xl space-y-5 py-8">
      <div className="card space-y-4 p-7 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Shoe Size Decision Support</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">나와 비슷한 발의 후기로 사이즈 실패를 줄이세요</h1>
        <p className="text-sm text-neutral-600 sm:text-base">정사이즈 후기보다, 나와 비슷한 발의 핏 리뷰가 더 중요합니다. 실제 발길이와 앞볼 경험을 바탕으로 더 무난한 사이즈를 찾도록 도와드립니다.</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/onboarding" className="btn-primary">사이즈 찾기 시작</Link>
          <Link href="/shoes" className="btn-secondary">데모 신발 둘러보기</Link>
        </div>
      </div>
      <p className="text-center text-xs text-neutral-500">이 서비스는 패션 추천 앱이 아니라 신발 구매용 사이즈 판단 보조 서비스입니다.</p>
    </section>
  );
}
