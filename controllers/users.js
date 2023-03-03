const userSchema = require("../models/user");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userSchema
    .create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
}

const getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res.status(500).send({ message: "На сервере произошла ошибка" })
    );
}

const getUser = (req, res) => {
  const { id } = req.params;

  userSchema
    .findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(404).send({ message: "Пользователь не найден" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(500).send({ message: "На сервере произошла ошибка" });
      }
    });
}

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
      }
    )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(404).send({ message: "Пользователь не найден" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные",
        });
      }

      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
}

const setUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res
        .status(404)
        .send({ message: "Пользователь по указанному id не найден" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные",
        });
      }

      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  setUserInfo,
  setUserAvatar,
};
