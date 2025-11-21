const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['transfer', 'deposit', 'withdrawal'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'reversed'],
      default: 'pending',
    },
    description: {
      type: String,
      trim: true,
    },
    reference: {
      type: String,
      unique: true,
      required: true,
    },
    balanceAfter: {
      sender: {
        type: Number,
        required: true,
      },
      recipient: {
        type: Number,
        required: true,
      },
    },
    metadata: {
      senderAccountNumber: String,
      recipientAccountNumber: String,
      senderName: String,
      recipientName: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ sender: 1, createdAt: -1 });
transactionSchema.index({ recipient: 1, createdAt: -1 });

// Generate transaction reference
transactionSchema.statics.generateReference = function () {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${randomStr}`;
};

module.exports = mongoose.model('Transaction', transactionSchema);
