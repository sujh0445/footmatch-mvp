import { notFound } from "next/navigation";
import { ShoeDetailClient } from "@/components/ShoeDetailClient";
import { getShoeById } from "@/data/shoes";

export default function ShoeDetailPage({ params }: { params: { id: string } }) {
  const shoe = getShoeById(params.id);

  if (!shoe) {
    notFound();
  }

  return <ShoeDetailClient shoe={shoe} />;
}
