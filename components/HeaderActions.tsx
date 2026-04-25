"use client";

import Link from "next/link";
import { getProfileAwareCtaItems, useHasFootProfile } from "@/components/ProfileAwareCtas";

const primaryClassName =
  "inline-flex items-center justify-center rounded-full bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700";
const secondaryClassName =
  "inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900";

export function HeaderActions() {
  const hasProfile = useHasFootProfile();
  const { primary, secondary } = getProfileAwareCtaItems(hasProfile);

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link href={primary.href} className={primaryClassName}>
        {primary.label}
      </Link>
      <Link href={secondary.href} className={secondaryClassName}>
        {secondary.label}
      </Link>
    </nav>
  );
}
