//make data to JSON type
function dataToCount(arr, obj) {
  let count_arr = [];
  let keys = Object.keys(obj);
  let keyName = keys[0];
  let keyValue = keys[1];

  for (let i = 0; i < arr.length; i++) {
    obj = {};
    obj[keyName] = arr[i][0];
    obj[keyValue] = arr[i][1];
    count_arr.push(obj);
  }
  return count_arr;
}

module.exports = dataToCount;
