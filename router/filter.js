const CountLoca = require("../models/countLoca");
var _ = require("lodash");

function recommendLocation(req, res, rest) {
  CountLoca.find(rest, (err, loca) => {
    if (err) return res.json(err);
    console.log("loca", loca);
    // make count
    const countLoca = _.countBy(loca, obj => {
      return obj.location;
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
      jsonRes.push({ location: key, locationCount: objSorted[key] });
    }

    console.log("jsonRes", jsonRes);
    return res.json(jsonRes);
  });
}

module.exports = recommendLocation;
