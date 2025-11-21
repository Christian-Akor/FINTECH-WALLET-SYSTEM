const express = require('express');
const { body } = require('express-validator');
const {
  getBalance,
  transferMoney,
  getTransactions,
  getTransaction,
  getTransactionByReference,
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

router.use(protect);

router.get('/balance', getBalance);

router.post(
  '/transfer',
  [
    body('recipientAccountNumber').notEmpty().withMessage('Recipient account number is required'),
    body('amount').isNumeric().withMessage('Amount must be a number').custom((value) => {
      if (value <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return true;
    }),
    body('pin')
      .matches(/^[0-9]{4}$/)
      .withMessage('PIN must be exactly 4 digits'),
  ],
  validate,
  transferMoney
);

router.get('/transactions', getTransactions);

router.get('/transactions/:id', getTransaction);

router.get('/transactions/reference/:reference', getTransactionByReference);

module.exports = router;
