const express = require('express');
const {
  getUsers,
  getUser,
  getUserByAccountNumber,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(authorize('admin'), getUsers);

router.route('/:id').get(getUser).put(authorize('admin'), updateUser).delete(authorize('admin'), deleteUser);

router.route('/account/:accountNumber').get(getUserByAccountNumber);

module.exports = router;
