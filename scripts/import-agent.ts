import { mkdir, writeFile } from "fs/promises";

type SourceName = "brand_site" | "retailer" | "community";

type RawProduct = {
  source: SourceName;
  externalId: string;
  brandRaw: string;
  modelNameRaw: string;
  categoryRaw?: string | null;
  genderRaw?: string | null;
  imageUrl?: string | null;
  productUrl: string;
  priceRaw?: string | null;
  fetchedAt: string;
};

type RawReview = {
  source: SourceName;
  productExternalId: string;
  reviewId: string;
  reviewText: string;
  ratingRaw?: number | null;
  authorRaw?: string | null;
  createdAtRaw?: string | null;
  fetchedAt: string;
};

type NormalizedProduct = {
  canonicalKey: string;
  brand: string;
  modelName: string;
  category: "running" | "lifestyle" | "training" | "basketball" | "other";
  gender: "men" | "women" | "unisex" | "unknown";
  imageUrl?: string | null;
  productUrls: string[];
  rawSources: SourceName[];
  latestFetchedAt: string;
};

type ImportRunResult = {
  rawProducts: number;
  rawReviews: number;
  normalizedProducts: number;
  skippedProducts: number;
  warnings: string[];
};

interface ProductSourceAdapter {
  name: SourceName;
  fetchProducts(): Promise<RawProduct[]>;
  fetchReviews(products: RawProduct[]): Promise<RawReview[]>;
}

interface PersistenceAdapter {
  saveRawProducts(products: RawProduct[]): Promise<void>;
  saveRawReviews(reviews: RawReview[]): Promise<void>;
  upsertNormalizedProducts(products: NormalizedProduct[]): Promise<void>;
  logRun(result: ImportRunResult): Promise<void>;
}

const BRAND_ALIASES: Record<string, string> = {
  nike: "Nike",
  "new balance": "New Balance",
  newbalance: "New Balance",
  asics: "ASICS",
  adidas: "adidas",
};

const CATEGORY_RULES: Array<{
  pattern: RegExp;
  category: NormalizedProduct["category"];
}> = [
  { pattern: /run|running|trainer/i, category: "running" },
  { pattern: /basket|hoops/i, category: "basketball" },
  { pattern: /lifestyle|casual|daily/i, category: "lifestyle" },
  { pattern: /training|gym/i, category: "training" },
];

function normalizeBrand(brandRaw: string): string {
  const key = brandRaw.trim().toLowerCase();
  return BRAND_ALIASES[key] ?? brandRaw.trim();
}

function normalizeModelName(modelNameRaw: string): string {
  return modelNameRaw
    .replace(/men'?s|women'?s|unisex/gi, "")
    .replace(/running shoes?|sneakers?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCategory(
  categoryRaw?: string | null,
  modelNameRaw?: string
): NormalizedProduct["category"] {
  const text = `${categoryRaw ?? ""} ${modelNameRaw ?? ""}`.trim();
  const match = CATEGORY_RULES.find((rule) => rule.pattern.test(text));
  return match?.category ?? "other";
}

function normalizeGender(
  genderRaw?: string | null,
  modelNameRaw?: string
): NormalizedProduct["gender"] {
  const text = `${genderRaw ?? ""} ${modelNameRaw ?? ""}`.toLowerCase();
  if (text.includes("women")) return "women";
  if (text.includes("men")) return "men";
  if (text.includes("unisex")) return "unisex";
  return "unknown";
}

function buildCanonicalKey(brand: string, modelName: string, gender: string): string {
  return `${brand}::${modelName}::${gender}`.toLowerCase();
}

function mergeProducts(rawProducts: RawProduct[]): {
  merged: NormalizedProduct[];
  skipped: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  const mergedMap = new Map<string, NormalizedProduct>();
  let skipped = 0;

  for (const raw of rawProducts) {
    if (!raw.brandRaw?.trim() || !raw.modelNameRaw?.trim() || !raw.productUrl?.trim()) {
      skipped += 1;
      warnings.push(`Skipped product with missing fields: ${raw.externalId}`);
      continue;
    }

    const brand = normalizeBrand(raw.brandRaw);
    const modelName = normalizeModelName(raw.modelNameRaw);
    const category = normalizeCategory(raw.categoryRaw, raw.modelNameRaw);
    const gender = normalizeGender(raw.genderRaw, raw.modelNameRaw);
    const canonicalKey = buildCanonicalKey(brand, modelName, gender);

    const existing = mergedMap.get(canonicalKey);

    if (!existing) {
      mergedMap.set(canonicalKey, {
        canonicalKey,
        brand,
        modelName,
        category,
        gender,
        imageUrl: raw.imageUrl ?? null,
        productUrls: [raw.productUrl],
        rawSources: [raw.source],
        latestFetchedAt: raw.fetchedAt,
      });
      continue;
    }

    existing.productUrls = Array.from(new Set([...existing.productUrls, raw.productUrl]));
    existing.rawSources = Array.from(new Set([...existing.rawSources, raw.source]));
    if (!existing.imageUrl && raw.imageUrl) existing.imageUrl = raw.imageUrl;
    if (raw.fetchedAt > existing.latestFetchedAt) existing.latestFetchedAt = raw.fetchedAt;
  }

  return {
    merged: Array.from(mergedMap.values()),
    skipped,
    warnings,
  };
}

class JsonFilePersistenceAdapter implements PersistenceAdapter {
  constructor(private readonly baseDir: string = "./data") {}

  private async ensureDirs() {
    await mkdir(this.baseDir, { recursive: true });
    await mkdir(`${this.baseDir}/runs`, { recursive: true });
  }

  async saveRawProducts(products: RawProduct[]): Promise<void> {
    await this.ensureDirs();
    await writeFile(
      `${this.baseDir}/raw-products.json`,
      JSON.stringify(products, null, 2),
      "utf-8"
    );
  }

  async saveRawReviews(reviews: RawReview[]): Promise<void> {
    await this.ensureDirs();
    await writeFile(
      `${this.baseDir}/raw-reviews.json`,
      JSON.stringify(reviews, null, 2),
      "utf-8"
    );
  }

  async upsertNormalizedProducts(products: NormalizedProduct[]): Promise<void> {
    await this.ensureDirs();
    await writeFile(
      `${this.baseDir}/normalized-products.json`,
      JSON.stringify(products, null, 2),
      "utf-8"
    );
  }

  async logRun(result: ImportRunResult): Promise<void> {
    await this.ensureDirs();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await writeFile(
      `${this.baseDir}/runs/import-run-${timestamp}.json`,
      JSON.stringify(result, null, 2),
      "utf-8"
    );
  }
}

class DemoRetailerAdapter implements ProductSourceAdapter {
  name: SourceName = "retailer";

  async fetchProducts(): Promise<RawProduct[]> {
    const fetchedAt = new Date().toISOString();

    return [
      {
        source: this.name,
        externalId: "demo-pegasus-41",
        brandRaw: "Nike",
        modelNameRaw: "Nike Pegasus 41 Men's Running Shoes",
        categoryRaw: "Running",
        genderRaw: "Men",
        imageUrl: "https://example.com/pegasus-41.jpg",
        productUrl: "https://example.com/nike-pegasus-41",
        fetchedAt,
      },
      {
        source: this.name,
        externalId: "demo-gel-kayano-31",
        brandRaw: "ASICS",
        modelNameRaw: "GEL-KAYANO 31",
        categoryRaw: "Running",
        genderRaw: "Unisex",
        imageUrl: "https://example.com/kayano-31.jpg",
        productUrl: "https://example.com/asics-gel-kayano-31",
        fetchedAt,
      },
    ];
  }

  async fetchReviews(products: RawProduct[]): Promise<RawReview[]> {
    const fetchedAt = new Date().toISOString();

    return products.flatMap((product) => {
      if (product.externalId === "demo-pegasus-41") {
        return [
          {
            source: this.name,
            productExternalId: product.externalId,
            reviewId: "r1",
            reviewText: "True to size overall, but the toe box feels slightly snug.",
            ratingRaw: 4,
            fetchedAt,
          },
          {
            source: this.name,
            productExternalId: product.externalId,
            reviewId: "r2",
            reviewText: "Wide feet may want to go half size up.",
            ratingRaw: 5,
            fetchedAt,
          },
        ];
      }

      return [
        {
          source: this.name,
          productExternalId: product.externalId,
          reviewId: `review-${product.externalId}`,
          reviewText: "Excellent lockdown through the midfoot and stable ride.",
          ratingRaw: 5,
          fetchedAt,
        },
      ];
    });
  }
}

class ImportAgent {
  constructor(
    private readonly sources: ProductSourceAdapter[],
    private readonly persistence: PersistenceAdapter
  ) {}

  async run(): Promise<ImportRunResult> {
    const allRawProducts: RawProduct[] = [];
    const allRawReviews: RawReview[] = [];
    const warnings: string[] = [];

    for (const source of this.sources) {
      const products = await source.fetchProducts();
      const reviews = await source.fetchReviews(products);

      allRawProducts.push(...products);
      allRawReviews.push(...reviews);
    }

    await this.persistence.saveRawProducts(allRawProducts);
    await this.persistence.saveRawReviews(allRawReviews);

    const { merged, skipped, warnings: mergeWarnings } = mergeProducts(allRawProducts);
    warnings.push(...mergeWarnings);

    await this.persistence.upsertNormalizedProducts(merged);

    const result: ImportRunResult = {
      rawProducts: allRawProducts.length,
      rawReviews: allRawReviews.length,
      normalizedProducts: merged.length,
      skippedProducts: skipped,
      warnings,
    };

    await this.persistence.logRun(result);
    return result;
  }
}

async function main() {
  const persistence = new JsonFilePersistenceAdapter();
  const agent = new ImportAgent([new DemoRetailerAdapter()], persistence);
  const result = await agent.run();
  console.log("ImportAgent finished:", result);
}

void main();
