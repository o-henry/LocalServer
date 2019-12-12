const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });

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

app.listen(port, () => console.log(`Server listening on post ${port}`));
