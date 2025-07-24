
const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String,
  income: Number,
  dependents: Number,
  cover: Number,
  premium: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FormSubmission", formSchema);
