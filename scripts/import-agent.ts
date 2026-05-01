import { mkdir, writeFile } from "fs/promises";
import { chromium } from "playwright";

type SourceName = "brand_site" | "retailer" | "community";

type RawProduct = {
  source: SourceName;
  externalId: string;
  brandRaw: string;
  modelNameRaw: string;
  categoryRaw?: string | null;
  sourceCategoryRaw?: string | null;
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
  category:
    | "running"
    | "lifestyle"
    | "training"
    | "basketball"
    | "tennis"
    | "sportstyle"
    | "other";
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

type CategoryPageCandidate = {
  href: string;
  code: string;
  title: string | null;
};

type CardExtraction = {
  externalId: string | null;
  modelNameRaw: string | null;
  categoryRaw: string | null;
  sourceCategoryRaw: string | null;
  genderRaw: string | null;
  summaryRaw: string | null;
  imageUrl: string | null;
  productUrl: string | null;
  priceRaw: string | null;
  candidateCardCount: number;
  droppedFieldCount: number;
  duplicateCollapseCount: number;
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

const ASICS_CATEGORY_OVERRIDES: Record<string, "tennis" | "sportstyle"> = {
  "코트 컨트롤 FF 4": "tennis",
  "코트 FF 3": "tennis",
  "코트 FF 3 OC": "tennis",
  "코트 FF 3 클레이": "tennis",
  "코트 FF 3 노박": "tennis",
  "젤 레졸루션 X": "tennis",
  "젤 레졸루션 X 와이드": "tennis",
  "솔루션 스피드 FF 4": "tennis",
  "리브레 CF": "tennis",
  "GT 2160 NS": "sportstyle",
  "스카이핸드 OG": "sportstyle",
  "젤 터레인": "sportstyle",
};

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
  brandRaw: string,
  categoryRaw?: string | null,
  modelNameRaw?: string
): NormalizedProduct["category"] {
  const brand = normalizeBrand(brandRaw);
  const normalizedModelName = modelNameRaw ? normalizeModelName(modelNameRaw) : "";

  if (brand === "ASICS") {
    const override = ASICS_CATEGORY_OVERRIDES[normalizedModelName];
    if (override) {
      return override;
    }
  }

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
  if (text.includes("unisex") || text.includes("남여공용")) return "unisex";
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
    const category = normalizeCategory(raw.brandRaw, raw.categoryRaw, raw.modelNameRaw);
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
  private readonly maxCatalogPages = 12;
  private readonly maxEmbeddedJsonLength = 50_000;
  private readonly allowedImageHosts = new Set([
    "www.asics.co.kr",
    "d26wss9rw703v0.cloudfront.net",
    "akrebiz.s3.ap-northeast-2.amazonaws.com",
  ]);
  private readonly excludedCatalogTitles = ["키즈", "의류"];

  private toAbsoluteUrl(href: string): string {
    return new URL(href, this.baseUrl).toString();
  }

  private isAllowedProductUrl(productUrl: string): boolean {
    try {
      const url = new URL(productUrl);
      return url.origin === this.baseUrl && url.pathname === "/goods/view" && url.searchParams.has("no");
    } catch {
      return false;
    }
  }

  private isAllowedCatalogUrl(catalogUrl: string): boolean {
    try {
      const url = new URL(catalogUrl);
      return (
        url.origin === this.baseUrl &&
        url.pathname === "/goods/catalog" &&
        url.searchParams.has("code")
      );
    } catch {
      return false;
    }
  }

  private isAllowedImageUrl(imageUrl: string): boolean {
    try {
      const url = new URL(imageUrl);
      return (
        (url.protocol === "https:" || url.protocol === "http:") &&
        this.allowedImageHosts.has(url.hostname)
      );
    } catch {
      return false;
    }
  }

  private inferGender(text: string): string | null {
    const normalized = text.toLowerCase();
    if (
      normalized.includes("women") ||
      normalized.includes("우먼") ||
      normalized.includes("여성")
    ) {
      return "women";
    }
    if (
      normalized.includes("men") ||
      normalized.includes("맨") ||
      normalized.includes("남성")
    ) {
      return "men";
    }
    if (normalized.includes("남여공용") || normalized.includes("unisex")) {
      return "unisex";
    }
    return null;
  }

  private buildProductUrlFromGoodsNo(goodsNo: string): string {
    return this.toAbsoluteUrl(`/goods/view?no=${goodsNo}`);
  }

  private async collectCatalogPageCandidates(): Promise<CategoryPageCandidate[]> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(this.categoryUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForSelector('a[href*="/goods/catalog?code="]', { timeout: 20000 });
      await page.waitForTimeout(3000);

      const candidates = await page.evaluate(() => {
        const anchors = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('a[href*="/goods/catalog?code="]')
        );
        const unique = new Map<string, CategoryPageCandidate>();

        for (const anchor of anchors) {
          const rawHref = anchor.getAttribute("href");
          if (!rawHref) continue;

          const href = new URL(rawHref, location.origin).toString();
          const code = new URL(href).searchParams.get("code");
          if (
            !code ||
            code.length < 12 ||
            !code.startsWith("00180005") ||
            new URL(href).origin !== location.origin ||
            new URL(href).pathname !== "/goods/catalog"
          ) {
            continue;
          }

          const title =
            anchor.textContent?.replace(/\s+/g, " ").trim() ||
            anchor.getAttribute("title") ||
            null;

          if (!unique.has(href)) {
            unique.set(href, { href, code, title });
          }
        }

        return Array.from(unique.values());
      });

      return candidates
        .filter((candidate) => {
          const title = candidate.title ?? "";
          return (
            this.isAllowedCatalogUrl(candidate.href) &&
            !this.excludedCatalogTitles.some((excluded) => title.includes(excluded))
          );
        })
        .sort((left, right) => left.code.localeCompare(right.code))
        .slice(0, this.maxCatalogPages);
    } finally {
      await page.close();
      await browser.close();
    }
  }

  private async collectProductsFromCatalogPage(
    pageUrl: string,
    fetchedAt: string
  ): Promise<{
    products: RawProduct[];
    warnings: string[];
    counters: {
      candidateCardCount: number;
      retainedRawCount: number;
      droppedFieldCount: number;
      duplicateCollapseCount: number;
    };
  }> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      if (!this.isAllowedCatalogUrl(pageUrl)) {
        throw new Error(`Rejected non-ASICS catalog URL: ${pageUrl}`);
      }

      await page.goto(pageUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForSelector("li.goodsDisplayWrap img.goodsDisplayImage", {
        timeout: 20000,
      });
      await page.waitForTimeout(2500);

      const cards = await page.evaluate(() => {
        const titleSelectors = [
          '[class*="goods_name"]',
          '[class*="goodsNm"]',
          '[class*="item_name"]',
          '[class*="prd-name"]',
          '[class*="product-name"]',
          '[class*="goods-title"]',
        ];

        const cards = Array.from(document.querySelectorAll<HTMLLIElement>("li.goodsDisplayWrap"));

        return cards.map<CardExtraction>((card) => {
          const titleNode = titleSelectors
            .map((selector) => card.querySelector<HTMLElement>(selector))
            .find(Boolean);
          const goodsInfoNode = card.querySelector<HTMLElement>("[goodsinfo]");
          const encodedGoodsInfo = goodsInfoNode?.getAttribute("goodsinfo") || null;
          let goodsInfo: Record<string, unknown> | null = null;
          if (encodedGoodsInfo && encodedGoodsInfo.length <= 50000) {
            try {
              goodsInfo = JSON.parse(window.atob(encodedGoodsInfo)) as Record<string, unknown>;
            } catch {
              goodsInfo = null;
            }
          }
          const img =
            card.querySelector<HTMLImageElement>("img.goodsDisplayImage") ??
            card.querySelector<HTMLImageElement>("img");
          const pictureSource = card.querySelector<HTMLSourceElement>("picture source");
          const onclickValue =
            card.querySelector<HTMLElement>('[onclick*="display_goods_view"]')?.getAttribute(
              "onclick"
            ) || null;
          const realAnchor = Array.from(card.querySelectorAll<HTMLAnchorElement>("a[href]")).find(
            (anchor) => {
              const href = anchor.getAttribute("href") || "";
              return href && href !== "javascript:void(0);" && href !== "javascript:void(0)";
            }
          );

          const goodsInfoRecord = goodsInfo ?? {};
          const goodsNoFromClick = onclickValue?.match(/display_goods_view\('(\d+)'/)?.[1] || null;
          const goodsNoFromInfo =
            typeof goodsInfoRecord.goods_seq === "string" ? goodsInfoRecord.goods_seq : null;
          const externalId = goodsNoFromInfo || goodsNoFromClick;

          const modelNameRaw =
            (typeof goodsInfoRecord.goods_name === "string" ? goodsInfoRecord.goods_name : null) ||
            titleNode?.textContent?.replace(/\s+/g, " ").trim() ||
            null;
          const genderSummary =
            typeof goodsInfoRecord.summary === "string" ? goodsInfoRecord.summary : null;
          const sourceCategoryRaw =
            typeof goodsInfoRecord.category === "string"
              ? goodsInfoRecord.category
              : typeof goodsInfoRecord.category_code === "string"
                ? goodsInfoRecord.category_code
                : null;
          const absoluteAnchorUrl = realAnchor
            ? new URL(realAnchor.getAttribute("href") || realAnchor.href, location.origin).toString()
            : null;
          const productUrl =
            absoluteAnchorUrl ||
            (externalId ? new URL(`/goods/view?no=${externalId}`, location.origin).toString() : null);

          const priceRaw =
            typeof goodsInfoRecord.price === "string"
              ? goodsInfoRecord.price
              : typeof goodsInfoRecord.sale_price === "number"
                ? String(goodsInfoRecord.sale_price)
                : null;

          const backgroundImage = img ? window.getComputedStyle(img).backgroundImage : null;
          const cardBackgroundImage = window.getComputedStyle(card).backgroundImage;
          const imageCandidates = [
            typeof goodsInfoRecord.image === "string" ? goodsInfoRecord.image : null,
            typeof goodsInfoRecord.image1_large === "string" ? goodsInfoRecord.image1_large : null,
            img?.getAttribute("src") || null,
            img?.currentSrc || null,
            img?.getAttribute("data-src") || null,
            img?.getAttribute("data-original") || null,
            img?.getAttribute("data-lazy") || null,
            (img?.getAttribute("srcset") || null)
              ?.split(",")
              .map((entry) => entry.trim().split(/\s+/)[0])
              .find(Boolean) || null,
            (pictureSource?.getAttribute("srcset") || null)
              ?.split(",")
              .map((entry) => entry.trim().split(/\s+/)[0])
              .find(Boolean) || null,
            backgroundImage && backgroundImage !== "none"
              ? backgroundImage.match(/url\(["']?(.*?)["']?\)/i)?.[1] || null
              : null,
            cardBackgroundImage && cardBackgroundImage !== "none"
              ? cardBackgroundImage.match(/url\(["']?(.*?)["']?\)/i)?.[1] || null
              : null,
          ];

          const imageUrl =
            imageCandidates.find((candidate) => {
              if (!candidate) return false;
              const value = candidate.toLowerCase();
              return !value.includes("/icon/") && !value.includes("icon_zzim") && !value.endsWith(".gif");
            }) || null;

          return {
            externalId,
            modelNameRaw,
            categoryRaw: "sports_running",
            sourceCategoryRaw,
            genderRaw: genderSummary,
            summaryRaw: genderSummary,
            imageUrl,
            productUrl,
            priceRaw,
            candidateCardCount: 1,
            droppedFieldCount:
              externalId && modelNameRaw && imageUrl && productUrl ? 0 : 1,
            duplicateCollapseCount: 0,
          };
        });
      });

      const warnings: string[] = [];
      const retained = new Map<string, RawProduct>();
      let candidateCardCount = 0;
      let droppedFieldCount = 0;
      let duplicateCollapseCount = 0;

      for (const card of cards) {
        candidateCardCount += card.candidateCardCount;

        const missingRequired = !card.externalId || !card.modelNameRaw || !card.imageUrl || !card.productUrl;
        if (missingRequired) {
          droppedFieldCount += 1;
          continue;
        }

        const shoeSignal = `${card.summaryRaw ?? ""} ${card.modelNameRaw ?? ""}`.toLowerCase();
        if (
          !shoeSignal.includes("신발") &&
          !shoeSignal.includes("shoe") &&
          !shoeSignal.includes("슈즈") &&
          !shoeSignal.includes("러닝화") &&
          !shoeSignal.includes("트레일")
        ) {
          droppedFieldCount += 1;
          continue;
        }

        const externalId = card.externalId!;
        const modelNameRaw = card.modelNameRaw!;
        const imageUrl = this.toAbsoluteUrl(card.imageUrl!);
        const productUrl = this.toAbsoluteUrl(card.productUrl!);

        if (!this.isAllowedProductUrl(productUrl)) {
          droppedFieldCount += 1;
          continue;
        }

        if (!this.isAllowedImageUrl(imageUrl)) {
          droppedFieldCount += 1;
          continue;
        }

        const existing = retained.get(externalId);
        if (existing) {
          duplicateCollapseCount += 1;
          warnings.push(`Collapsed duplicate ASICS offer ${externalId} from ${pageUrl}`);
          if (!existing.imageUrl && imageUrl) {
            existing.imageUrl = imageUrl;
          }
          continue;
        }

        retained.set(externalId, {
          source: this.name,
          externalId,
          brandRaw: "ASICS",
          modelNameRaw,
          categoryRaw: card.categoryRaw || "sports_running",
          sourceCategoryRaw: card.sourceCategoryRaw,
          genderRaw: card.genderRaw ? this.inferGender(card.genderRaw) : null,
          imageUrl,
          productUrl,
          priceRaw: card.priceRaw,
          fetchedAt,
        });
      }

      return {
        products: Array.from(retained.values()),
        warnings,
        counters: {
          candidateCardCount,
          retainedRawCount: retained.size,
          droppedFieldCount,
          duplicateCollapseCount,
        },
      };
    } finally {
      await page.close();
      await browser.close();
    }
  }

  async fetchProducts(): Promise<RawProduct[]> {
    const fetchedAt = new Date().toISOString();
    const catalogPages = await this.collectCatalogPageCandidates();
    const warnings: string[] = [];
    const allProducts = new Map<string, RawProduct>();

    for (const catalogPage of catalogPages) {
      try {
        const { products, warnings: pageWarnings, counters } =
          await this.collectProductsFromCatalogPage(catalogPage.href, fetchedAt);

        console.log(
          `[ASICS] ${catalogPage.code} candidateCardCount=${counters.candidateCardCount} retainedRawCount=${counters.retainedRawCount} droppedFieldCount=${counters.droppedFieldCount} duplicateCollapseCount=${counters.duplicateCollapseCount}`
        );

        for (const warning of pageWarnings) {
          warnings.push(warning);
        }

        for (const product of products) {
          if (!allProducts.has(product.externalId)) {
            allProducts.set(product.externalId, product);
          }
        }
      } catch (error) {
        warnings.push(`Failed to collect ASICS catalog page ${catalogPage.href}: ${String(error)}`);
      }
    }

    if (warnings.length > 0) {
      console.warn("[ASICS warnings]", warnings);
    }

    return Array.from(allProducts.values());
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
