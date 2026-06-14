import express from 'express';
import Player from '../models/Player.js';
import Bid from '../models/Bid.js';
import Team from '../models/Team.js';
import Group from '../models/Group.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/groups/:id/auctions
// @desc    List active pro player auctions for a specific group
// @access  Private
router.get('/groups/:id/auctions', protect, async (req, res, next) => {
  try {
    const groupId = req.params.id;

    // 1. Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const isMember = group.members.some((m) => m.userId.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: "Not authorized to view this group's auctions" });
    }

    // 2. Find all players currently assigned to teams in this group
    const teams = await Team.find({ groupId });
    const draftedPlayerIds = [];
    teams.forEach((team) => {
      team.roster.forEach((slot) => {
        if (slot.playerId) draftedPlayerIds.push(slot.playerId.toString());
      });
    });

    // 3. Get all players NOT drafted yet
    const availablePlayers = await Player.find({ _id: { $nin: draftedPlayerIds } });

    // 4. Get all active bids for this group (populate the bidder's display name)
    const activeBids = await Bid.find({ groupId }).populate('currentHighestBidderUserId', 'displayName');

    // 5. Combine players with their active bid state
    const auctions = availablePlayers.map((player) => {
      const activeBid = activeBids.find((b) => b.playerId.toString() === player._id.toString());
      return { player, bid: activeBid || null };
    });

    res.status(200).json(auctions);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auctions/:playerId/bid
// @desc    Place a bid on a player (incorporates loan checking)
// @access  Private
router.post('/auctions/:playerId/bid', protect, async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const { groupId, bidAmount } = req.body;

    if (!groupId || !bidAmount) {
      return res.status(400).json({ message: 'Group ID and bid amount are required' });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const memberIndex = group.members.findIndex((m) => m.userId.toString() === req.user.id);
    if (memberIndex === -1) return res.status(403).json({ message: 'Not a member of this group' });
    
    const member = group.members[memberIndex];

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    // Check if player is already drafted
    const teams = await Team.find({ groupId });
    const isDrafted = teams.some((team) =>
      team.roster.some((slot) => slot.playerId.toString() === playerId)
    );
    if (isDrafted) {
      return res.status(400).json({ message: 'Player is already drafted in this group' });
    }

    let bid = await Bid.findOne({ groupId, playerId });

    if (bid) {
      if (new Date() > bid.auctionEndTime) {
        return res.status(400).json({ message: 'Auction has ended' });
      }
      if (bidAmount <= bid.currentBidAmount) {
        return res.status(400).json({ message: 'Bid must be higher than the current bid' });
      }
      if (bid.currentHighestBidderUserId && bid.currentHighestBidderUserId.toString() === req.user.id) {
        return res.status(400).json({ message: 'You are already the highest bidder' });
      }

      // Refund the previous highest bidder
      if (bid.currentHighestBidderUserId) {
        const prevBidder = group.members.find(
          (m) => m.userId.toString() === bid.currentHighestBidderUserId.toString()
        );
        if (prevBidder) {
          const refundAmount = bid.currentBidAmount;
          if (prevBidder.outstandingLoan > 0) {
            const loanRepayment = Math.min(prevBidder.outstandingLoan, refundAmount);
            prevBidder.outstandingLoan -= loanRepayment;
            prevBidder.currentCashBalance += refundAmount - loanRepayment;
          } else {
            prevBidder.currentCashBalance += refundAmount;
          }
        }
      }

      // Update the bid
      bid.currentHighestBidderUserId = req.user.id;
      bid.currentBidAmount = bidAmount;
      await bid.save();
    } else {
      // Create a new bid (auction lasts 24 hours from first bid)
      const auctionEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      bid = await Bid.create({
        groupId,
        playerId,
        currentHighestBidderUserId: req.user.id,
        currentBidAmount: bidAmount,
        auctionEndTime,
      });
    }

    // Deduct funds from the new bidder
    if (bidAmount > member.currentCashBalance) {
      const loanNeeded = bidAmount - member.currentCashBalance;
      member.outstandingLoan += loanNeeded;
      member.currentCashBalance = 0;
    } else {
      member.currentCashBalance -= bidAmount;
    }

    await group.save();

    res.status(200).json(bid);
  } catch (error) {
    next(error);
  }
});

export default router;