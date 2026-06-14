import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    currentHighestBidderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    currentBidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    auctionEndTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;