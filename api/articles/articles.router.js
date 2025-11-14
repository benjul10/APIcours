const router = require("express").Router();
const controller = require("./articles.controller");
const auth = require("../../middlewares/auth"); // ← chemin correct vers ton middleware

// Protège chaque route ici (clair et local)
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);

module.exports = router;
