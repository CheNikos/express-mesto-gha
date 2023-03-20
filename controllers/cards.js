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
    .findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(401).send({ message: 'Карточка с указанным id не найдена' });
      }
      if (!(card.owner.equals(req.user._id.toString()))) {
        return res.status(400).send({ message: 'Чужая карточка не может быть удалена' });
      }
      return card.findByIdAndRemove().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(() => res.status(404).send({ message: 'Переданы некорректные данные карточки' }));
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
