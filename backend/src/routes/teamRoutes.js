import express from 'express';
import Team from '../models/Team.js';
import Group from '../models/Group.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/teams
// @desc    Form/update 8-player team
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { groupId, teamName, roster } = req.body;

    if (!groupId || !teamName) {
      return res.status(400).json({ message: 'Group ID and Team Name are required' });
    }

    if (roster && roster.length > 8) {
      return res.status(400).json({ message: 'A team roster can have a maximum of 8 players' });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const isMember = group.members.some((m) => m.userId.toString() === req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Not a member of this group' });

    let team = await Team.findOne({ groupId, userId: req.user.id });

    if (team) {
      team.teamName = teamName;
      if (roster) team.roster = roster;
      await team.save();
    } else {
      team = await Team.create({
        groupId,
        userId: req.user.id,
        teamName,
        roster: roster || [],
      });
    }

    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/teams/me
// @desc    Get the current user's active roster(s)
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const { groupId } = req.query;
    const query = { userId: req.user.id };
    if (groupId) query.groupId = groupId;

    const teams = await Team.find(query).populate('roster.playerId');
    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
});

export default router;