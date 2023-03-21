const jsonwebtoken = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedErr('Необходима авторизация'));
  }

  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, 'secret-key');
  } catch (err) {
    return next(new UnauthorizedErr('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
