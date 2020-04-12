const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });
import express from "express";
import mongoose from "mongoose";
import { jejuController } from "./controller";

const app = express();

// use all controller(APIs) here (Routing)
const port = process.env.PORT || 4500;

app.use("/", jejuController);

app.listen(port, () => {
  console.log(`Server listening on post ${port}`);
  if (process.env.MONGO_URI_JEJU) {
    mongoose
      .connect(process.env.MONGO_URI_JEJU, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        console.log("Connect to Jeju DB");
      })
      .catch((err) => {
        console.log(`DB connect Error : ${err.message}`);
      });
  }
});
