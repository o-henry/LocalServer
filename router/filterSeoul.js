const { CountLocaSeoul } = require("../models/countLocaSeoul");
var _ = require("lodash");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

// mongoose
//   .connect(process.env.MONGO_URI_SEOUL, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
//   })
//   .then(() => {
//     console.log("Connected MongoDB Seoul");
//   });

async function recommendLocationSeoul(req, res, rest) {
  const locations = await CountLocaSeoul.find(rest);
  const countLocaSeoul = _.countBy(locations, obj => {
    return obj.location;
  });

  // sorting
  var sortRes = [];
  for (let data in countLocaSeoul) {
    sortRes.push([data, countLocaSeoul[data]]);
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
    jsonRes.push({ location: key, locationCount: objSorted[key] });
  }

  return jsonRes;
  // await CountLoca.find(rest, (err, loca) => {
  //   if (err) return res.json(err);
  //   // make count
  //   const countLoca = _.countBy(loca, obj => {
  //     return obj.location;
  //   });

  //   // sorting
  //   var sortRes = [];
  //   for (let data in countLoca) {
  //     sortRes.push([data, countLoca[data]]);
  //   }

  //   sortRes.sort(function(a, b) {
  //     return b[1] - a[1];
  //   });

  //   var objSorted = {};
  //   sortRes.forEach(function(item) {
  //     objSorted[item[0]] = item[1];
  //   });

  //   // obj to JSON
  //   const jsonRes = [];
  //   for (let key in objSorted) {
  //     jsonRes.push({ location: key, locationCount: objSorted[key] });
  //   }

  //   // return res.json(jsonRes);
  //   return jsonRes;
  // });
}

module.exports = recommendLocationSeoul;
