const collections = require("pycollections");

function countArr(arr) {
  const counter = new collections.Counter(arr);
  const count = counter.mostCommon();
  return count;
}

module.exports = countArr;
