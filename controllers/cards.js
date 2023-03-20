const cardSchema = require('../models/card');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');
const NotFoundErr = require('../errors/NotFoundErr');

const getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardSchema
    .create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  cardSchema
    .findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Карточка с указанным id не найдена');
      }
      if (!(card.owner.equals(req.user._id.toString()))) {
        throw new ForbiddenErr('Чужая карточка не может быть удалена');
      }
      throw card.findByIdAndRemove().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(() => new NotFoundErr('Переданы некорректные данные карточки'));
};

const likeCard = (req, res, next) => {
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

      throw new NotFoundErr('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при добавлении лайка'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
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

      throw new NotFoundErr('Данные по указанному id не найдены');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при снятии лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
