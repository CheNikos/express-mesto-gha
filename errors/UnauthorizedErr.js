class UnauthorizedErr extends Error {
  constructor(status = 401, message = 'Необходима авторизация') {
    super();
    this.status = status;
    this.message = message;
  }
}
module.exports = UnauthorizedErr;
