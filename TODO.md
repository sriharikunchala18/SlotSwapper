# SlotSwapper Development TODO

## Project Setup
- [x] Create backend/ and frontend/ directories

## Backend Setup
- [x] Create backend/package.json with dependencies (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv)
- [x] Create backend/server.js (Express server setup, middleware, routes)
- [x] Create backend/models/ directory
  - [x] backend/models/User.js (Mongoose schema for User)
  - [x] backend/models/Event.js (Mongoose schema for Event)
  - [x] backend/models/SwapRequest.js (Mongoose schema for SwapRequest)
- [x] Create backend/routes/ directory
  - [x] backend/routes/auth.js (Auth routes: register, login)
  - [x] backend/routes/events.js (Event routes: CRUD)
  - [x] backend/routes/swaps.js (Swap routes: request, accept/reject)
- [x] Create backend/middleware/ directory
  - [x] backend/middleware/auth.js (JWT verification middleware)

## Frontend Setup
- [x] Create React app in frontend/ directory
- [x] Update frontend/package.json with dependencies (axios, react-router-dom, jwt-decode)
- [x] Create frontend/src/components/ directory
  - [x] frontend/src/components/Login.js
  - [x] frontend/src/components/Signup.js
  - [x] frontend/src/components/Calendar.js
  - [x] frontend/src/components/Marketplace.js
  - [x] frontend/src/components/Notification.js
- [x] Create frontend/src/pages/ directory
  - [x] frontend/src/pages/Home.js
  - [x] frontend/src/pages/Profile.js
- [x] Create frontend/src/context/ directory
  - [x] frontend/src/context/AuthContext.js
- [x] Update frontend/src/App.js with routing

## Installation and Running
- [x] Install backend dependencies
- [x] Install frontend dependencies
- [x] Run frontend server (localhost:3000)
- [x] Run backend server (localhost:5000)

## Feature Implementation
- [x] Implement Authentication (register/login with JWT)
- [x] Implement Event Management (create, view, update, delete events)
- [x] Implement Swap Requests (create request, accept/reject with status updates)

## Missing Requirements Completion
- [x] Update Event model to use status enum (BUSY, SWAPPABLE, SWAP_PENDING)
- [x] Update Event routes to handle status changes
- [x] Update SwapRequest creation to require offeredEvent upfront
- [x] Set slots to SWAP_PENDING when creating swap request
- [x] Reset slots to SWAPPABLE on rejection
- [x] Update frontend Marketplace to show modal for selecting offered event
- [x] Update Notification component to separate incoming/outgoing requests
- [x] Add dynamic state updates without refresh
- [x] Update API endpoints to match requirements (swappable-slots, swap-request, swap-response)
- [x] Update README with correct API documentation

## Testing and Documentation
- [x] Test backend endpoints
- [x] Test frontend UI and interactions
- [x] Write README.md with setup instructions
