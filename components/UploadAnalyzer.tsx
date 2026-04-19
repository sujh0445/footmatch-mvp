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
      <div className="card space-y-4">
        <h1 className="text-2xl font-semibold">발 사진 업로드</h1>
        <p className="text-sm text-neutral-600">
          사진은 발 형태를 참고용으로만 반영합니다. 실제 추천에는 실측 발길이와 착화 경험을 더 중요하게 사용합니다.
        </p>

        <label className="block rounded-2xl border-2 border-dashed border-neutral-300 p-4 text-sm">
          <span className="mb-2 block font-medium">발 윗면 사진</span>
          <input type="file" accept="image/*" onChange={onFile(setTopFile, setTopPreview)} className="block w-full text-sm" />
          {topFile ? <p className="mt-2 text-xs text-neutral-600">선택됨: {topFile.name}</p> : null}
        </label>

        <label className="block rounded-2xl border-2 border-dashed border-neutral-300 p-4 text-sm">
          <span className="mb-2 block font-medium">발 옆면 사진</span>
          <input type="file" accept="image/*" onChange={onFile(setSideFile, setSidePreview)} className="block w-full text-sm" />
          {sideFile ? <p className="mt-2 text-xs text-neutral-600">선택됨: {sideFile.name}</p> : null}
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {topPreview ? (
            <Image src={topPreview} alt="발 윗면 미리보기" className="h-36 w-full rounded-xl object-cover" width={400} height={160} unoptimized />
          ) : (
            <div className="h-36 rounded-xl bg-neutral-100" />
          )}
          {sidePreview ? (
            <Image src={sidePreview} alt="발 옆면 미리보기" className="h-36 w-full rounded-xl object-cover" width={400} height={160} unoptimized />
          ) : (
            <div className="h-36 rounded-xl bg-neutral-100" />
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canAnalyze}
            onClick={() => finalize(true)}
            type="button"
          >
            {loading ? "정리 중..." : "사진 참고 힌트 반영하기"}
          </button>
          <button className="btn-secondary w-full" onClick={() => finalize(false)} type="button">
            사진 없이 프로필 보기
          </button>
        </div>
      </div>

      <aside className="card h-fit space-y-3">
        <h2 className="text-lg font-semibold">촬영 팁</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600">
          <li>발 전체가 보이게 촬영해주세요.</li>
          <li>윗면 1장, 옆면 1장을 올려주세요.</li>
          <li>결과는 참고용 힌트이며, 실측 발길이와 착화 경험을 더 중요하게 봅니다.</li>
        </ul>
      </aside>
    </section>
  );
}
