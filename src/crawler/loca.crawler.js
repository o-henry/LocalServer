const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });
const puppeteer = require("puppeteer");
const saveLocaDB = require("./save.locaTags");
const jejuSchema = require("../database/schemas/jeju.schemas");
const Jeju = require("../database/models/jeju.model");

let jeju = "https://www.instagram.com/explore/tags/jeju/";
let seoul = "https://www.instagram.com/explore/tags/seoul/";
let count, beforeClick, location;

// async function init() {
//   const browser = await puppeteer.launch({ headless: false, devtools: true });
//   await Promise.all([
//     open_tab(
//       `${seoul}`,
//       process.env.MONGO_URI_SEOUL,
//       browser,
//       process.env.INSTA_ID,
//       process.env.INSTA_PASSWORD
//     ),
//     open_tab(
//       `${jeju}`,
//       process.env.MONGO_URI_JEJU,
//       browser,
//       process.env.INSTA_ID2,
//       process.env.INSTA_PASSWORD2
//     ),
//   ]).then((res) => console.log("res", res));
// }

const tab = async (url, db, id, pwd) => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  beforeClick = 0;
  count = 0;
  try {
    try {
      // Instagram 로그인 화면 이동
      await page.goto("https://www.instagram.com/accounts/login/");
      await page.waitForSelector('input[name="username"]');
      await page.type('input[name="username"]', id);
      await page.type('input[name="password"]', pwd);
      await page.click('button[type="submit"]');
    } catch (error) {
      console.log("login 차단", error);
      browser.close();
    }
    await page.waitForSelector(".aOOlW.HoLwm");
    await page.click(".aOOlW.HoLwm");
    await page.goto(url); // redirect location
    await page.waitForSelector("article div a");

    // Click 'a' tag
    await Promise.all([
      page.$eval("article div a", (el) => el.click()),
      page.waitForNavigation(),
    ]).catch((e) => console.log(e));

    // 최신 인스타그램 데이터만 뽑기 위해서 인기 게시물에 해당하는 페이지를 클릭으로 넘어갑나다.
    while (beforeClick < 9) {
      await page.click("._65Bje.coreSpriteRightPaginationArrow");
      beforeClick++;
    }

    // 해시태그를 뽑아냅니다.
    while (count < 10) {
      //Code for crawling Loaction
      try {
        await page.waitForSelector(".M30cS", { timeout: 1000 });
        location = await page.evaluate(() => {
          const div = document.querySelector(".M30cS").textContent;
          return div;
        });
        console.log("location", location);
      } catch (error) {
        console.log("로케이션 태그 를 찾지못한 에러", error);

        // DB 에 데이터 추가 하기
        if (location !== "") {
          saveLocaDB(db, Jeju, location);
        }
        // browser.close();
        await page.click("._65Bje.coreSpriteRightPaginationArrow");
      }
      //Click the > button when the page is crawling.
      await page.click("._65Bje.coreSpriteRightPaginationArrow");

      saveLocaDB(db, Jeju, location);

      count++;
    }

    // catch (err) {
    //   // Go to 'Jejudo' page (제주도를 직접 입력 / 하드코딩)
    //   await page.goto(url);

    //   await page.waitForSelector("article div a");

    //   // Click 'a' tag
    //   await Promise.all([
    //     page.$eval("article div a", (el) => el.click()),
    //     page.waitForNavigation(),
    //   ]).catch((e) => console.log(e));

    //   // 최신 인스타그램 데이터만 뽑기 위해서 인기 게시물에 해당하는 페이지를 클릭으로 넘어갑나다.
    //   while (beforeClick < 9) {
    //     await page.click("._65Bje.coreSpriteRightPaginationArrow");
    //     beforeClick++;
    //   }

    //   // 해시태그를 뽑아냅니다.
    //   while (count < 10) {
    //     //Code for crawling Loaction
    //     try {
    //       await page.waitForSelector(".M30cS", { timeout: 5000 });
    //       location = await page.evaluate(() => {
    //         const div = document.querySelector(".M30cS").textContent;
    //         return div;
    //       });
    //     } catch (error) {
    //       console.log("에러 - 시간초과", error);

    //       // DB 에 데이터 추가 하기
    //       if (location !== "") {
    //         saveLocaDB(db, Jeju, location);
    //       }
    //       // browser.close();
    //       await page.click("._65Bje.coreSpriteRightPaginationArrow");
    //     }
    //     //Click the > button when the page is crawling.
    //     await page.click("._65Bje.coreSpriteRightPaginationArrow");

    //     saveLocaDB(db, Jeju, location);
    //     count++;
    //   }
    // }
  } catch (err) {
    console.log("인스타그램에서 크롤링을 차단했습니다.", err);
    setTimeout(() => console.log("Wait for a few minutes"), 30000);
  }
  await page.waitFor(25000);
  browser.close();
};

tab(
  jeju,
  process.env.MONGO_URI_JEJU,
  process.env.INSTA_ID,
  process.env.INSTA_PASSWORD
);
