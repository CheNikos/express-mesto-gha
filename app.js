const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '640625639cbcbb7e9929b30b',
  };

  next();
});

app.use(routeUsers);
app.use(routeCards);

app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'Страницы по запрошенному URL не существует' });
});

app.listen(PORT);
