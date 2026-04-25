"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFootProfile } from "@/lib/storage";

type ProfileAwareCtasProps = {
  className?: string;
};

const primaryClassName = "btn-primary";
const secondaryClassName = "btn-secondary border-neutral-200 text-neutral-500 hover:text-neutral-700";

export function ProfileAwareCtas({ className = "flex flex-wrap gap-3" }: ProfileAwareCtasProps) {
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

  return (
    <nav className={className}>
      <Link href="/shoes" className={primaryClassName}>
        신발 선택하기
      </Link>
      <Link href={hasProfile ? "/profile" : "/onboarding"} className={secondaryClassName}>
        {hasProfile ? "내 발 기준 보기" : "내 발 기준 만들기"}
      </Link>
    </nav>
  );
}
