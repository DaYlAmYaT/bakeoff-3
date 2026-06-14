import mongoose from 'mongoose';

const rosterSlotSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  assignedCategory: {
    type: String,
    enum: ["Men's Single", "Women's Single", "Men's Double", "Women's Double", "Mixed Double", "Unassigned"],
    default: "Unassigned",
  },
});

const teamSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    roster: [rosterSlotSchema],
  },
  { timestamps: true }
);

const Team = mongoose.model('Team', teamSchema);

export default Team;