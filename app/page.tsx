import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="card space-y-4 p-7 sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">FootMatch MVP</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">나와 비슷한 발의 사용자 리뷰로 신발 사이즈를 찾으세요.</h1>
        <p className="text-sm text-neutral-600 sm:text-base">발 사진과 간단한 정보만 입력하면, 유사 발 프로필 기반 사이즈 추천을 확인할 수 있어요.</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/onboarding" className="btn-primary">
            발 프로필 시작
          </Link>
          <Link href="/shoes" className="btn-secondary">
            데모 신발 둘러보기
          </Link>
        </div>
      </div>
    </section>
  );
}
