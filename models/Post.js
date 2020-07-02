const mongoose = require("mongoose");
const path = require("path");
const imagePath = "uploads/image";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

postSchema.virtual("imageSrc").get(function () {
  if (this.image != null) {
    return path.join("/", imagePath, this.image);
  }
});

module.exports = mongoose.model("Post", postSchema);
module.exports.imagePath = imagePath;
