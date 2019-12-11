import mongoose from "mongoose";

// myProject Schema
const hashTagSchema = new mongoose.Schema({
  // id: { type: Number, required: true, unique: true } 이런식으로 구성
  date: String,
  location: String,
  tag: String,
  location_count: Number,
  tagsCount: Number
});

module.exports = mongoose.model("Hashtag", hashTagSchema);
