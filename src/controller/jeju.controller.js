import { Jeju } from "../database/models";
import express from "express";
import cors from "cors";
import path from "path";
const recommendLocation = require("../crawler/filter.data");

require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

const jejuController = express.Router();

/**
 * GET/
 * retrieve and display all location tags in the Jeju Model
 */

jejuController.get("/", cors(), async (req, res, next) => {
  const recommend = await recommendLocation(req, res, {});
  res.status(200).send(recommend);
});

jejuController.get("/today", cors(), (req, res) => {
  recommendLocation(req, res, {
    date: { $gte: new Date(new Date().getTime() - 1 * 24 * 60 * 60000) },
  });
});

jejuController.get("/week", cors(), (req, res) => {
  recommendLocation(req, res, {
    date: { $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60000) },
  });
});

jejuController.get("/month", cors(), (req, res) => {
  recommendLocation(req, res, {
    date: { $gte: new Date(new Date().getTime() - 31 * 24 * 60 * 60000) },
  });
});

export default jejuController;
