const router = require("express").Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard
} = require("../controllers/cards");

router.post('/cards', createCard);
router.get('/cards', getCards);
router.put('/cards/:cardId/likes', deleteCard);
router.delete('/cards/:cardId/likes', deleteCard);

module.exports = router;
