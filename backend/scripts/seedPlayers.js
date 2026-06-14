import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from '../src/models/Player.js';
import connectDB from '../src/config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const mockPlayers = [
  {
    name: 'Ben Johns',
    playerImageUrl: 'https://ui-avatars.com/api/?name=Ben+Johns&background=0D8ABC&color=fff',
    ranking: 1,
    bio: 'The undisputed #1 player in the world of pickleball.',
    currentMarketValue: 500000,
    tournamentHistory: [],
  },
  {
    name: 'Anna Leigh Waters',
    playerImageUrl: 'https://ui-avatars.com/api/?name=Anna+Leigh+Waters&background=E11D48&color=fff',
    ranking: 1,
    bio: 'The youngest and most dominant female player in pro pickleball.',
    currentMarketValue: 480000,
    tournamentHistory: [],
  },
  {
    name: 'Tyson McGuffin',
    playerImageUrl: 'https://ui-avatars.com/api/?name=Tyson+McGuffin&background=F59E0B&color=fff',
    ranking: 2,
    bio: 'Known for his athleticism and powerful forehand.',
    currentMarketValue: 400000,
    tournamentHistory: [],
  },
  {
    name: 'Catherine Parenteau',
    playerImageUrl: 'https://ui-avatars.com/api/?name=Catherine+Parenteau&background=8B5CF6&color=fff',
    ranking: 2,
    bio: 'A former tennis player who transitioned to a top pickleball pro.',
    currentMarketValue: 350000,
    tournamentHistory: [],
  },
  {
    name: 'Riley Newman',
    playerImageUrl: 'https://ui-avatars.com/api/?name=Riley+Newman&background=10B981&color=fff',
    ranking: 3,
    bio: 'A high-energy player with exceptional defensive skills.',
    currentMarketValue: 300000,
    tournamentHistory: [],
  },
];

const seedPlayers = async () => {
  try {
    await Player.deleteMany(); // Clear existing players to avoid duplicates
    const createdPlayers = await Player.insertMany(mockPlayers);
    console.log(`${createdPlayers.length} players seeded successfully.`);
    process.exit();
  } catch (error) {
    console.error(`Error seeding players: ${error.message}`);
    process.exit(1);
  }
};

seedPlayers();