const express = require("express");
const mongoose = require("mongoose");

const routeUsers = require("./routes/users");

mongoose.connect('mongodb://localhost:27017/mestodb')

const { PORT = 3000 } = process.env;

const app = express();

app.use(routeUsers);

app.use((req, res) => {
  res
    .status(404)
    .send({ message: "Страницы по запрошенному URL не существует" });
});

app.listen(PORT);
