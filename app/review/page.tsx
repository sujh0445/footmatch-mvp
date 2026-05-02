import { ReviewForm } from "@/components/ReviewForm";
import { getDefaultReviewShoeId, getPublicCatalogShoes } from "@/data/shoes";

export default function ReviewPage() {
  const shoes = getPublicCatalogShoes();
  const defaultShoeId = getDefaultReviewShoeId();

  return <ReviewForm defaultShoeId={defaultShoeId} shoes={shoes} />;
}
