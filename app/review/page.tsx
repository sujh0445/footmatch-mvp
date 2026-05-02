import { ReviewForm } from "@/components/ReviewForm";
import { fitInsightPilotShoes, getPublicCatalogShoes } from "@/data/shoes";

export default function ReviewPage() {
  const shoes = getPublicCatalogShoes();
  const defaultShoeId = fitInsightPilotShoes[0]?.id ?? shoes[0]?.id ?? "";

  return <ReviewForm defaultShoeId={defaultShoeId} shoes={shoes} />;
}
