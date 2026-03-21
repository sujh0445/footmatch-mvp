import { ShoeReview } from "@/types";

export const shoeReviews: ShoeReview[] = [
  {
    id: "r1",
    shoeId: "nike-pegasus-41",
    reviewerFootProfile: {
      actualFootLengthMm: 267,
      usualPurchasedSizeMm: 270,
      forefootSizingUpFrequency: "often",
      forefootPressureFrequency: "often",
      toeShape: "egyptian"
    },
    usualPurchasedSizeMm: 270,
    purchasedSizeMm: 275,
    forefootPressure: "sometimes",
    instepPressure: "rarely",
    heelSlip: "rarely",
    heelLiningWear: "rarely",
    comfortRating: 4,
    comment: "앞볼 압박이 줄어들어서 275가 더 편했습니다.",
    useCase: "running",
    tags: ["일상", "러닝"]
  },
  {
    id: "r2",
    shoeId: "nike-pegasus-41",
    reviewerFootProfile: {
      actualFootLengthMm: 265,
      usualPurchasedSizeMm: 270,
      forefootSizingUpFrequency: "sometimes",
      forefootPressureFrequency: "sometimes",
      toeShape: "greek"
    },
    usualPurchasedSizeMm: 270,
    purchasedSizeMm: 270,
    forefootPressure: "sometimes",
    instepPressure: "rarely",
    heelSlip: "sometimes",
    heelLiningWear: "rarely",
    comfortRating: 4,
    comment: "정사이즈도 가능했지만 장거리에서는 발볼이 살짝 답답했습니다.",
    useCase: "running"
  },
  {
    id: "r3",
    shoeId: "adidas-samba-og",
    reviewerFootProfile: {
      actualFootLengthMm: 268,
      usualPurchasedSizeMm: 270,
      forefootSizingUpFrequency: "often",
      forefootPressureFrequency: "often",
      toeShape: "square"
    },
    usualPurchasedSizeMm: 270,
    purchasedSizeMm: 275,
    forefootPressure: "rarely",
    instepPressure: "sometimes",
    heelSlip: "rarely",
    heelLiningWear: "sometimes",
    comfortRating: 4,
    comment: "가죽이 단단해서 반업했더니 앞볼이 훨씬 덜 눌렸습니다.",
    useCase: "style"
  },
  {
    id: "r4",
    shoeId: "hoka-clifton-9",
    reviewerFootProfile: {
      actualFootLengthMm: 271,
      usualPurchasedSizeMm: 275,
      forefootSizingUpFrequency: "sometimes",
      forefootPressureFrequency: "rarely",
      toeShape: "egyptian"
    },
    usualPurchasedSizeMm: 275,
    purchasedSizeMm: 275,
    forefootPressure: "rarely",
    instepPressure: "rarely",
    heelSlip: "sometimes",
    heelLiningWear: "rarely",
    comfortRating: 5,
    comment: "정사이즈로도 여유가 있고 장거리 워킹에 편했습니다.",
    useCase: "walking"
  },
  {
    id: "r5",
    shoeId: "nike-metcon-9",
    reviewerFootProfile: {
      actualFootLengthMm: 266,
      usualPurchasedSizeMm: 270,
      forefootSizingUpFrequency: "often",
      forefootPressureFrequency: "often",
      toeShape: "greek"
    },
    usualPurchasedSizeMm: 270,
    purchasedSizeMm: 275,
    forefootPressure: "sometimes",
    instepPressure: "sometimes",
    heelSlip: "rarely",
    heelLiningWear: "rarely",
    comfortRating: 4,
    comment: "웨이트할 때는 고정감이 좋은데 정사이즈는 앞볼 압박이 있었습니다.",
    useCase: "gym"
  },
  {
    id: "r6",
    shoeId: "nb-990v6",
    reviewerFootProfile: {
      actualFootLengthMm: 269,
      usualPurchasedSizeMm: 270,
      forefootSizingUpFrequency: "rarely",
      forefootPressureFrequency: "rarely",
      toeShape: "egyptian"
    },
    usualPurchasedSizeMm: 270,
    purchasedSizeMm: 270,
    forefootPressure: "rarely",
    instepPressure: "rarely",
    heelSlip: "rarely",
    heelLiningWear: "rarely",
    comfortRating: 5,
    comment: "정사이즈가 가장 안정적이고 일상 착용이 편했습니다.",
    useCase: "daily"
  }
];
