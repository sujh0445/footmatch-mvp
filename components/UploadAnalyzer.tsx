"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { saveAnalysisResult, saveFootProfile, getSelfInput } from "@/lib/storage";
import { analyzeFootPhotos } from "@/services/footAnalysis";
import { createFallbackAnalysis, normalizeFootProfile } from "@/lib/profile";

export function UploadAnalyzer() {
  const router = useRouter();
  const [topFile, setTopFile] = useState<File | null>(null);
  const [sideFile, setSideFile] = useState<File | null>(null);
  const [topPreview, setTopPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canAnalyze = useMemo(() => Boolean(topFile && sideFile && !loading), [topFile, sideFile, loading]);

  const onFile =
    (setter: (f: File | null) => void, previewSetter: (src: string | null) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setter(file);
      previewSetter(file ? URL.createObjectURL(file) : null);
    };

  const finalize = async (withPhoto: boolean) => {
    const selfInput = getSelfInput();
    if (!selfInput) {
      router.push("/onboarding");
      return;
    }

    setLoading(true);

    const analysis =
      withPhoto && topFile && sideFile
        ? await analyzeFootPhotos({ topViewFileName: topFile.name, sideViewFileName: sideFile.name })
        : createFallbackAnalysis(selfInput);

    saveAnalysisResult(analysis);
    saveFootProfile(normalizeFootProfile(analysis, selfInput));
    router.push("/profile");
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_320px]">
      <div className="card space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">선택 입력</p>
            <h1 className="text-2xl font-semibold">발 형태 힌트 보완</h1>
            <p className="text-sm text-neutral-600">사진은 선택 사항입니다. 지금 입력한 발 기준만으로도 바로 신발 선택 단계로 넘어갈 수 있습니다.</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-600">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">발 기준 입력 완료</span>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5">사진은 보조 입력</span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">다음: 신발 선택하기</span>
          </div>
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-5">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">기본 경로</p>
            <h2 className="text-lg font-semibold text-neutral-900">사진 없이 계속해도 됩니다</h2>
            <p className="text-sm text-neutral-600">사진 없이도 내 발 기준을 저장하고 신발별 사이즈 판단을 시작할 수 있습니다.</p>
          </div>

          <button
            className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            onClick={() => finalize(false)}
            type="button"
          >
            {loading ? "정리 중..." : "사진 없이 계속하기"}
          </button>
        </div>

        <section className="space-y-4 rounded-[28px] border border-neutral-200 bg-white p-5">
          <div className="space-y-2">
            <div className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
              선택 보완
            </div>
            <h2 className="text-lg font-semibold">사진으로 발 형태 힌트 더하기</h2>
            <p className="text-sm text-neutral-600">정밀 측정이 아니라 발볼과 발등 형태를 참고하는 정도로만 사용됩니다.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm">
              <span className="mb-2 block text-sm font-medium">발 윗면 사진</span>
              <input type="file" accept="image/*" onChange={onFile(setTopFile, setTopPreview)} className="block w-full text-sm" />
              {topFile ? <p className="mt-2 text-xs text-neutral-600">선택됨: {topFile.name}</p> : null}
            </label>

            <label className="block rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm">
              <span className="mb-2 block text-sm font-medium">발 옆면 사진</span>
              <input type="file" accept="image/*" onChange={onFile(setSideFile, setSidePreview)} className="block w-full text-sm" />
              {sideFile ? <p className="mt-2 text-xs text-neutral-600">선택됨: {sideFile.name}</p> : null}
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {topPreview ? (
              <Image src={topPreview} alt="발 윗면 미리보기" className="h-36 w-full rounded-xl object-cover" width={400} height={160} unoptimized />
            ) : (
              <div className="flex h-36 items-center justify-center rounded-xl bg-neutral-100 text-sm text-neutral-400">윗면 미리보기</div>
            )}
            {sidePreview ? (
              <Image src={sidePreview} alt="발 옆면 미리보기" className="h-36 w-full rounded-xl object-cover" width={400} height={160} unoptimized />
            ) : (
              <div className="flex h-36 items-center justify-center rounded-xl bg-neutral-100 text-sm text-neutral-400">옆면 미리보기</div>
            )}
          </div>

          <button
            className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canAnalyze}
            onClick={() => finalize(true)}
            type="button"
          >
            {loading ? "정리 중..." : "사진 힌트 추가하고 계속"}
          </button>
        </section>
      </div>

      <aside className="card h-fit space-y-3">
        <h2 className="text-lg font-semibold">사진을 넣는다면</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600">
          <li>발 전체가 가볍게 보이게</li>
          <li>윗면 1장, 옆면 1장</li>
          <li>형태 참고용이라 정확한 측정 자세는 필요 없음</li>
        </ul>
      </aside>
    </section>
  );
}
