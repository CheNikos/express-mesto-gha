const cardSchema = require('../models/card');

const getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (card) return res.send(card);

      return res
        .status(404)
        .send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' }));
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  cardSchema
    .findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send(card);

      return res
        .status(404)
        .send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные добавления лайка' }));
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  cardSchema
    .findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send(card);

      return res
        .status(404)
        .send({ message: 'Карточка с указанным id не найдена' });
    })
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' }));
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
