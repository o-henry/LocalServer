const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../config/.env")
});

const saveEachDB = require("./moduleTodb");
const { CountLoca } = require("../../models/countLoca");
const { CountLocaSeoul } = require("../../models/countLocaSeoul");

const crawlTodb = function(uri, location) {
  if (uri === process.env.MONGO_URI_JEJU) {
    saveEachDB(uri, CountLoca, location);
  } else if (uri === process.env.MONGO_URI_SEOUL) {
    saveEachDB(uri, CountLocaSeoul, location);
  }
};

module.exports = crawlTodb;
