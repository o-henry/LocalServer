const puppeteer = require("puppeteer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

const crawlTodb = require("./saveDB/crawlTodb");

let jeju =
  "https://www.instagram.com/explore/tags/%EC%A0%9C%EC%A3%BC%EB%8F%84/";
let seoul = "https://www.instagram.com/explore/tags/seoul/";
// let busan = "https://www.instagram.com/explore/tags/busan/?hl=ko";
// let gangwon =
//   "https://www.instagram.com/explore/tags/%EA%B0%95%EC%9B%90%EB%8F%84/?hl=ko";

async function init() {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  open_tab(
    `${seoul}`,
    process.env.MONGO_URI_SEOUL,
    browser,
    process.env.INSTA_ID,
    process.env.INSTA_PASSWORD
  );
  open_tab(
    `${jeju}`,
    process.env.MONGO_URI_JEJU,
    browser,
    process.env.INSTA_ID2,
    process.env.INSTA_PASSWORD2
  );
}

async function open_tab(url, db, browser, id, pwd) {
  let count = 0;
  let beforeClick = 0;
  let location;
  let page = await browser.newPage();

  try {
    await page.goto("https://www.instagram.com/accounts/login/"); // Instagram 로그인 화면 이동
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', id);
    await page.type('input[name="password"]', pwd);
    await page.click('button[type="submit"]');

    // click 초기 설정 페이지
    try {
      // await page.waitForSelector(".piCib", { timeout: 2000 });
      await page.waitForSelector(".aOOlW.HoLwm");
      await page.click(".aOOlW.HoLwm");
      await page.goto(url); // 서울, 제주
      await page.waitForSelector("article div a");

      // Click 'a' tag
      await Promise.all([
        page.$eval("article div a", el => el.click()),
        page.waitForNavigation()
      ]).catch(e => console.log(e));

      // 최신 인스타그램 데이터만 뽑기 위해서 인기 게시물에 해당하는 페이지를 클릭으로 넘어갑나다.
      while (beforeClick < 9) {
        await page.click(".HBoOv.coreSpriteRightPaginationArrow");
        beforeClick++;
      }

      // 해시태그를 뽑아냅니다.
      while (count < 10) {
        //Code for crawling Loaction
        try {
          await page.waitForSelector(".M30cS", { timeout: 5000 });
          location = await page.evaluate(() => {
            const div = document.querySelector(".M30cS").textContent;
            return div;
          });
        } catch (error) {
          console.log("로케이션 태그 를 찾지못한 에러", error);

          // DB 에 데이터 추가 하기
          if (location !== "") {
            crawlTodb(db, location);
          }
          // browser.close();
          await page.click(".HBoOv.coreSpriteRightPaginationArrow");
        }
        //Click the > button when the page is crawling.
        await page.click(".HBoOv.coreSpriteRightPaginationArrow");

        crawlTodb(db, location);

        count++;
      }
    } catch (err) {
      // Go to 'Jejudo' page (제주도를 직접 입력 / 하드코딩)
      await page.goto(url);

      await page.waitForSelector("article div a");

      // Click 'a' tag
      await Promise.all([
        page.$eval("article div a", el => el.click()),
        page.waitForNavigation()
      ]).catch(e => console.log(e));

      // 최신 인스타그램 데이터만 뽑기 위해서 인기 게시물에 해당하는 페이지를 클릭으로 넘어갑나다.
      while (beforeClick < 9) {
        await page.click(".HBoOv.coreSpriteRightPaginationArrow");
        beforeClick++;
      }

      // 해시태그를 뽑아냅니다.
      while (count < 10) {
        //Code for crawling Loaction
        try {
          await page.waitForSelector(".M30cS", { timeout: 5000 });
          location = await page.evaluate(() => {
            const div = document.querySelector(".M30cS").textContent;
            return div;
          });
        } catch (error) {
          console.log("에러 - 시간초과", error);

          // DB 에 데이터 추가 하기
          if (location !== "") {
            crawlTodb(db, location);
          }
          // browser.close();
          await page.click(".HBoOv.coreSpriteRightPaginationArrow");
        }
        //Click the > button when the page is crawling.
        await page.click(".HBoOv.coreSpriteRightPaginationArrow");

        crawlTodb(db, location);

        count++;
      }
    }
  } catch (err) {
    console.log("로그인 에러 ---- 기다리시오", err);
    setTimeout(() => console.log("Wait for a few minutes"), 3000000);
  }
  await page.waitFor(25000);
  browser.close();
}

setInterval(init, 90000);
