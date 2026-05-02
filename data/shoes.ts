import { ShoeModel } from "@/types";
import normalizedProducts from "./normalized-products.json";

type NormalizedProduct = {
  canonicalKey: string;
  brand: string;
  modelName: string;
  category: string;
  gender: string;
  imageUrl: string;
  productUrls: string[];
};

type RunningUseType = "running_launch" | "running_heritage_lifestyle" | "running_archive" | "legacy_sample";

type CatalogVisibility = "public" | "hidden";

type CatalogFamily = "asics-launch" | "asics-heritage" | "asics-archive" | "legacy-seed";

type LaunchFamilyKey =
  | "gel-nimbus-28"
  | "gel-kayano-32"
  | "novablast-5"
  | "magic-speed-5"
  | "trabuco-14"
  | "fujispeed-4";

type FitInsightShoeType = "road_daily" | "road_stability" | "tempo" | "trail";

type FitInsightDraft = {
  status: "pilot_candidate" | "launch_visible_not_piloted";
  objective: {
    trueToSize: "unknown";
    internalLengthMm: null;
    toeboxWidthMm: null;
    toeboxHeightMm: null;
    widthOptions: string[];
    shoeType: FitInsightShoeType;
  };
  reviewSignals: {
    usualSizeMm: number[];
    purchasedSizeMm: number[];
    keywords: string[];
  };
};

type LaunchSpec = {
  familyKey: LaunchFamilyKey;
  familyLabel: string;
  representativeMatcher: string;
  shoeType: FitInsightShoeType;
  pilotCandidate: boolean;
};

export type CatalogShoe = ShoeModel & {
  catalogVisibility: CatalogVisibility;
  catalogFamily: CatalogFamily;
  familyKey?: LaunchFamilyKey;
  isLaunchTarget: boolean;
  isPublicRepresentative?: boolean;
  runningUseType: RunningUseType;
  sourceCategory?: string;
  sourceModelName?: string;
  routeId?: string;
  fitInsightDraft?: FitInsightDraft;
};

const launchSpecs: LaunchSpec[] = [
  { familyKey: "gel-nimbus-28", familyLabel: "젤 님버스 28", representativeMatcher: "젤 님버스 28", shoeType: "road_daily", pilotCandidate: true },
  { familyKey: "gel-kayano-32", familyLabel: "젤 카야노 32", representativeMatcher: "젤 카야노 32", shoeType: "road_stability", pilotCandidate: true },
  { familyKey: "novablast-5", familyLabel: "노바블라스트 5", representativeMatcher: "노바블라스트 5", shoeType: "road_daily", pilotCandidate: true },
  { familyKey: "magic-speed-5", familyLabel: "매직 스피드 5", representativeMatcher: "매직 스피드 5", shoeType: "tempo", pilotCandidate: true },
  { familyKey: "trabuco-14", familyLabel: "트라부코 14", representativeMatcher: "트라부코 14", shoeType: "trail", pilotCandidate: true },
  { familyKey: "fujispeed-4", familyLabel: "후지스피드 4", representativeMatcher: "후지스피드 4", shoeType: "trail", pilotCandidate: false }
];

const heritageLifestyleModelPrefixes = ["GT 2160", "젤 NYC", "젤 1130", "젤 카야노 14"];

function getLaunchSpec(modelName: string) {
  return launchSpecs.find(
    (spec) => modelName === spec.representativeMatcher || modelName.startsWith(spec.representativeMatcher)
  );
}

function isHeritageLifestyleModel(modelName: string, category: string) {
  return heritageLifestyleModelPrefixes.some((prefix) => modelName.startsWith(prefix)) || category === "tennis" || category === "sportstyle";
}

function buildFitInsightDraft(shoeType: FitInsightShoeType, pilotCandidate: boolean): FitInsightDraft {
  return {
    status: pilotCandidate ? "pilot_candidate" : "launch_visible_not_piloted",
    objective: {
      trueToSize: "unknown",
      internalLengthMm: null,
      toeboxWidthMm: null,
      toeboxHeightMm: null,
      widthOptions: [],
      shoeType
    },
    reviewSignals: {
      usualSizeMm: [],
      purchasedSizeMm: [],
      keywords: []
    }
  };
}

const seedShoes = [
  {
    id: "nb-990v6",
    brand: "New Balance",
    modelName: "990v6",
    category: "lifestyle",
    fitSummary: "안정적인 플랫폼과 적당한 앞볼 볼륨으로 데일리 착용에 무난한 편.",
    sizingTendency: "대체로 정사이즈지만 앞쪽은 약간 여유 있게 느끼는 편.",
    imageSrc: "/shoes/nb-990v6.svg",
    imageAlt: "New Balance 990v6 대표 이미지",
    productUrl: "https://www.newbalance.com/pd/990v6/"
  },
  {
    id: "asics-kayano-31",
    brand: "ASICS",
    modelName: "GEL-KAYANO 31",
    category: "running",
    fitSummary: "중족부를 잘 잡아주고 발등 감싸는 느낌이 분명한 안정형 러닝화.",
    sizingTendency: "길이는 정사이즈 쪽, 발등이 높은 경우는 답답하게 느낄 수 있음.",
    imageSrc: "/shoes/asics-kayano-31.svg",
    imageAlt: "ASICS GEL-KAYANO 31 대표 이미지",
    productUrl: "https://www.asics.com/us/en-us/gel-kayano-31/"
  },
  {
    id: "nike-pegasus-41",
    brand: "Nike",
    modelName: "Pegasus 41",
    category: "running",
    fitSummary: "균형형 데일리 러닝화로 뒤꿈치 고정감이 안정적인 편.",
    sizingTendency: "길이는 무난하지만 넓은 발은 앞볼이 타이트하게 느껴질 수 있음.",
    imageSrc: "/shoes/nike-pegasus-41.svg",
    imageAlt: "Nike Pegasus 41 대표 이미지",
    productUrl: "https://about.nike.com/en/newsroom/releases/nike-pegasus-41-official-images"
  },
  {
    id: "adidas-samba-og",
    brand: "Adidas",
    modelName: "Samba OG",
    category: "lifestyle",
    fitSummary: "낮은 볼륨의 클래식한 실루엣으로 앞쪽은 타이트하게 느끼기 쉬움.",
    sizingTendency: "앞볼이 좁게 느껴져 반업을 고려하는 경우가 많음.",
    imageSrc: "/shoes/adidas-samba-og.svg",
    imageAlt: "Adidas Samba OG 대표 이미지",
    productUrl: "https://www.adidas.com/us/samba-og-shoes/"
  },
  {
    id: "hoka-clifton-9",
    brand: "HOKA",
    modelName: "Clifton 9",
    category: "running",
    fitSummary: "부드러운 착지감과 록커감이 있고 앞쪽 공간은 비교적 여유 있는 편.",
    sizingTendency: "약간 길게 느끼는 사람도 있어 정사이즈 기준으로 먼저 보는 편.",
    imageSrc: "/shoes/hoka-clifton-9.svg",
    imageAlt: "HOKA Clifton 9 대표 이미지",
    productUrl: "https://www.hoka.com/en/us/mens-everyday-running-shoes/clifton-9/"
  },
  {
    id: "salomon-xt6",
    brand: "Salomon",
    modelName: "XT-6",
    category: "lifestyle",
    fitSummary: "정교하게 잡아주는 핏과 단단한 착화감이 특징인 테크니컬 모델.",
    sizingTendency: "발등과 앞볼이 타이트하게 느껴져 볼륨 있는 발은 반업 고려.",
    imageSrc: "/shoes/salomon-xt6.svg",
    imageAlt: "Salomon XT-6 대표 이미지",
    productUrl: "https://www.salomon.com/en-us/shop/product/xt-6-lg9337.html"
  },
  {
    id: "converse-chuck-70",
    brand: "Converse",
    modelName: "Chuck 70",
    category: "lifestyle",
    fitSummary: "캔버스 구조감이 분명하고 평평한 플랫폼으로 캐주얼 착용에 적합.",
    sizingTendency: "길이가 다소 길게 느껴져 러닝화 기준보다 반다운하는 경우가 있음.",
    imageSrc: "/shoes/converse-chuck-70.svg",
    imageAlt: "Converse Chuck 70 대표 이미지",
    productUrl: "https://www.converse.com/shop/p/chuck-70-unisex-high-top-shoe/162050C.html"
  },
  {
    id: "vans-old-skool",
    brand: "Vans",
    modelName: "Old Skool",
    category: "lifestyle",
    fitSummary: "낮은 프로파일과 단단한 측면 구조로 보드 감각이 분명한 편.",
    sizingTendency: "앞코와 발등이 낮아 정사이즈에서 타이트함을 느끼는 경우가 있음.",
    imageSrc: "/shoes/vans-old-skool.svg",
    imageAlt: "Vans Old Skool 대표 이미지",
    productUrl: "https://www.vans.com/en-us/shoes-c00081/old-skool-shoe-pvn000d3hy28"
  },
  {
    id: "reebok-nano-x4",
    brand: "Reebok",
    modelName: "Nano X4",
    category: "training",
    fitSummary: "리프팅 안정감과 앞쪽 유연성을 같이 가져가는 트레이닝화.",
    sizingTendency: "길이는 무난하고 앞볼 볼륨은 중간 정도.",
    imageSrc: "/shoes/reebok-nano-x4.svg",
    imageAlt: "Reebok Nano X4 대표 이미지",
    productUrl: "https://www.reebok.com/p/100074109/nano-x4-training-shoes"
  },
  {
    id: "nike-metcon-9",
    brand: "Nike",
    modelName: "Metcon 9",
    category: "training",
    fitSummary: "매우 안정적인 뒤꿈치와 조이는 중족부 핏이 특징인 크로스트레이닝화.",
    sizingTendency: "앞볼이 짧고 타이트하게 느껴질 수 있어 넓은 발은 반업 고려.",
    imageSrc: "/shoes/nike-metcon-9.svg",
    imageAlt: "Nike Metcon 9 대표 이미지",
    productUrl: "https://www.nike.com/t/metcon-9-mens-workout-shoes"
  },
  {
    id: "new-balance-2002r",
    brand: "New Balance",
    modelName: "2002R",
    category: "lifestyle",
    fitSummary: "적당한 쿠션과 무난한 볼륨으로 데일리 라이프스타일 착용에 편한 편.",
    sizingTendency: "대체로 정사이즈, 앞볼은 990v6보다 약간 타이트하게 느끼는 경우가 있음.",
    imageSrc: "/shoes/new-balance-2002r.svg",
    imageAlt: "New Balance 2002R 대표 이미지",
    productUrl: "https://www.newbalance.com/pd/2002r/"
  },
  {
    id: "asics-gel-nimbus-27",
    brand: "ASICS",
    modelName: "GEL-NIMBUS 27",
    category: "running",
    fitSummary: "쿠션감이 크고 상부 압박이 과하지 않은 장거리형 러닝화.",
    sizingTendency: "길이는 정사이즈 쪽, 발볼은 보통~약간 여유 있게 느끼는 편.",
    imageSrc: "/shoes/asics-gel-nimbus-27.svg",
    imageAlt: "ASICS GEL-NIMBUS 27 대표 이미지",
    productUrl: "https://www.asics.com/us/en-us/gel-nimbus-27/"
  },
  {
    id: "nike-vomero-18",
    brand: "Nike",
    modelName: "Vomero 18",
    category: "running",
    fitSummary: "쿠션감이 풍부하고 데일리 러닝과 장시간 보행 모두 무난한 편.",
    sizingTendency: "정사이즈 기반이지만 두꺼운 양말이나 넓은 발은 반업 검토 가능.",
    imageSrc: "/shoes/nike-vomero-18.svg",
    imageAlt: "Nike Vomero 18 대표 이미지",
    productUrl: "https://www.nike.com/t/vomero-18-mens-road-running-shoes"
  },
  {
    id: "adidas-ultraboost-5",
    brand: "Adidas",
    modelName: "Ultraboost 5",
    category: "running",
    fitSummary: "발등을 감싸는 니트 상부와 반발감 있는 미드솔이 특징.",
    sizingTendency: "발등과 중족부가 조여지는 느낌이 있어 볼륨 있는 발은 여유 확인 필요.",
    imageSrc: "/shoes/adidas-ultraboost-5.svg",
    imageAlt: "Adidas Ultraboost 5 대표 이미지",
    productUrl: "https://www.adidas.com/us/ultraboost-5-shoes/"
  },
  {
    id: "hoka-bondi-8",
    brand: "HOKA",
    modelName: "Bondi 8",
    category: "running",
    fitSummary: "높은 쿠션과 넉넉한 플랫폼으로 장시간 보행에도 피로감이 적은 편.",
    sizingTendency: "길이는 무난하고 전체적으로 여유 쪽에 가까운 편.",
    imageSrc: "/shoes/hoka-bondi-8.svg",
    imageAlt: "HOKA Bondi 8 대표 이미지",
    productUrl: "https://www.hoka.com/en/us/mens-road/bondi-8/"
  },
  {
    id: "salomon-acs-pro",
    brand: "Salomon",
    modelName: "ACS Pro",
    category: "lifestyle",
    fitSummary: "기술적인 갑피 구조와 단단한 고정감이 강조되는 모델.",
    sizingTendency: "발등과 앞볼이 타이트할 수 있어 넓거나 높은 발은 반업 검토.",
    imageSrc: "/shoes/salomon-acs-pro.svg",
    imageAlt: "Salomon ACS Pro 대표 이미지",
    productUrl: "https://www.salomon.com/en-us/shop/product/acs-pro-li3128.html"
  },
  {
    id: "converse-run-star-hike",
    brand: "Converse",
    modelName: "Run Star Hike",
    category: "lifestyle",
    fitSummary: "볼드한 아웃솔과 비교적 단단한 상부 구조가 특징인 패션형 모델.",
    sizingTendency: "길이는 다소 길게 느껴질 수 있어 정사이즈~반다운 범위를 먼저 확인.",
    imageSrc: "/shoes/converse-run-star-hike.svg",
    imageAlt: "Converse Run Star Hike 대표 이미지",
    productUrl: "https://www.converse.com/shop/p/run-star-hike-unisex-high-top-shoe/166800C.html"
  },
  {
    id: "vans-knu-skool",
    brand: "Vans",
    modelName: "Knu Skool",
    category: "lifestyle",
    fitSummary: "볼륨감 있는 패딩 디테일이 있지만 내부 길이감은 과하게 크지 않은 편.",
    sizingTendency: "정사이즈 기반, 앞쪽은 Old Skool보다 조금 여유 있는 편.",
    imageSrc: "/shoes/vans-knu-skool.svg",
    imageAlt: "Vans Knu Skool 대표 이미지",
    productUrl: "https://www.vans.com/en-us/shoes-c00081/knu-skool-shoe-pvn0009qc6bt"
  },
  {
    id: "reebok-nanoflex-tr-2",
    brand: "Reebok",
    modelName: "Nanoflex TR 2",
    category: "training",
    fitSummary: "가볍게 헬스와 클래스 운동을 소화하기 무난한 입문형 트레이닝화.",
    sizingTendency: "정사이즈 기반, 발등 압박은 Nano X4보다 약한 편.",
    imageSrc: "/shoes/reebok-nanoflex-tr-2.svg",
    imageAlt: "Reebok Nanoflex TR 2 대표 이미지",
    productUrl: "https://www.reebok.com/p/100033482/nanoflex-tr-2-training-shoes"
  },
  {
    id: "nike-free-metcon-6",
    brand: "Nike",
    modelName: "Free Metcon 6",
    category: "training",
    fitSummary: "유연성과 안정감을 같이 노린 하이브리드형 트레이닝화.",
    sizingTendency: "중족부 감싸는 느낌이 분명해 높은 발등은 답답함을 느낄 수 있음.",
    imageSrc: "/shoes/nike-free-metcon-6.svg",
    imageAlt: "Nike Free Metcon 6 대표 이미지",
    productUrl: "https://www.nike.com/t/free-metcon-6-mens-workout-shoes"
  }
] satisfies ShoeModel[];

function slugify(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveDisplayCategory(category: string): ShoeModel["category"] {
  if (category === "running" || category === "lifestyle" || category === "training") {
    return category;
  }

  if (category === "tennis") {
    return "training";
  }

  if (category === "sportstyle") {
    return "lifestyle";
  }

  return "lifestyle";
}

function buildFallbackFitSummary(brand: string, modelName: string) {
  return `${brand} ${modelName}의 핏 정보는 아직 정리 중이에요.`;
}

function buildFallbackSizingTendency(brand: string, modelName: string) {
  return `${brand} ${modelName}의 사이즈 판단 정보는 아직 없어요.`;
}

function buildImageAlt(brand: string, modelName: string) {
  return `${brand} ${modelName} 대표 이미지`;
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getProductNo(productUrl: string) {
  const match = productUrl.match(/[?&]no=(\d+)/);
  return match?.[1] ?? null;
}

function ensureUniqueRouteId(candidate: string, usedRouteIds: Set<string>) {
  if (!usedRouteIds.has(candidate)) {
    return candidate;
  }

  let suffix = 2;
  while (usedRouteIds.has(`${candidate}-${suffix}`)) {
    suffix += 1;
  }

  return `${candidate}-${suffix}`;
}

function buildImportedId(canonicalKey: string, usedIds: Set<string>) {
  const baseId = slugify(canonicalKey);
  const suffixes = ["", "-normalized", "-normalized-2", "-normalized-3", "-normalized-4", "-normalized-5"];

  for (const suffix of suffixes) {
    const candidate = `${baseId}${suffix}`;
    if (!usedIds.has(candidate)) {
      return candidate;
    }
  }

  let index = suffixes.length;
  while (true) {
    const candidate = `${baseId}-normalized-${index}`;
    if (!usedIds.has(candidate)) {
      return candidate;
    }
    index += 1;
  }
}

function buildImportedRouteId(product: NormalizedProduct, fallbackId: string, usedRouteIds: Set<string>) {
  const no = getProductNo(product.productUrls[0] ?? "");
  const baseRouteId = no ? `asics-${no}` : fallbackId;
  return ensureUniqueRouteId(baseRouteId, usedRouteIds);
}

function mapHiddenSeedShoe(shoe: ShoeModel): CatalogShoe {
  return {
    ...shoe,
    catalogVisibility: "hidden",
    catalogFamily: "legacy-seed",
    isLaunchTarget: false,
    runningUseType: "legacy_sample",
    routeId: shoe.id
  };
}

function mapNormalizedProduct(product: NormalizedProduct, usedIds: Set<string>, usedRouteIds: Set<string>): CatalogShoe {
  const launchSpec = getLaunchSpec(product.modelName);
  const isLaunchTarget = Boolean(launchSpec);
  const id = buildImportedId(product.canonicalKey, usedIds);
  usedIds.add(id);

  const routeId = buildImportedRouteId(product, id, usedRouteIds);
  usedRouteIds.add(routeId);

  const runningUseType: RunningUseType = isLaunchTarget
    ? "running_launch"
    : isHeritageLifestyleModel(product.modelName, product.category)
      ? "running_heritage_lifestyle"
      : "running_archive";

  const catalogFamily: CatalogFamily = isLaunchTarget
    ? "asics-launch"
    : runningUseType === "running_heritage_lifestyle"
      ? "asics-heritage"
      : "asics-archive";

  return {
    id,
    routeId,
    brand: product.brand,
    modelName: product.modelName,
    category: resolveDisplayCategory(product.category),
    sourceCategory: product.category,
    sourceModelName: product.modelName,
    catalogVisibility: "hidden",
    catalogFamily,
    familyKey: launchSpec?.familyKey,
    isLaunchTarget,
    runningUseType,
    fitSummary: buildFallbackFitSummary(product.brand, product.modelName),
    sizingTendency: buildFallbackSizingTendency(product.brand, product.modelName),
    imageSrc: product.imageUrl,
    imageAlt: buildImageAlt(product.brand, product.modelName),
    productUrl: product.productUrls[0],
    fitInsightDraft: launchSpec ? buildFitInsightDraft(launchSpec.shoeType, launchSpec.pilotCandidate) : undefined
  };
}

const hiddenSeedShoes = seedShoes.map(mapHiddenSeedShoe);
const seedIds = new Set(hiddenSeedShoes.map((shoe) => shoe.id));
const seedRouteIds = new Set(hiddenSeedShoes.map((shoe) => shoe.routeId ?? shoe.id));
const catalogNormalizedShoes = (normalizedProducts as NormalizedProduct[]).map((product) =>
  mapNormalizedProduct(product, seedIds, seedRouteIds)
);

export const catalogShoes: CatalogShoe[] = [...hiddenSeedShoes, ...catalogNormalizedShoes];
export const hiddenCatalogShoes = catalogShoes;

function pickRepresentativeRawShoe(spec: LaunchSpec) {
  return (
    catalogShoes.find((shoe) => shoe.brand === "ASICS" && shoe.modelName === spec.representativeMatcher) ??
    catalogShoes.find((shoe) => shoe.brand === "ASICS" && shoe.modelName.startsWith(spec.representativeMatcher))
  );
}

function buildPublicRepresentativeShoe(rawShoe: CatalogShoe | undefined, spec: LaunchSpec): CatalogShoe | null {
  if (!rawShoe) {
    return null;
  }

  return {
    ...rawShoe,
    modelName: spec.familyLabel,
    sourceModelName: rawShoe.modelName,
    catalogVisibility: "public",
    catalogFamily: "asics-launch",
    familyKey: spec.familyKey,
    isLaunchTarget: true,
    isPublicRepresentative: true,
    runningUseType: "running_launch",
    fitInsightDraft: buildFitInsightDraft(spec.shoeType, spec.pilotCandidate)
  };
}

export const publicCatalogShoes = launchSpecs
  .map((spec) => buildPublicRepresentativeShoe(pickRepresentativeRawShoe(spec), spec))
  .filter((shoe): shoe is CatalogShoe => Boolean(shoe));

export const fitInsightPilotShoes = publicCatalogShoes.filter((shoe) => shoe.fitInsightDraft?.status === "pilot_candidate");

export function getPublicCatalogShoes() {
  return publicCatalogShoes;
}

export function getLaunchRunningShoes() {
  return publicCatalogShoes;
}

export function getHiddenLegacyShoes() {
  return hiddenCatalogShoes;
}

export function getFitInsightPilotShoes() {
  return fitInsightPilotShoes;
}

export function normalizeShoeId(id: string) {
  return safeDecodeURIComponent(id).replace(/^asics-asics-/, "asics-");
}

function getMatchingShoe(shoesToSearch: CatalogShoe[], id: string) {
  const normalizedId = normalizeShoeId(id);
  return shoesToSearch.find(
    (shoe) => normalizeShoeId(shoe.id) === normalizedId || normalizeShoeId(shoe.routeId ?? shoe.id) === normalizedId
  );
}

export function getPublicShoeById(id: string) {
  return getMatchingShoe(publicCatalogShoes, id);
}

export function getHiddenShoeById(id: string) {
  return getMatchingShoe(hiddenCatalogShoes, id);
}

export function getShoeById(id: string) {
  return getPublicShoeById(id);
}

export function getShoeRouteId(shoe: CatalogShoe) {
  return normalizeShoeId(shoe.routeId ?? shoe.id);
}

export const shoes = publicCatalogShoes;
