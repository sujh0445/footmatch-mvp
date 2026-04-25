"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFootProfile } from "@/lib/storage";

type ProfileAwareCtasProps = {
  className?: string;
  variant?: "landing" | "header";
};

const landingPrimaryClassName = "btn-primary";
const landingSecondaryClassName =
  "inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700";
const headerPrimaryClassName =
  "inline-flex items-center justify-center rounded-full bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700";
const headerSecondaryClassName =
  "inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900";

export function ProfileAwareCtas({
  className = "flex flex-wrap gap-3",
  variant = "landing"
}: ProfileAwareCtasProps) {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const syncProfileState = () => setHasProfile(Boolean(getFootProfile()));

    syncProfileState();
    window.addEventListener("footmatch-profile-changed", syncProfileState);
    window.addEventListener("storage", syncProfileState);

    return () => {
      window.removeEventListener("footmatch-profile-changed", syncProfileState);
      window.removeEventListener("storage", syncProfileState);
    };
  }, []);

  const primaryHref = "/shoes";
  const primaryLabel = "신발 선택하기";
  const secondaryHref = hasProfile ? "/profile" : "/onboarding";
  const secondaryLabel = hasProfile ? "내 발 기준 보기" : "내 발 기준 만들기";
  const primaryClassName = variant === "header" ? headerPrimaryClassName : landingPrimaryClassName;
  const secondaryClassName = variant === "header" ? headerSecondaryClassName : landingSecondaryClassName;

  return (
    <nav className={className}>
      <Link href={primaryHref} className={primaryClassName}>
        {primaryLabel}
      </Link>
      <Link href={secondaryHref} className={secondaryClassName}>
        {secondaryLabel}
      </Link>
    </nav>
  );
}
