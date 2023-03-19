const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const userSchema = require('../models/user');

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => userSchema.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).send({
          message: 'Пользователь с таким email уже существует',
        });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const login = (req, res) => {
  const {
    email, password,
  } = req.body;

  userSchema
    .findOne({ email })
    .orFail(() => res.status(404).send({ message: 'Пользователь не найден' }))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      return res.status(404).send({ message: 'Пользователь не найден' });
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.send({ user, jwt });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getCurrentUser = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((users) => res.send(users))
    .catch(next);
};

const getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  userSchema
    .findById(userId)
    .then((user) => {
      if (user) return res.send(user);

      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch(() => res
      .status(400)
      .send({
        message: 'Переданы некорректные данные при создании пользователя',
      }));
};

const setUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id: userId } = req.user;

  userSchema
    .findByIdAndUpdate(
      userId,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send(user);

      return res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const setUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  userSchema
    .findByIdAndUpdate(
      userId,
      {
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) return res.send(user);

      return res
        .status(404)
        .send({ message: 'Пользователь по указанному id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      }

      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  setUserInfo,
  setUserAvatar,
  login,
  getCurrentUser,
};
