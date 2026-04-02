import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { HeaderActions } from "@/components/HeaderActions";

export const metadata: Metadata = {
  title: "FootMatch",
  description: "실측 발 길이와 핏 리뷰를 바탕으로 신발 사이즈 선택을 돕는 FootMatch."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              FootMatch
            </Link>
            <HeaderActions />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
