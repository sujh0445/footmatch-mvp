import { Suspense } from "react";
import { ShoeSearchClient } from "@/components/ShoeSearchClient";
import { getPublicCatalogShoes } from "@/data/shoes";

export default function ShoesPage() {
  const shoes = getPublicCatalogShoes();

  return (
    <Suspense fallback={null}>
      <ShoeSearchClient shoes={shoes} />
    </Suspense>
  );
}
