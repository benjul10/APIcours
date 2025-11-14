const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
    content: { type: String, required: true, minlength: 1 },
    status:  { type: String, enum: ["draft", "published"], default: "draft", required: true },
    author:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Article", ArticleSchema);
