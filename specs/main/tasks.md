---
description: "Task list for Fantasy Pickleball Game feature implementation"
---

# Tasks: Fantasy Pickleball Game

**Input**: Design documents from `/specs/main/`
**Prerequisites**: `plan.md`, `spec.md`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)

## Path Conventions

- **Backend**: `backend/src/...` (Node.js/Express)
- **Frontend**: `frontend/src/...` (Svelte/Vite)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [x] T001 Create root project directory structure with `backend/` and `frontend/` folders
- [x] T002 Initialize frontend project: `npm create vite@latest frontend -- --template svelte` and install `svelte-routing`
- [x] T003 Initialize backend project: `npm init -y` in `backend/`, install `express`, `mongoose`, `dotenv`, `cors`, `jsonwebtoken`
- [x] T004 [P] Configure ESLint and Prettier for both frontend and backend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T005 Setup MongoDB connection module in `backend/src/config/db.js`
- [x] T006 Implement base JWT authentication middleware in `backend/src/middleware/auth.js`
- [x] T007 Setup Express server, root routing, and global error handling in `backend/src/server.js`
- [x] T008 [P] Implement `apiClient.js` in `frontend/src/utils/apiClient.js` for authenticated fetch wrappers
- [x] T009 [P] Setup base Svelte routing structure in `frontend/src/App.svelte`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Create and Join Fantasy Groups (Priority: P1) 🎯 MVP

**Goal**: Users can sign up, create custom budget accounts, form groups, and invite/join others.

### Backend Implementation
- [ ] T010 [P] [US1] Create `User` Mongoose model in `backend/src/models/User.js`
- [ ] T011 [P] [US1] Create `Group` Mongoose model in `backend/src/models/Group.js`
- [ ] T012 [US1] Implement Auth routes (`POST /api/auth/register`, `POST /api/auth/login`) supporting custom default starting budgets in `backend/src/routes/authRoutes.js`
- [ ] T013 [US1] Implement User route (`GET /api/users/me`) in `backend/src/routes/userRoutes.js`
- [ ] T014 [US1] Implement Group creation and token generation (`POST /api/groups`) in `backend/src/routes/groupRoutes.js`
- [ ] T015 [US1] Implement Group join logic (`POST /api/groups/join/:token`) allocating initial member balances
- [ ] T016 [US1] Implement Group details fetch (`GET /api/groups/:id`)

### Frontend Implementation
- [ ] T017 [P] [US1] Create `authStore.js` and `groupStore.js` in `frontend/src/stores/`
- [ ] T018 [P] [US1] Build `AuthForm.svelte` component in `frontend/src/components/auth/`
- [ ] T019 [US1] Build `Home.svelte` page featuring login/registration
- [ ] T020 [US1] Build `CreateGroupModal.svelte` with custom rules/budget settings
- [ ] T021 [US1] Build `GroupList.svelte` component
- [ ] T022 [US1] Build `GroupDetail.svelte` page to display group members and invite link

**Checkpoint**: Users can authenticate, set up their budget, create groups, and join via links.

---

## Phase 4: User Story 2 - Bid and Form Teams (Priority: P2)

**Goal**: Users bid on pro players (incorporating loans) and form an 8-player team.

### Backend Implementation
- [ ] T023 [P] [US2] Create Mongoose models: `Player`, `Bid`, `Team` in `backend/src/models/`
- [ ] T024 [US2] Create seed script `backend/scripts/seedPlayers.js` to populate mock Professional Pickleball Players
- [ ] T025 [US2] Implement Player listing endpoint (`GET /api/players`) in `backend/src/routes/playerRoutes.js`
- [ ] T026 [US2] Implement active auctions listing (`GET /api/groups/:id/auctions`) in `backend/src/routes/auctionRoutes.js`
- [ ] T027 [US2] Implement Bidding logic (`POST /api/auctions/:id/bid`), factoring in outstanding loans and current balance
- [ ] T028 [US2] Implement Team management endpoints (`POST /api/teams`, `GET /api/teams/me`) validating 8-player roster size

### Frontend Implementation
- [ ] T029 [P] [US2] Create `teamStore.js` in `frontend/src/stores/`
- [ ] T030 [US2] Build `PlayerCard.svelte` and `BiddingInterface.svelte` in `frontend/src/components/auction/`
- [ ] T031 [US2] Build `AuctionHouse.svelte` page
- [ ] T032 [US2] Build `RosterGrid.svelte` component (displaying the 8 slots)
- [ ] T033 [US2] Build `MyTeam.svelte` page

**Checkpoint**: Bidding phase works; users can spend their Pickle Bucks and assemble their rosters.

---

## Phase 5: User Story 3 - Track Performance and Earn Rewards (Priority: P3)

**Goal**: Assign players to categories, track tournament stats, and earn rewards (with automatic loan repayments).

### Backend Implementation
- [ ] T034 [P] [US3] Create Mongoose models: `Tournament`, `Transaction` in `backend/src/models/`
- [ ] T035 [US3] Implement Team assignment endpoint logic (allocating to Singles/Doubles/Mixed) in `backend/src/routes/teamRoutes.js`
- [ ] T036 [US3] Create mock tournament progression/resolution service `backend/src/services/tournamentService.js`
- [ ] T037 [US3] Implement Reward calculation service (distribute points, process automatic loan repayment from earnings)
- [ ] T038 [US3] Implement Ledger/Transactions endpoints to view cash worth history

### Frontend Implementation
- [ ] T039 [P] [US3] Build `CategorySlot.svelte` for assigning players to specific tournament matches
- [ ] T040 [US3] Build `TournamentLiveStats.svelte` component in `frontend/src/components/dashboard/`
- [ ] T041 [US3] Build `Dashboard.svelte` page showing live rewards and tournament progression
- [ ] T042 [US3] Build `Leaderboard.svelte` component to rank users by cash worth

**Checkpoint**: Game phase and Reward phase functional; system correctly deducts loans from tournament earnings.

---

## Phase 6: User Story 4 - Trade and Manage Players (Priority: P4)

**Goal**: Between tournaments, users can sell players to the market or execute trades (player-for-player, or cash trades).

### Backend Implementation
- [ ] T043 [P] [US4] Create `Trade` Mongoose model in `backend/src/models/Trade.js`
- [ ] T044 [US4] Implement Trade proposal endpoint (`POST /api/trades`) in `backend/src/routes/tradeRoutes.js`
- [ ] T045 [US4] Implement Trade resolution endpoints (`PUT /api/trades/:id/accept`, `PUT /api/trades/:id/reject`)
- [ ] T046 [US4] Implement Market Sell endpoint (`POST /api/market/sell`) in `backend/src/routes/marketRoutes.js` (validating no active tournament conflicts)

### Frontend Implementation
- [ ] T047 [P] [US4] Build `TradeOfferModal.svelte` component in `frontend/src/components/trade/`
- [ ] T048 [US4] Build `TradeMarket.svelte` page combining sell-to-market and user-to-user trading options

**Checkpoint**: Between-tournaments market management is functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T049 [P] Update API documentation or add Postman collection into `docs/`
- [ ] T050 Refine error handling UI (toast notifications for bidding errors, trade rejections)
- [ ] T051 Ensure responsive layout for `RosterGrid.svelte` and `Dashboard.svelte`
- [ ] T052 Security hardening: Ensure users cannot edit teams once a tournament state transitions to `in_progress`

---

## Dependencies & Execution Order

1. **Phase 1 & 2** are strict prerequisites.
2. **Phase 3 (US1)** establishes user accounts and groups, blocking all subsequent user stories.
3. **Phases 4, 5, and 6** should be executed sequentially, as Teams rely on Bids, Tournaments rely on Teams, and Trades rely on acquired Players.