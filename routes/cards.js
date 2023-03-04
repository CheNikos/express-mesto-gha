const router = require("express").Router();
const {
  createCard,
} = require("../controllers/cards");

router.post("/users", createCard);

module.exports = router;
