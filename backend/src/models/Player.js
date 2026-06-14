import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    playerImageUrl: {
      type: String,
      default: '',
    },
    ranking: {
      type: Number,
    },
    bio: {
      type: String,
      default: '',
    },
    currentMarketValue: {
      type: Number,
      required: true,
      default: 0,
    },
    tournamentHistory: [
      {
        tournamentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tournament',
        },
        category: String,
        unforcedErrors: Number,
        forcedErrors: Number,
        winners: Number,
        popUps: Number,
        wins: Number,
        losses: Number,
        pointsScored: Number,
        averagePointsPerMatch: Number,
        placementRank: Number,
        pointsEarned: Number,
        winPercentage: Number,
        currentStreak: Number,
        lastUpdated: Date,
      },
    ],
  },
  { timestamps: true }
);

const Player = mongoose.model('Player', playerSchema);

export default Player;