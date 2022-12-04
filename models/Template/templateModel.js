const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateDataSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  data_source: {
    type: String,
    default: null
  },
});

module.exports = mongoose.model("templateData", templateDataSchema, "templateData");
