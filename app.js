const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { login, createUser } = require('./controllers/users');

const app = express();
app.use(bodyParser.json());

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const { PORT = 3000 } = process.env;

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(routeUsers);
app.use(routeCards);

app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'Страницы по запрошенному URL не существует' });
});

app.listen(PORT);
