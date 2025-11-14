const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();

/**
 * IMPORTANT : l'ordre des routes compte !
 * - Les routes "fixes" (/login, /register) doivent être avant les paramétrées (/:id)
 * - La route publique /:userId/articles doit être avant /:id pour ne pas être capturée.
 */

// --- Auth publiques ---
router.post("/login", usersController.login);
router.post("/register", usersController.create);

// --- Route publique : articles d’un utilisateur ---
router.get("/:userId/articles", usersController.getUserArticles);

// --- CRUD Users ---
router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.post("/", usersController.create);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.delete);

module.exports = router;
