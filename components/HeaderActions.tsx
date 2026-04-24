"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFootProfile } from "@/lib/storage";

export function HeaderActions() {
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
    <nav className="flex items-center gap-2 text-sm">
      <Link className="btn-secondary border-neutral-200 text-neutral-500 hover:text-neutral-700" href="/shoes">
        신발 선택하기
      </Link>
      <Link className="btn-primary" href={hasProfile ? "/profile" : "/onboarding"}>
        {hasProfile ? "내 발 프로필" : "발 프로필 만들기"}
      </Link>
    </nav>
  );
}
