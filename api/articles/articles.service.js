const Article = require("./articles.schema");

async function createArticle(payload) {
  return Article.create(payload);
}

async function updateArticle(id, updates) {
  return Article.findByIdAndUpdate(id, { $set: updates }, { new: true });
}

async function deleteArticle(id) {
  return Article.findByIdAndDelete(id);
}

async function getArticlesByUserId(userId) {
  return Article.find({ author: userId })
    .populate("author", "-password")
    .lean();
}

module.exports = { createArticle, updateArticle, deleteArticle, getArticlesByUserId };
