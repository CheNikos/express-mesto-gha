const router = require('express').Router();
const {
  getUsers,
  getUser,
  setUserInfo,
  setUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me/:userId', getUser);
router.patch('/users/me', setUserInfo);
router.patch('/users/me/avatar', setUserAvatar);
router.get('/users/me', getCurrentUser);

module.exports = router;
