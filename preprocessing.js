// It dosen't work

const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });

const collections = require("pycollections");
const CountLoca = require("./models/countLoca");

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var locationArr;
var counter;

CountLoca.find({}, (err, data) => {
  if (err) return err;
  locationArr = data;
  getLocation();
});

function getLocation() {
  locationArr = locationArr
    .map(x => x.location)
    .filter(ele => ele !== "")
    .filter(x => x !== undefined);
  counter = new collections.Counter(locationArr).mostCommon();
  return counter;
}

// function locaArr(req, res) {
//   CountLoca.find({}).exec((err, result) => {
//     if (err) console.error(err);
//     var query = CountLoca.find({});
//     query.exec((err, res) => {
//       if (err) res.end("Error" + err);
//       result
//         .map(x => x.location)
//         .filter(ele => ele !== "")
//         .filter(x => x !== undefined);
//       return result;
//     });
//   });
// }
// locaArr();

// let localArray = CountLoca.find({}, (err, data) => {
//   data
//     .map(x => x.location)
//     .filter(ele => ele !== "")
//     .filter(x => x !== undefined);
// });

// CountLoca.find({}, (err, data) => {
//   let localArray = data
//     .map(x => x.location)
//     .filter(ele => ele !== "")
//     .filter(x => x !== undefined);
//   console.log(localArray);
// });

// let local = CountLoca.findOne({ id: id }).then(data => console.log(data));

module.exports = getLocation;
