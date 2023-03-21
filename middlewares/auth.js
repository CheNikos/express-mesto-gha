const jsonwebtoken = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, 'secret-key');
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
