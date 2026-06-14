import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      default: '',
    },
    defaultStartingBudget: {
      type: Number,
      default: 1000000,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;