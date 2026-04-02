"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFootProfile } from "@/lib/storage";

export function HeaderActions() {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    setHasProfile(Boolean(getFootProfile()));
  }, []);

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link className="btn-secondary" href="/shoes">
        신발 보기
      </Link>
      <Link className="btn-primary" href={hasProfile ? "/profile" : "/onboarding"}>
        {hasProfile ? "내 발 프로필" : "발 분석하기"}
      </Link>
    </nav>
  );
}
