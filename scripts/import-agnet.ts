import { mkdir, writeFile } from "fs/promises";
import * as cheerio from "cheerio";

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
  { pattern: /run|running|trainer|sports_running/i, category: "running" },
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
  if (text.includes("women") || text.includes("우먼") || text.includes("여성")) return "women";
  if (text.includes("men") || text.includes("맨") || text.includes("남성")) return "men";
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

class AsicsCatalogAdapter implements ProductSourceAdapter {
  name: SourceName = "brand_site";
  private readonly baseUrl = "https://www.asics.co.kr";
  private readonly categoryUrl = "https://www.asics.co.kr/c/sports_running";

  private async fetchHtml(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  }

  private toAbsoluteUrl(href: string): string {
    if (href.startsWith("http")) return href;
    return `${this.baseUrl}${href}`;
  }

  private extractProductLinksFromHtml(html: string): string[] {
    const $ = cheerio.load(html);
    const urls = new Set<string>();

    $("a[href]").each((_, el) => {
      const href = ($(el).attr("href") || "").trim();
      if (!href) return;

      if (href.startsWith("/p/") || href.includes("/p/")) {
        urls.add(this.toAbsoluteUrl(href));
      }
    });

    // fallback: JSON 안에 들어 있는 상품 URL도 추출
    $("script").each((_, el) => {
      const scriptText = $(el).html() || "";
      const matches = scriptText.match(/\/p\/[A-Za-z0-9\-_/]+/g) || [];
      for (const match of matches) {
        urls.add(this.toAbsoluteUrl(match));
      }
    });

    return Array.from(urls);
  }

  private inferGender(name: string): string | null {
    const text = name.toLowerCase();
    if (text.includes("우먼") || text.includes("women") || text.includes("여성")) return "women";
    if (text.includes("맨") || text.includes("men") || text.includes("남성")) return "men";
    return null;
  }

  private extractMetaContent($: cheerio.CheerioAPI, key: string): string | null {
    const value =
      $(`meta[property="${key}"]`).attr("content") ||
      $(`meta[name="${key}"]`).attr("content") ||
      null;

    return value?.trim() || null;
  }

  private async fetchProductDetail(productUrl: string): Promise<RawProduct | null> {
    const html = await this.fetchHtml(productUrl);
    const $ = cheerio.load(html);
    const fetchedAt = new Date().toISOString();

    const ogTitle = this.extractMetaContent($, "og:title");
    const ogImage = this.extractMetaContent($, "og:image");

    const possibleNames = [
      ogTitle,
      $("h1").first().text().trim(),
      $('[class*="product-name"]').first().text().trim(),
      $('[class*="prd-name"]').first().text().trim(),
      $("title").text().trim(),
    ].filter(Boolean) as string[];

    const modelNameRaw = possibleNames[0] || "";
    if (!modelNameRaw) return null;

    const cleanedUrl = productUrl.split("?")[0];
    const externalId = cleanedUrl.split("/").pop() || cleanedUrl;

    return {
      source: this.name,
      externalId,
      brandRaw: "ASICS",
      modelNameRaw,
      categoryRaw: "sports_running",
      genderRaw: this.inferGender(modelNameRaw),
      imageUrl: ogImage,
      productUrl: cleanedUrl,
      fetchedAt,
    };
  }

  async fetchProducts(): Promise<RawProduct[]> {
    const categoryHtml = await this.fetchHtml(this.categoryUrl);
    const productLinks = this.extractProductLinksFromHtml(categoryHtml);

    console.log(`Found ${productLinks.length} candidate product links`);

    const products: RawProduct[] = [];

    for (const productUrl of productLinks.slice(0, 30)) {
      try {
        const product = await this.fetchProductDetail(productUrl);
        if (product) products.push(product);
      } catch (error) {
        console.warn(`Failed to parse product: ${productUrl}`, error);
      }
    }

    return products;
  }

  async fetchReviews(_products: RawProduct[]): Promise<RawReview[]> {
    return [];
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
  const agent = new ImportAgent([new AsicsCatalogAdapter()], persistence);
  const result = await agent.run();
  console.log("ImportAgent finished:", result);
}

void main();
