const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });
const Jeju = require("../database/models/jeju.model");
const _ = require("lodash");

async function recommendLocation(req, res, rest) {
  const locations = await Jeju.find(rest).exec();
  const countLoca = _.countBy(locations, (obj) => {
    return obj.location;
  });

  // sorting
  var sortRes = [];
  for (let data in countLoca) {
    sortRes.push([data, countLoca[data]]);
  }

  sortRes.sort(function (a, b) {
    return b[1] - a[1];
  });

  var objSorted = {};
  sortRes.forEach(function (item) {
    objSorted[item[0]] = item[1];
  });

  // obj to JSON
  const jsonRes = [];
  for (let key in objSorted) {
    jsonRes.push({ location: key, locationCount: objSorted[key] });
  }

  return jsonRes;
}

module.exports = recommendLocation;
