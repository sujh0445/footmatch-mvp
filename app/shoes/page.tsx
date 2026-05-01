import { Suspense } from "react";
import { ShoeSearchClient } from "@/components/ShoeSearchClient";

export default function ShoesPage() {
  return (
    <Suspense fallback={null}>
      <ShoeSearchClient />
    </Suspense>
  );
}
