import { notFound } from "next/navigation";
import { ShoeDetailClient } from "@/components/ShoeDetailClient";
import { shoes } from "@/data/shoes";

export default function ShoeDetailPage({ params }: { params: { id: string } }) {
  const shoe = shoes.find((item) => item.id === params.id);

  if (!shoe) {
    notFound();
  }

  return <ShoeDetailClient shoe={shoe} />;
}
