import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currentCashBalance: {
    type: Number,
    required: true,
  },
  outstandingLoan: {
    type: Number,
    default: 0,
  },
});

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    defaultStartingBudget: {
      type: Number,
      default: 1000000,
    },
    leagueSettings: {
      type: Object,
      default: {},
    },
    inviteToken: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'ended', 'archived'],
      default: 'active',
    },
    members: [memberSchema],
  },
  { timestamps: true }
);

const Group = mongoose.model('Group', groupSchema);

export default Group;