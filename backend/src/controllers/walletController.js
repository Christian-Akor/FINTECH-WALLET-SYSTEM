const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
exports.getBalance = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      balance: user.balance,
      accountNumber: user.accountNumber,
    },
  });
});

// @desc    Transfer money
// @route   POST /api/wallet/transfer
// @access  Private
exports.transferMoney = asyncHandler(async (req, res, next) => {
  const { recipientAccountNumber, amount, pin, description } = req.body;

  // Validate amount
  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be greater than 0',
    });
  }

  // Get sender
  const sender = await User.findById(req.user.id).select('+pin');

  // Verify PIN
  const isPinCorrect = await sender.matchPin(pin);
  if (!isPinCorrect) {
    return res.status(401).json({
      success: false,
      message: 'Invalid transaction PIN',
    });
  }

  // Check if sender has sufficient balance
  if (sender.balance < amount) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient balance',
    });
  }

  // Get recipient
  const recipient = await User.findOne({ accountNumber: recipientAccountNumber });

  if (!recipient) {
    return res.status(404).json({
      success: false,
      message: 'Recipient account not found',
    });
  }

  // Check if sender is trying to send to themselves
  if (sender.accountNumber === recipient.accountNumber) {
    return res.status(400).json({
      success: false,
      message: 'Cannot transfer to your own account',
    });
  }

  // Check if recipient account is active
  if (!recipient.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Recipient account is not active',
    });
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Deduct from sender
    sender.balance -= amount;
    await sender.save({ session });

    // Add to recipient
    recipient.balance += amount;
    await recipient.save({ session });

    // Create transaction record
    const reference = Transaction.generateReference();

    const transaction = await Transaction.create(
      [
        {
          sender: sender._id,
          recipient: recipient._id,
          amount,
          type: 'transfer',
          status: 'completed',
          description: description || 'Money transfer',
          reference,
          balanceAfter: {
            sender: sender.balance,
            recipient: recipient.balance,
          },
          metadata: {
            senderAccountNumber: sender.accountNumber,
            recipientAccountNumber: recipient.accountNumber,
            senderName: `${sender.firstName} ${sender.lastName}`,
            recipientName: `${recipient.firstName} ${recipient.lastName}`,
          },
        },
      ],
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Transfer successful',
      data: transaction[0],
    });
  } catch (error) {
    // If error, abort transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({
    $or: [{ sender: req.user.id }, { recipient: req.user.id }],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'firstName lastName accountNumber')
    .populate('recipient', 'firstName lastName accountNumber');

  const total = await Transaction.countDocuments({
    $or: [{ sender: req.user.id }, { recipient: req.user.id }],
  });

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: transactions,
  });
});

// @desc    Get single transaction
// @route   GET /api/wallet/transactions/:id
// @access  Private
exports.getTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('sender', 'firstName lastName accountNumber email phoneNumber')
    .populate('recipient', 'firstName lastName accountNumber email phoneNumber');

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found',
    });
  }

  // Check if user is part of the transaction
  if (
    transaction.sender._id.toString() !== req.user.id &&
    transaction.recipient._id.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this transaction',
    });
  }

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

// @desc    Get transaction by reference
// @route   GET /api/wallet/transactions/reference/:reference
// @access  Private
exports.getTransactionByReference = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findOne({ reference: req.params.reference })
    .populate('sender', 'firstName lastName accountNumber email phoneNumber')
    .populate('recipient', 'firstName lastName accountNumber email phoneNumber');

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found',
    });
  }

  // Check if user is part of the transaction
  if (
    transaction.sender._id.toString() !== req.user.id &&
    transaction.recipient._id.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this transaction',
    });
  }

  res.status(200).json({
    success: true,
    data: transaction,
  });
});
