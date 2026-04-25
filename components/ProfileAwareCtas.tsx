"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFootProfile } from "@/lib/storage";

type ProfileAwareCtasProps = {
  className?: string;
  variant?: "landing" | "header";
};

type CtaItem = {
  href: string;
  label: string;
};

const landingPrimaryClassName = "btn-primary";
const landingSecondaryClassName =
  "inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700";
const headerPrimaryClassName =
  "inline-flex items-center justify-center rounded-full bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700";
const headerSecondaryClassName =
  "inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900";

export function useHasFootProfile() {
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

  return hasProfile;
}

export function getProfileAwareCtaItems(hasProfile: boolean): { primary: CtaItem; secondary: CtaItem } {
  return {
    primary: {
      href: "/shoes",
      label: "신발 선택하기"
    },
    secondary: hasProfile
      ? {
          href: "/profile",
          label: "발 프로필 보기"
        }
      : {
          href: "/onboarding",
          label: "발 프로필 만들기"
        }
  };
}

export function ProfileAwareCtas({
  className = "flex flex-wrap gap-3",
  variant = "landing"
}: ProfileAwareCtasProps) {
  const hasProfile = useHasFootProfile();
  const { primary, secondary } = getProfileAwareCtaItems(hasProfile);
  const primaryClassName = variant === "header" ? headerPrimaryClassName : landingPrimaryClassName;
  const secondaryClassName = variant === "header" ? headerSecondaryClassName : landingSecondaryClassName;

  return (
    <nav className={className}>
      <Link href={primary.href} className={primaryClassName}>
        {primary.label}
      </Link>
      <Link href={secondary.href} className={secondaryClassName}>
        {secondary.label}
      </Link>
    </nav>
  );
}
