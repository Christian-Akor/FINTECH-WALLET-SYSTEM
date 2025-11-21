const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  updatePin,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

router.post(
  '/register',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phoneNumber')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^[0-9]{10,15}$/)
      .withMessage('Please provide a valid phone number'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('pin')
      .matches(/^[0-9]{4}$/)
      .withMessage('PIN must be exactly 4 digits'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);

router.put(
  '/updatedetails',
  protect,
  [
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('phoneNumber')
      .optional()
      .matches(/^[0-9]{10,15}$/)
      .withMessage('Please provide a valid phone number'),
  ],
  validate,
  updateDetails
);

router.put(
  '/updatepassword',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  validate,
  updatePassword
);

router.put(
  '/updatepin',
  protect,
  [
    body('currentPin')
      .matches(/^[0-9]{4}$/)
      .withMessage('Current PIN must be exactly 4 digits'),
    body('newPin')
      .matches(/^[0-9]{4}$/)
      .withMessage('New PIN must be exactly 4 digits'),
  ],
  validate,
  updatePin
);

module.exports = router;
