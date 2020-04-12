const mongoose = require("mongoose");
const jejuSchema = require("../schemas/jeju.schemas");

const Jeju = mongoose.model("Jeju", jejuSchema);

module.exports = Jeju;
