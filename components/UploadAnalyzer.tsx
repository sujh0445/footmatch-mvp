"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { analyzeFootPhotos } from "@/services/footAnalysis";
import { saveAnalysisResult } from "@/lib/storage";

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

  const onAnalyze = async () => {
    if (!topFile || !sideFile) return;

    setLoading(true);
    const result = await analyzeFootPhotos({ topViewFileName: topFile.name, sideViewFileName: sideFile.name });
    saveAnalysisResult(result);
    router.push("/analysis");
  };

  return (
    <section className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[1fr_320px]">
      <div className="card space-y-4">
        <h1 className="text-2xl font-semibold">발 사진 업로드</h1>
        <p className="text-sm text-neutral-600">윗면/옆면 사진을 올리면 발볼·발등·발가락 모양 힌트를 정리해드립니다.</p>

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

        <button className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50" disabled={!canAnalyze} onClick={onAnalyze}>
          {loading ? "분석 중..." : "사진 힌트 분석하기"}
        </button>
      </div>

      <aside className="card h-fit space-y-3">
        <h2 className="text-lg font-semibold">촬영 가이드</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600">
          <li>바닥이 단순한 곳에 발을 올려주세요.</li>
          <li>발 앞쪽이 잘 보이도록 프레임 중앙에 맞춰 촬영해주세요.</li>
          <li>윗면 1장, 옆면 1장을 각각 촬영해주세요.</li>
          <li>그림자가 적고 밝은 환경에서 촬영하면 더 좋아요.</li>
        </ul>
      </aside>
    </section>
  );
}
