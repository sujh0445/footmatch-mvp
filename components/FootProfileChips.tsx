import { FootProfile } from "@/types";

const map: Record<string, string> = {
  narrow: "좁은 발볼",
  normal: "보통 발볼",
  wide: "넓은 발볼",
  low: "낮은 발등",
  high: "높은 발등",
  egyptian: "엄지발가락이 가장 김",
  greek: "둘째발가락이 가장 김",
  square: "앞쪽 발가락 길이가 비슷함",
  low_heel: "뒤꿈치 들림 낮음",
  medium_heel: "뒤꿈치 들림 보통",
  high_heel: "뒤꿈치 들림 높음"
};

export function FootProfileChips({ profile }: { profile: FootProfile }) {
  const chips = [
    `실측 ${profile.footLengthMm}mm`,
    map[profile.forefootWidth],
    map[profile.instepHeight],
    map[profile.toeShape],
    map[`${profile.heelSlipTendency}_heel`]
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700">
          {chip}
        </span>
      ))}
    </div>
  );
}
