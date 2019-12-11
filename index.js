require("dotenv").config();
import express from "express";
import mongoose from "mongoose";

import Hashtag from "./models/hashtag";
// setting express middleware
let app = express();
const port = process.env.PORT || 4500;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 몽구스를 서버에 포함시킵니다.
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch(e => console.error(e));

// db 를 로컬에 연동합니다.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connection Successful!");
  // 여기서 데이터 할당
  var crawldata = new Hashtag({
    date: String,
    location: String,
    tag: String,
    location_count: Number,
    tagsCount: Number
  });
});

app.listen(port, () => console.log(`Server listening on post ${port}`));
