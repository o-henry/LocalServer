const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../config/.env")
});
const except = require("../module/filter_data");

function saveEachDB(uri, schema, location) {
  let locaCounts;
  mongoose
    .connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => {
      schema
        .find()
        .sort({ _id: -1 })
        .limit(10)
        .then(res => {
          let isLocation = false;
          for (let obj of res) {
            if (obj.location === location) {
              isLocation = true;
            }
          }
          if (isLocation === false && !except.includes(location)) {
            locaCounts = new schema({
              location: location
            });

            locaCounts.save(err => {});
          }
        });
    })
    .catch(e => console.error("error", e));
}

module.exports = saveEachDB;
