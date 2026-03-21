interface SimilarityBadgeProps {
  score: number;
}

export function SimilarityBadge({ score }: SimilarityBadgeProps) {
  const tone = score >= 85 ? "bg-emerald-100 text-emerald-700" : score >= 70 ? "bg-blue-100 text-blue-700" : "bg-neutral-200 text-neutral-700";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>비슷한 정도 {score}%</span>;
}
