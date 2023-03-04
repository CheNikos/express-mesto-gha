const cardSchema = require("../models/card");

const createCard = (req, res) => {
  console.log(req.user._id);
};

module.exports = {
  createCard
};
