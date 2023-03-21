const jsonwebtoken = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return new UnauthorizedErr();
  }

  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, 'secret-key');
  } catch (err) {
    return new UnauthorizedErr();
  }
  req.user = payload;
  return next();
};

module.exports = auth;
