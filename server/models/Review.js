const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: { type: String },
  post: { type: String },
  likes: { type: Array },
  date_posted: { type: Date },
});

module.exports = mongoose.model("Review", ReviewSchema);
