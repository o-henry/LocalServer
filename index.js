const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });
import router from "./router/routes";
import express from "express";

// setting express middleware
let app = express();
const port = process.env.PORT || 4500;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/data/", router);

app.listen(port, () => console.log(`Server listening on post ${port}`));
