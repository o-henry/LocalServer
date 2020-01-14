const express = require("express");
const router = express.Router();
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });
var _ = require("lodash");

const Hashtag = require("../models/hashtag");
const CountTags = require("../models/countTags");
const recommendLocationJeju = require("./filterjeju");

router.get("/", (req, res) => {
  res.send("connect to jeju");
  res.end();
});

router.get("/tags", cors(), (req, res) => {
  Hashtag.find({}, (err, tags) => {
    if (err) return res.json(err);
    return res.json(tags);
  });
});

router.get("/location", cors(), async (req, res) => {
  let reco = await recommendLocationJeju(req, res, {});
  res.json(reco);
});

router.get("/today", cors(), (req, res) => {
  recommendLocationJeju(req, res, {
    date: { $gte: new Date(new Date().getTime() - 1 * 24 * 60 * 60000) }
  });
});

router.get("/week", cors(), (req, res) => {
  recommendLocationJeju(req, res, {
    date: { $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60000) }
  });
});

router.get("/month", cors(), (req, res) => {
  recommendLocationJeju(req, res, {
    date: { $gte: new Date(new Date().getTime() - 31 * 24 * 60 * 60000) }
  });
});

router.get("/tagscount", cors(), (req, res) => {
  CountTags.find({}, (err, tags) => {
    if (err) return res.json(err);
    return res.json(tags);
  });
});

module.exports = router;
