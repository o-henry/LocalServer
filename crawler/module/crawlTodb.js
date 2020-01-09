const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../config/.env")
});

const Hashtag = require("../../models/hashtag");
const CountLoca = require("../../models/countLoca");
const CountTags = require("../../models/countTags");

// function insta(data,location,tags){
//   return new Hashtag({date:data,location:location,tag:tags})
// }

const crawlTodb = function(uri, location) {
  let instData;
  let locaCounts;
  let tagsCounts;

  mongoose
    .connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => {
      // console.log("Successfully connected to mongodb");
      // instData = new Hashtag({
      //   location: location,
      //   tag: tags
      // });

      // location =
      // [{
      //   _id: 5e100f0e0ff9025a08fa4d09,
      //   location: 'lee.nosa',
      //   date: 2020-01-04T04:05:34.659Z,
      //   __v: 0
      // }]

      // 저장되어 있는 가장 최근에 크롤링한 데이터
      // CountLoca.find()
      // .sort({ _id: -1 })
      // .limit(1)
      // .then(res => console.log("teee", res));

      // 10개의 최신 크롤링 데이터

      CountLoca.find()
        .sort({ _id: -1 })
        .limit(1)
        .exec(function(err, res) {
          console.log("기존DB", res[0].location);
          console.log("location", location);
          if (location !== res[0].location) {
            locaCounts = new CountLoca({
              location: location
            });
            locaCounts.save(err => {
              // if (err) return console.error(err);
              // console.log("loca", locaCounts.location);
            });
          }
        });

      // locaCounts = new CountLoca({
      //   location: location
      // });

      // tagsCounts = new CountTags({
      //   tag: tags
      // });

      // instData.save(err => {
      //   if (err) return console.error(err);
      //   console.log(instData.tag);
      // });

      // locaCounts.save(err => {
      //   // if (err) return console.error(err);
      //   console.log("loca", locaCounts.location);
      // });

      // tagsCounts.save(err => {
      //   if (err) return console.error(err);
      //   console.log(tagsCounts.tag);
      // });
    })
    .catch(e => console.error(e));
};

module.exports = crawlTodb;
