import { chromium } from "playwright";

type CardProbe = {
  rootClassName: string | null;
  href: string | null;
  code: string | null;
  title: string | null;
  rootTagName?: string | null;
  anchorCandidates?: string[];
  rootHtmlSnippet?: string | null;
  goodsInfo?: Record<string, unknown> | null;
  onclickCandidates?: string[];
  image: {
    src: string | null;
    currentSrc: string | null;
    dataSrc: string | null;
    dataOriginal: string | null;
    dataLazy: string | null;
    srcset: string | null;
    pictureSource: string | null;
    backgroundImage: string | null;
    className: string | null;
  } | null;
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const categoryUrl = "https://www.asics.co.kr/c/sports_running";

  await page.goto(categoryUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(8000);

  const categorySummary = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/goods/catalog?code="]'));
    const seen = new Set<string>();
    const samples: CardProbe[] = [];

    for (const anchor of anchors) {
      const href = anchor.href;
      if (!href || seen.has(href)) continue;

      const url = new URL(href);
      const code = url.searchParams.get("code");
      if (!code) continue;
      seen.add(href);

      const root =
        anchor.closest("li") ??
        anchor.closest('[class*="goods"]') ??
        anchor.closest('[class*="item"]') ??
        anchor.parentElement;

      if (!root) continue;

      const img =
        root.querySelector<HTMLImageElement>("img.goodsDisplayImage") ??
        root.querySelector<HTMLImageElement>("img");
      const source = root.querySelector<HTMLSourceElement>("picture source");
      const titleNode =
        root.querySelector<HTMLElement>('[class*="goods_name"]') ??
        root.querySelector<HTMLElement>('[class*="goodsNm"]') ??
        root.querySelector<HTMLElement>('[class*="item_name"]') ??
        root.querySelector<HTMLElement>('[class*="prd-name"]') ??
        root.querySelector<HTMLElement>('[class*="product-name"]') ??
        anchor.querySelector<HTMLElement>("strong, span, p");

      const rawBackgroundImage = img
        ? window.getComputedStyle(img).backgroundImage
        : window.getComputedStyle(root).backgroundImage;

      samples.push({
        rootClassName: root.className || null,
        href,
        code,
        title: titleNode?.textContent?.replace(/\s+/g, " ").trim() || anchor.textContent?.replace(/\s+/g, " ").trim() || null,
        image: img
          ? {
              src: img.getAttribute("src"),
              currentSrc: img.currentSrc || null,
              dataSrc: img.getAttribute("data-src"),
              dataOriginal: img.getAttribute("data-original"),
              dataLazy: img.getAttribute("data-lazy"),
              srcset: img.getAttribute("srcset"),
              pictureSource: source?.getAttribute("srcset") || null,
              backgroundImage: rawBackgroundImage && rawBackgroundImage !== "none" ? rawBackgroundImage : null,
              className: img.className || null,
            }
          : null,
      });

      if (samples.length >= 12) break;
    }

    return {
      candidateAnchorCount: anchors.length,
      uniqueProductCount: seen.size,
      samples,
    };
  });

  const productCatalogUrl = categorySummary.samples
    .map((sample) => sample.href)
    .find(
      (href) =>
        href?.startsWith("https://www.asics.co.kr/goods/catalog?code=001800050001")
    ) ??
    categorySummary.samples.find((sample) =>
      sample.href?.startsWith("https://www.asics.co.kr/goods/catalog?code=")
    )?.href;

  if (
    !productCatalogUrl ||
    !productCatalogUrl.startsWith("https://www.asics.co.kr/goods/catalog?code=")
  ) {
    throw new Error("No ASICS catalog URL found from category page");
  }

  await page.goto(productCatalogUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(8000);

  const goodsSummary = await page.evaluate(() => {
    const imageNodes = Array.from(
      document.querySelectorAll<HTMLImageElement>("img.goodsDisplayImage")
    );
    const cards: CardProbe[] = [];
    const seen = new Set<string>();

    for (const img of imageNodes) {
      const rootCandidates = [
        img.closest("li"),
        img.closest('[class*="display-item"]'),
        img.closest('[class*="displayItem"]'),
        img.closest('[class*="goodsDisplayItem"]'),
        img.closest('[class*="goods-list-item"]'),
        img.closest('[class*="goods-item"]'),
        img.parentElement,
      ].filter(Boolean) as Element[];

      const root = rootCandidates[0];

      if (!root) continue;

      const anchorCandidates = Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href]"))
        .map((candidate) => candidate.getAttribute("href") || candidate.href)
        .filter(Boolean);
      const anchor =
        root.querySelector<HTMLAnchorElement>('a[href*="/goods/view"]') ??
        root.querySelector<HTMLAnchorElement>('a[href*="goodsNo="]') ??
        root.querySelector<HTMLAnchorElement>('a[href*="/goods/catalog?code="]') ??
        root.querySelector<HTMLAnchorElement>("a[href]");
      const titleNode =
        root.querySelector<HTMLElement>('[class*="item_name"]') ??
        root.querySelector<HTMLElement>('[class*="goods_name"]') ??
        root.querySelector<HTMLElement>('[class*="goodsNm"]') ??
        root.querySelector<HTMLElement>('[class*="prd-name"]') ??
        root.querySelector<HTMLElement>('[class*="product-name"]') ??
        anchor?.querySelector<HTMLElement>("strong, span, p") ??
        null;
      const source = root.querySelector<HTMLSourceElement>("picture source");
      const backgroundImage = window.getComputedStyle(img).backgroundImage;
      const goodsInfoAttr =
        root.querySelector<HTMLElement>("[goodsinfo]")?.getAttribute("goodsinfo") ?? null;
      const goodsInfo = goodsInfoAttr && goodsInfoAttr.length <= 50000
        ? (() => {
            try {
              return JSON.parse(window.atob(goodsInfoAttr)) as Record<string, unknown>;
            } catch {
              return null;
            }
          })()
        : null;
      const onclickCandidates = Array.from(root.querySelectorAll<HTMLElement>("[onclick]"))
        .map((node) => node.getAttribute("onclick"))
        .filter(Boolean) as string[];
      const goodsNoFromOnclick =
        onclickCandidates
          .map((candidate) => candidate.match(/display_goods_view\('(\d+)'/i)?.[1] || null)
          .find(Boolean) || null;
      const goodsNoFromInfo =
        typeof goodsInfo?.goods_seq === "string" ? goodsInfo.goods_seq : null;
      const goodsNo = goodsNoFromInfo || goodsNoFromOnclick;
      const rawHref = anchor?.getAttribute("href") || anchor?.href || null;
      const href =
        rawHref &&
        rawHref !== "javascript:void(0);" &&
        rawHref !== "javascript:void(0)"
          ? new URL(rawHref, location.origin).toString()
          : goodsNo
            ? new URL(`/goods/view?no=${goodsNo}`, location.origin).toString()
            : null;

      if (!href || seen.has(href)) continue;

      const code = goodsNo;

      seen.add(href);
      cards.push({
        rootClassName: root.className || null,
        rootTagName: root.tagName,
        href,
        code,
        title: titleNode?.textContent?.replace(/\s+/g, " ").trim() || null,
        anchorCandidates: anchorCandidates.slice(0, 8),
        rootHtmlSnippet: root.outerHTML.replace(/\s+/g, " ").slice(0, 800),
        goodsInfo,
        onclickCandidates: onclickCandidates.slice(0, 8),
        image: {
          src: img.getAttribute("src"),
          currentSrc: img.currentSrc || null,
          dataSrc: img.getAttribute("data-src"),
          dataOriginal: img.getAttribute("data-original"),
          dataLazy: img.getAttribute("data-lazy"),
          srcset: img.getAttribute("srcset"),
          pictureSource: source?.getAttribute("srcset") || null,
          backgroundImage: backgroundImage && backgroundImage !== "none" ? backgroundImage : null,
          className: img.className || null,
        },
      });

      if (cards.length >= 12) break;
    }

    return {
      imageNodeCount: imageNodes.length,
      uniqueCardCount: cards.length,
      cards,
    };
  });

  const functionSummary = await page.evaluate(() => {
    const fn = (window as Window & { display_goods_view?: (...args: unknown[]) => unknown })
      .display_goods_view;
    return {
      hasDisplayGoodsView: typeof fn === "function",
      functionSource:
        typeof fn === "function" ? Function.prototype.toString.call(fn).slice(0, 1200) : null,
    };
  });

  console.log(
    JSON.stringify(
      {
        categorySummary,
        productCatalogUrl,
        goodsSummary,
        functionSummary,
      },
      null,
      2
    )
  );

  await browser.close();
}

void main();
