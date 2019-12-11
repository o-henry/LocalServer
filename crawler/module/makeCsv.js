const { Parser } = require("json2csv");
const fs = require("fs");

const makeCsv = function(field, json, name) {
  const json2csvParser = new Parser({ field });
  const csv = json2csvParser.parse(json);
  // fs.appendFileSync(`./csv_container/${name}.csv`, csv);
  fs.writeFileSync(`./csv_container/${name}.csv`, csv);
};

module.exports = makeCsv;
