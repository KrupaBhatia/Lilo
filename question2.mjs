import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const keyword = "keyboard";

async function getPriceFromPage(url, selector, label) {
  const browser = await puppeteer.launch({ headless: "new" }); // use "new" for Chrome 117+
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const price = await page.$eval(selector, (el) => el.innerText.trim());

    console.log(`${label} Price: ${price}`);
    return price;
  } catch (error) {
    return `${label}: Price not found`;
  } finally {
    await browser.close();
  }
}

async function fetchPrices(keyword) {
  console.log("Fetching prices for:", keyword);

  // Newegg
  const neweggUrl = `https://www.newegg.com/p/pl?d=${encodeURIComponent(
    keyword
  )}`;
  const neweggSelector = "li.price-current";

  // Amazon
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
  const amazonSelector = "span.a-price > span.a-offscreen";

  // Meesho
  const meeshoUrl = `https://www.meesho.com/search?q=${encodeURIComponent(
    keyword
  )}`;
  const meeshoSelector = ".sc-eDvSVe.dwCrSh";

  const [newegg, amazon, meesho] = await Promise.all([
    getPriceFromPage(neweggUrl, neweggSelector, "Newegg"),
    getPriceFromPage(amazonUrl, amazonSelector, "Amazon"),
    getPriceFromPage(meeshoUrl, meeshoSelector, "Meesho"),
  ]);

  console.log("\nFinal Price Comparison:");
  console.log(`Newegg:  ${newegg}`);
  console.log(`Amazon:  ${amazon}`);
  console.log(`Meesho:  ${meesho}`);
}

fetchPrices(keyword);
