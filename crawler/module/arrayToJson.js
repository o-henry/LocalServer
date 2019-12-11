const tagsToJson = function(arr, obj) {
  let tags2Json = [];
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
    tags2Json.push(obj);
  }
  return tags2Json;
};

module.exports = tagsToJson;
