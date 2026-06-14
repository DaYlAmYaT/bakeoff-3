import express from 'express';
import Player from '../models/Player.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/players
// @desc    Get all professional pickleball players
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const players = await Player.find({}).sort({ ranking: 1 });
    res.status(200).json(players);
  } catch (error) {
    next(error);
  }
});

export default router;