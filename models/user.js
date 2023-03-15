const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },

    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },

    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'Неправильный формат ссылки',
      },
    },

    email: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Неправильный адрес почты',
      },
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
