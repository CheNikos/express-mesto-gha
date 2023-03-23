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

const deleteCard = (req, res, next) => {
  cardSchema
    .findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundErr('Карточка с указанным id не найдена');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        cardSchema.deleteOne(card)
          .then(() => { res.send({ message: 'Карточка удалена' }); })
          .catch(next);
      } else {
        throw new ForbiddenErr('Чужая карточка не может быть удалена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные карточки'));
      } else {
        next(err);
      }
    });
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
      if (!card) {
        throw new NotFoundErr('Карточка с таким id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Передан некорретный Id'));
        return;
      }
      next(err);
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
      if (err.name === 'CastError') {
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
