const express = require("express");
const router = express.Router();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

var _ = require("lodash");

const Hashtag = require("../models/hashtag");
const CountLoca = require("../models/countLoca");
const CountTags = require("../models/countTags");

router.get("/", (req, res) => {
  res.send("Well done");
  res.end();
});

mongoose
  .connect(process.env.MONGO_URI_SEOUL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected MongoDB Seoul");
  })
  .then(() => {
    router.get("/tags", cors(), (req, res) => {
      Hashtag.find({}, (err, tags) => {
        if (err) return res.json(err);
        return res.json(tags);
      });
    });
  })
  .then(() => {
    router.get("/location", cors(), (req, res) => {
      CountLoca.find({}, (err, loca) => {
        if (err) return res.json(err);

        // make count
        const countLoca = _.countBy(loca, obj => {
          if (obj.location !== "") {
            return obj.location;
          }
        });

        // sorting
        var sortRes = [];
        for (let data in countLoca) {
          sortRes.push([data, countLoca[data]]);
        }
        sortRes.sort(function(a, b) {
          return b[1] - a[1];
        });
        var objSorted = {};
        sortRes.forEach(function(item) {
          objSorted[item[0]] = item[1];
        });

        // obj to JSON
        const jsonRes = [];
        for (let key in objSorted) {
          if (key !== "undefined") {
            jsonRes.push({ location: key, locationCount: objSorted[key] });
          }
        }
        console.log("jsonRes", jsonRes);
        return res.json(jsonRes);
      });
    });
  })
  .then(() => {
    router.get("/tagscount", cors(), (req, res) => {
      CountTags.find({}, (err, tags) => {
        if (err) return res.json(err);
        return res.json(tags);
      });
    });
  });

module.exports = router;
