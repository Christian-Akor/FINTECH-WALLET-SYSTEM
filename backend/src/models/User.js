const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    pin: {
      type: String,
      required: [true, 'Transaction PIN is required'],
      minlength: 4,
      maxlength: 4,
      select: false,
    },
    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Hash PIN before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('pin')) {
    next();
  }
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
  this.pin = await bcrypt.hash(this.pin, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare PIN
userSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

// Generate account number
userSchema.statics.generateAccountNumber = async function () {
  let accountNumber;
  let isUnique = false;

  while (!isUnique) {
    accountNumber = '30' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    const existingAccount = await this.findOne({ accountNumber });
    if (!existingAccount) {
      isUnique = true;
    }
  }

  return accountNumber;
};

module.exports = mongoose.model('User', userSchema);
