const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(3000);