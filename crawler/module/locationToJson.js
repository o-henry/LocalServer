const locationToJson = function(arr, obj) {
  let locArr = [];
  for (let i = 0; i < arr.length; i++) {
    obj = { location: "", date: "", tags: "" };
    for (let key in obj) {
      if (key === "location") {
        obj[key] = arr[i][0];
      } else if (key === "date") {
        obj[key] = arr[i][1];
      } else if (key === "tags") {
        obj[key] = arr[i][2];
      }
    }
    if (obj["location"] !== "") {
      locArr.push(obj["location"]);
    }
  }
  return locArr;
};

module.exports = locationToJson;
