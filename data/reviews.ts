import { ShoeReview } from "@/types";

export const shoeReviews: ShoeReview[] = [
  {
    id: "r1",
    shoeId: "nike-pegasus-41",
    reviewerFootProfile: {
      footLengthMm: 267,
      forefootWidth: "wide",
      instepHeight: "high",
      toeShape: "egyptian",
      heelSlipTendency: "low",
      leftRightDifference: "small",
      usualSneakerSize: 270
    },
    usualSize: 270,
    purchasedSize: 275,
    fitLength: "true",
    fitWidth: "true",
    fitInstep: "true",
    heelLock: "secure",
    comfortRating: 4,
    comment: "Half size up removed width pressure without heel slip.",
    painPoint: "Slight tongue pressure during first week.",
    comfortPoint: "Forefoot feels much less cramped than true size.",
    useCase: "running",
    tags: ["daily", "long walking"]
  },
  {
    id: "r2",
    shoeId: "nike-pegasus-41",
    reviewerFootProfile: {
      footLengthMm: 265,
      forefootWidth: "normal",
      instepHeight: "normal",
      toeShape: "greek",
      heelSlipTendency: "medium",
      leftRightDifference: "small",
      usualSneakerSize: 270
    },
    usualSize: 270,
    purchasedSize: 270,
    fitLength: "true",
    fitWidth: "true",
    fitInstep: "true",
    heelLock: "ok",
    comfortRating: 4,
    comment: "True size worked fine for tempo and easy runs.",
    painPoint: "Heel got warm on long runs.",
    comfortPoint: "Good all-around lock and balanced cushioning.",
    useCase: "running"
  },
  {
    id: "r3",
    shoeId: "adidas-samba-og",
    reviewerFootProfile: {
      footLengthMm: 268,
      forefootWidth: "wide",
      instepHeight: "normal",
      toeShape: "square",
      heelSlipTendency: "low",
      leftRightDifference: "medium",
      usualSneakerSize: 270
    },
    usualSize: 270,
    purchasedSize: 275,
    fitLength: "true",
    fitWidth: "true",
    fitInstep: "true",
    heelLock: "secure",
    comfortRating: 4,
    comment: "Sizing up helped with toe pressure on my wider forefoot.",
    painPoint: "Leather felt stiff first 3 wears.",
    comfortPoint: "After break-in, very comfortable for daily style use.",
    useCase: "style"
  },
  {
    id: "r4",
    shoeId: "hoka-clifton-9",
    reviewerFootProfile: {
      footLengthMm: 271,
      forefootWidth: "wide",
      instepHeight: "high",
      toeShape: "egyptian",
      heelSlipTendency: "medium",
      leftRightDifference: "small",
      usualSneakerSize: 275
    },
    usualSize: 275,
    purchasedSize: 275,
    fitLength: "long",
    fitWidth: "roomy",
    fitInstep: "roomy",
    heelLock: "ok",
    comfortRating: 5,
    comment: "Roomy forefoot; great for recovery runs and walking.",
    painPoint: "Slight heel movement on steep downhills.",
    comfortPoint: "High instep has zero pressure hotspots.",
    useCase: "walking"
  },
  {
    id: "r5",
    shoeId: "nike-metcon-9",
    reviewerFootProfile: {
      footLengthMm: 266,
      forefootWidth: "wide",
      instepHeight: "high",
      toeShape: "greek",
      heelSlipTendency: "low",
      leftRightDifference: "small",
      usualSneakerSize: 270
    },
    usualSize: 270,
    purchasedSize: 275,
    fitLength: "true",
    fitWidth: "true",
    fitInstep: "tight",
    heelLock: "secure",
    comfortRating: 4,
    comment: "Half size up gave enough toe splay for lifting and WODs.",
    painPoint: "Instep still snug with thick socks.",
    comfortPoint: "Very planted heel for heavy squats.",
    useCase: "gym"
  },
  {
    id: "r6",
    shoeId: "nb-990v6",
    reviewerFootProfile: {
      footLengthMm: 269,
      forefootWidth: "normal",
      instepHeight: "normal",
      toeShape: "egyptian",
      heelSlipTendency: "low",
      leftRightDifference: "small",
      usualSneakerSize: 270
    },
    usualSize: 270,
    purchasedSize: 270,
    fitLength: "true",
    fitWidth: "roomy",
    fitInstep: "true",
    heelLock: "secure",
    comfortRating: 5,
    comment: "Excellent all-day comfort and enough toe room.",
    painPoint: "Slightly bulky feel when driving.",
    comfortPoint: "Stable heel and plush underfoot for long days.",
    useCase: "daily"
  }
];
