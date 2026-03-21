import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "FootMatch",
  description: "나와 비슷한 발의 후기로 신발 사이즈 실패를 줄여보세요."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">FootMatch</Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link className="btn-secondary" href="/shoes">신발 보기</Link>
              <Link className="btn-primary" href="/onboarding">사이즈 찾기 시작</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
