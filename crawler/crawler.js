const puppeteer = require("puppeteer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

const crawlTodb = require("./module/crawlTodb");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  let count = 0;
  let beforeClick = 0;
  let tags;
  let location;
  let date;

  let jeju =
    "https://www.instagram.com/explore/tags/%EC%A0%9C%EC%A3%BC%EB%8F%84/";
  let seoul = "https://www.instagram.com/explore/tags/seoul/";

  try {
    await page.goto("https://www.instagram.com/accounts/login/"); // Instagram 로그인 화면 이동
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', process.env.INSTA_ID);
    await page.type('input[name="password"]', process.env.INSTA_PASSWORD);
    await page.click('button[type="submit"]');

    // click 초기 설정 페이지
    await page.waitForSelector(".aOOlW.HoLwm");
    await page.click(".aOOlW.HoLwm");

    // Go to 'Jejudo' page (제주도를 직접 입력 / 하드코딩)
    // await page.goto(jeju);
    await page.goto(seoul);

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
    while (count < 100) {
      //Code for crawling Loaction
      try {
        await page.waitForSelector(".M30cS", { timeout: 5000 });
        location = await page.evaluate(() => {
          const div = document.querySelector(".M30cS").textContent;
          return div;
        });
      } catch (error) {
        console.log(error);

        // DB 에 데이터 추가 하기
        crawlTodb(date, location, tags, process.env.MONGO_URI_SEOUL);

        browser.close();

        await page.click(".HBoOv.coreSpriteRightPaginationArrow");
      }

      //Code for crawling Date
      await page.waitForSelector("._1o9PC.Nzb55");
      date = await page.evaluate(() => {
        const div = document.querySelector("._1o9PC.Nzb55").dateTime;
        return div;
      });

      // Wait until the tag appears under the article tag, div tag a tag.
      // await page.waitForSelector("article div a");
      // Code for crawling hashtag after click
      try {
        await page.waitForSelector("article div span a", { timeout: 4000 });
        tags = await page.evaluate(() => {
          const div = Array.from(
            document.querySelectorAll("article div span a")
          );
          //해시태그에서 '#'을 포함한 요소중에서 '#'을 제거해서 반환합니다. ( @, '로그인' 같이 태그가 아닌 데이터는 버립니다. )
          return div
            .map(function(a) {
              if (a.textContent.includes("#")) {
                return a.textContent
                  .split("#")
                  .splice(1, 1)
                  .join(",");
              }
            })
            .join(",");
        });
      } catch (error) {
        console.log(error);
        await page.click(".HBoOv.coreSpriteRightPaginationArrow");
      }

      //Click the > button when the page is crawling.
      await page.click(".HBoOv.coreSpriteRightPaginationArrow");

      //Store the location,tags,date in a one-dimensional array.
      //null 처리
      if (tags !== undefined) {
        for (let i = tags.length; i > -1; i--) {
          if (tags[i] === null) {
            tags.splice(i, 1);
          }
        }
      }

      // DB 에 데이터 추가 하기
      crawlTodb(date, location, tags, process.env.MONGO_URI_SEOUL);

      count++;
    }
  } catch (err) {
    console.log(err);
  }
  browser.close();
})();
