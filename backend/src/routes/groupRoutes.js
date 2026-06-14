import express from 'express';
import crypto from 'crypto';
import Group from '../models/Group.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/groups
// @desc    Get all groups for the logged-in user
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    // Find groups where the user is a member and sort by newest first
    const groups = await Group.find({ 'members.userId': req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/groups
// @desc    Create a new fantasy group/league
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { name, description, defaultStartingBudget, leagueSettings } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    // Fetch the user to get their personalized starting budget
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique 16-character invite token
    const inviteToken = crypto.randomBytes(8).toString('hex');

    // Determine starting balance for the owner based on their personalized settings
    const startingBalance = user.defaultStartingBudget || 1000000;

    // Create the group
    const group = await Group.create({
      name,
      description: description || '',
      ownerUserId: req.user.id,
      defaultStartingBudget: defaultStartingBudget || 1000000,
      leagueSettings: leagueSettings || {},
      inviteToken,
      members: [
        {
          userId: req.user.id,
          currentCashBalance: startingBalance,
          outstandingLoan: 0,
        },
      ],
    });

    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/groups/join/:token
// @desc    Join a group using an invite token
// @access  Private
router.post('/join/:token', protect, async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find the group by its unique invite token
    const group = await Group.findOne({ inviteToken: token });
    if (!group) {
      return res.status(404).json({ message: 'Invalid or expired invite token' });
    }

    // Check if the user is already a member
    const isMember = group.members.some((member) => member.userId.toString() === req.user.id);
    if (isMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Fetch the user to apply their personalized starting budget
    const user = await User.findById(req.user.id);
    const startingBalance = user ? user.defaultStartingBudget : group.defaultStartingBudget;

    // Add the new user to the group
    group.members.push({
      userId: req.user.id,
      currentCashBalance: startingBalance,
      outstandingLoan: 0,
    });

    await group.save();
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/groups/:id
// @desc    Get group details by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('ownerUserId', 'displayName email profilePictureUrl')
      .populate('members.userId', 'displayName email profilePictureUrl');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the requesting user is a member of the group
    const isMember = group.members.some((member) => member.userId._id.toString() === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
});

export default router;