import { notFound } from "next/navigation";
import { ShoeDetailClient } from "@/components/ShoeDetailClient";
import { getPublicShoeById } from "@/data/shoes";

export default function ShoeDetailPage({ params }: { params: { id: string } }) {
  const shoe = getPublicShoeById(params.id);

  if (!shoe) {
    notFound();
  }

  return <ShoeDetailClient shoe={shoe} />;
}
