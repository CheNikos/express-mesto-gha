const router = require('express').Router();
const {
  getUsers,
  getUser,
  setUserInfo,
  setUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users', getUsers);
router.get('/users/me/:userId', getUser);
router.patch('/users/me', setUserInfo);
router.patch('/users/me/avatar', setUserAvatar);
router.get('/users/me', auth, getCurrentUser);

module.exports = router;
