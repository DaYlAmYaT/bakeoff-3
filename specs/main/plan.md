# Implementation Plan: Fantasy Pickleball Game

**Feature Branch**: `001-fantasy-pickleball`  
**Created**: 2026-06-13

## Technology Stack

- **Project Type**: Full-stack Web Application
- **Language/Version**: JavaScript (ES6+) / Node.js
- **Primary Dependencies**: Svelte, Vite, svelte-routing, Express.js
- **Storage**: MongoDB

## High-Level Architecture

The application will be structured as a Single Page Application (SPA) using Svelte on the frontend, communicating with a RESTful API backend (Node.js/Express), with MongoDB as the primary unstructured data store.

- **Frontend (Svelte + Vite)**: Handles user interface, component state management, and client-side routing via `svelte-routing`.
- **Backend (Node.js/Express)**: Manages business logic, JWT authentication, auction resolution, tournament stat calculations, and database interactions.
- **Database (MongoDB)**: Stores data entities natively as BSON documents, which offers great flexibility for dynamic statistics and user properties like custom budgets.

## Data Model Implementation (MongoDB Collections)

Based on the requirements, here is the translation into MongoDB document collections:

1. **`users` Collection**
   - `_id` (ObjectId)
   - `email`, `passwordHash`
   - `displayName`, `profilePictureUrl`
   - `createdAt`, `updatedAt`

2. **`groups` Collection**
   - `_id` (ObjectId)
   - `name`, `description`
   - `ownerUserId` (ObjectId referencing `users`)
   - `defaultStartingBudget` (Number, default: 1000000)
   - `leagueSettings` (Object: rules, scoring modifiers)
   - `inviteToken` (String)
   - `status` (String: active, ended, archived)
   - `members`: Array of sub-documents `{ userId, currentCashBalance, outstandingLoan }`

3. **`players` Collection** (Professional Pickleball Players)
   - `_id` (ObjectId)
   - `name`, `playerImageUrl`, `ranking`, `bio`
   - `currentMarketValue` (Number)
   - `tournamentHistory`: Array of Objects (stats per tournament event)

4. **`teams` Collection**
   - `_id` (ObjectId)
   - `groupId` (ObjectId referencing `groups`)
   - `userId` (ObjectId referencing `users`)
   - `teamName`
   - `roster`: Array of sub-documents `{ playerId, assignedCategory }`

5. **`tournaments` Collection**
   - `_id` (ObjectId)
   - `name`, `tournamentDate`, `location`
   - `categories` (Array of Strings: Men's Single, Women's Single, etc.)
   - `resultsStatus` (String: scheduled, in_progress, completed)

6. **`bids` Collection**
   - `_id` (ObjectId)
   - `groupId` (ObjectId referencing `groups`)
   - `playerId` (ObjectId referencing `players`)
   - `currentHighestBidderUserId` (ObjectId referencing `users`)
   - `currentBidAmount` (Number)
   - `auctionEndTime` (Date)

7. **`trades` Collection**
   - `_id` (ObjectId)
   - `fromUserId`, `toUserId`, `groupId` (ObjectIds)
   - `offeredPlayers`, `requestedPlayers` (Arrays of ObjectIds)
   - `cashAdjustment` (Number)
   - `status` (String: proposed, accepted, rejected, cancelled)

8. **`transactions` Collection** (Ledger)
   - `_id` (ObjectId)
   - `userId`, `groupId` (ObjectIds)
   - `type` (String: bid_won, trade, reward, sale, loan, loan_repayment)
   - `amount` (Number)
   - `description` (String)

## API Endpoints (RESTful Contracts)

### Authentication & Users
- `POST /api/auth/register` - Create a new user (with customizable starting budget configuration)
- `POST /api/auth/login` - Authenticate and return JWT
- `GET /api/users/me` - Get current user profile 

### Groups & Leagues
- `POST /api/groups` - Create a new group (sets starting budget defaults)
- `POST /api/groups/join/:token` - Join a group via an invite link
- `GET /api/groups/:id` - Get group details, rules, and current members

### Bidding & Auction
- `GET /api/groups/:id/auctions` - List active pro player auctions
- `POST /api/auctions/:id/bid` - Place a bid on a player (incorporates loan checking logic)

### Teams & Players
- `GET /api/players` - List available pro players and their market value
- `POST /api/teams` - Form/update 8-player team and assign tournament categories
- `GET /api/teams/me` - Get the current user's active roster

### Market & Trading
- `POST /api/trades` - Propose a new trade to another user
- `PUT /api/trades/:id/accept` - Accept an incoming trade offer
- `POST /api/market/sell` - Sell a pro player back to the open market

## Frontend Architecture (Svelte Component Tree)

```text
src/
├── App.svelte (Main entry, sets up svelte-routing Router and layout)
├── components/
│   ├── auth/
│   │   └── AuthForm.svelte
│   ├── group/
│   │   ├── GroupList.svelte
│   │   └── CreateGroupModal.svelte
│   ├── auction/
│   │   ├── PlayerCard.svelte
│   │   └── BiddingInterface.svelte
│   ├── team/
│   │   ├── RosterGrid.svelte
│   │   └── CategorySlot.svelte
│   ├── trade/
│   │   └── TradeOfferModal.svelte
│   └── dashboard/
│       ├── Leaderboard.svelte
│       └── TournamentLiveStats.svelte
├── pages/
│   ├── Home.svelte
│   ├── Dashboard.svelte
│   ├── GroupDetail.svelte
│   ├── AuctionHouse.svelte
│   ├── MyTeam.svelte
│   └── TradeMarket.svelte
├── stores/
│   ├── authStore.js (Svelte writable store for user/JWT state)
│   ├── groupStore.js (Current group context & balances)
│   └── teamStore.js (Current roster & assignment state)
└── utils/
    └── apiClient.js (Fetch wrapper with JWT interception for backend calls)
```

## Implementation Phases

### Phase 1: Setup & Foundational
- Initialize the Vite + Svelte project and svelte-routing base routes.
- Set up the Node.js + Express backend with MongoDB (using Mongoose).
- Implement JWT User Authentication and the `users` data model.

### Phase 2: Group & Account Management
- Implement user budget configurations (1,000,000 PB default).
- Implement group creation, rules settings, and invite link generation.
- Build group joining logic and balance allocation.

### Phase 3: Player Market & Bidding System
- Seed MongoDB with mock Professional Pickleball Players.
- Implement the Auction interface and server-side bidding logic.
- Handle loans and user budget calculations upon bid submission.

### Phase 4: Team Formation & Tournaments
- Build the 8-player grid interface targeting the 5 core categories.
- Implement team assignment API.
- Create mock tournament progression APIs to resolve events and calculate stats.

### Phase 5: Rewards, Ledger & Trading
- Implement end-of-tournament reward payouts based on player stats.
- Process automated loan repayments from earnings.
- Build trading interfaces (propose, accept, reject) with cash adjustment logic.
- Finalize the leaderboards and real-time transaction ledger.