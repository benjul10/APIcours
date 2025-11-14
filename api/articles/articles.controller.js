const service = require("./articles.service");

async function create(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { title, content, status } = req.body;
    const article = await service.createArticle({
      title, content, status, author: req.user._id,
    });

    req.io?.emit("articles:created", article); // temps réel
    res.status(201).json(article);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden: admin only" });

    const updated = await service.updateArticle(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Not found" });

    req.io?.emit("articles:updated", updated);
    res.json(updated);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden: admin only" });

    const deleted = await service.deleteArticle(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    req.io?.emit("articles:deleted", { _id: req.params.id });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { create, update, remove };
