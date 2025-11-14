// middlewares/auth.js
const jwt = require("jsonwebtoken");
const config = require("../config");                 // doit exposer secretJwtToken
const User = require("../api/users/users.model");

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // ⚠️ même secret que dans users.controller.login
    const decoded = jwt.verify(token, config.secretJwtToken);

    // ⚠️ même nom de clé que lors du sign: { userId }
    const user = await User.findById(decoded.userId).lean();
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;                                  // injecte l'utilisateur complet
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
