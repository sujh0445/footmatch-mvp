import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const catalogUrl =
    "https://www.asics.co.kr/goods/catalog?code=001800050001";

  await page.goto(catalogUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(8000);

  const imgs = await page.$$eval("img", (elements) =>
    elements.slice(0, 50).map((img) => {
      const el = img as HTMLImageElement;
      return {
        src: el.src || null,
        currentSrc: el.currentSrc || null,
        alt: el.alt || null,
        dataSrc: el.getAttribute("data-src"),
        dataLazy: el.getAttribute("data-lazy"),
        srcset: el.getAttribute("srcset"),
        className: el.className || null,
      };
    })
  );

  console.log(JSON.stringify(imgs, null, 2));

  await browser.close();
}

void main();
