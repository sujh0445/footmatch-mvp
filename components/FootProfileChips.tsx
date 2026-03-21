import { ShoeReview } from "@/types";

export function FootProfileChips({ profile }: { profile: ShoeReview["reviewerFootProfile"] }) {
  const chips = [
    `발길이 ${profile.actualFootLengthMm}mm`,
    `앞볼 압박 ${freq(profile.forefootPressureFrequency)}`,
    `반업 성향 ${freq(profile.forefootSizingUpFrequency)}`,
    toeText(profile.toeShape),
    profile.usualPurchasedSizeMm ? `평소 구매 ${profile.usualPurchasedSizeMm}mm` : "평소 구매 미입력"
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700">{chip}</span>
      ))}
    </div>
  );
}

function freq(v: string) {
  if (v === "often") return "자주";
  if (v === "sometimes") return "가끔";
  return "거의 없음";
}

function toeText(v: string) {
  if (v === "egyptian") return "발가락: 큰발가락이 가장 김";
  if (v === "greek") return "발가락: 둘째 발가락이 더 김";
  if (v === "square") return "발가락: 앞쪽 길이가 비슷함";
  return "발가락 형태: 미확인";
}
