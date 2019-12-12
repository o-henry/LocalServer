const express = require("express");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

const Hashtag = require("../models/hashtag");
const CountLoca = require("../models/countLoca");
const CountTags = require("../models/countTags");

router.get("/", (req, res) => {
  res.send("Well done");
  res.end();
});

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected MongoDB");
  })
  .then(() => {
    router.get("/tgs", (req, res) => {
      Hashtag.find({}, (err, tags) => {
        if (err) return res.json(err);
        return res.json(tags);
      });
    });
  })
  .then(() => {
    router.get("/location", (req, res) => {
      CountLoca.find({}, (err, loca) => {
        if (err) return res.json(err);
        return res.json(loca);
      });
    });
  })
  .then(() => {
    router.get("/tagscount", (req, res) => {
      CountTags.find({}, (err, tags) => {
        if (err) return res.json(err);
        return res.json(tags);
      });
    });
  });

module.exports = router;
