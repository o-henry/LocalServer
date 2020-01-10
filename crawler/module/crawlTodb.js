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

      // CountLoca.find()
      //   .sort({ _id: -1 })
      //   .limit(10)
      //   .then(res => {
      //     console.log("res", res);
      //     for (let obj of res) {
      //       if (obj.location !== location) {
      //         locaCounts = new CountLoca({
      //           location: location
      //         });

      //         locaCounts.save(err => {
      //           // if (err) return console.error(err);
      //           console.log("loca", locaCounts.location);
      //         });
      //       }
      //     }
      //   });

      CountLoca.find()
        .sort({ _id: -1 })
        .limit(10)
        .then(res => {
          console.log("res", res);
          let isLocation = false;
          for (let obj of res) {
            if (obj.location === location) {
              isLocation = true;
            }
          }
          if (isLocation === false) {
            locaCounts = new CountLoca({
              location: location
            });

            locaCounts.save(err => {
              // if (err) return console.error(err);
              console.log("loca", locaCounts.location);
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
