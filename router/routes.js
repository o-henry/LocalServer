const express = require("express");
const router = express.Router();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

var _ = require("lodash");

const Hashtag = require("../models/hashtag");
const CountTags = require("../models/countTags");
const recommendLocation = require("./filter");

router.get("/", (req, res) => {
  res.send("Well done");
  res.end();
});

mongoose
  .connect(process.env.MONGO_URI_BUSAN, {
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
      recommendLocation(req, res, {});
    });
  })
  .then(() => {
    router.get("/today", cors(), (req, res) => {
      recommendLocation(req, res, {
        date: { $gte: new Date(new Date().getTime() - 3 * 24 * 60 * 60000) }
      });
    });
  })
  .then(() => {
    router.get("/week", cors(), (req, res) => {
      recommendLocation(req, res, {
        date: { $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60000) }
      });
    });
  })
  .then(() => {
    router.get("/month", cors(), (req, res) => {
      recommendLocation(req, res, {
        date: { $gte: new Date(new Date().getTime() - 31 * 24 * 60 * 60000) }
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
