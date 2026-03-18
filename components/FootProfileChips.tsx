import { FootProfile } from "@/types";

const map: Record<string, string> = {
  narrow: "좁은 발볼",
  normal: "보통 발볼",
  wide: "넓은 발볼",
  low: "낮은 발등",
  high: "높은 발등",
  egyptian: "이집트형 발가락",
  greek: "그리스형 발가락",
  square: "스퀘어형 발가락",
  small: "좌우 차이 작음",
  medium: "좌우 차이 보통",
  large: "좌우 차이 큼"
};

export function FootProfileChips({ profile }: { profile: FootProfile }) {
  const chips = [`길이 ${profile.footLengthMm}mm`, map[profile.forefootWidth], map[profile.instepHeight], map[profile.toeShape], `뒤꿈치 들림 ${profile.heelSlipTendency}`];

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
