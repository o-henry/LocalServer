const Schema = require("mongoose").Schema;

const jejuSchema = new Schema({
  location: { type: String, required: true, minlength: 1 },
  date: { type: Date, default: Date.now },
});

module.exports = jejuSchema;
