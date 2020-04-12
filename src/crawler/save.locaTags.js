const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../config/.env"),
});

let locaCounts;
let isLocation = false;

const saveLocaDB = (uri, schema, location) => {
  mongoose
    .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
      schema
        .find()
        .sort({ _id: -1 })
        .limit(10)
        .then((res) => {
          res.forEach((element) => {
            element.location == location ? (isLocation = true) : "";
          });
          if (isLocation == false) {
            locaCounts = new schema({
              location: location,
            });
            locaCounts.save((err) => {});
          }
        });
    })
    .catch((e) => console.error("error", e));
};

module.exports = saveLocaDB;
