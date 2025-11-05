# SlotSwapper

A peer-to-peer time-slot scheduling application where users can swap their busy slots.

## Features

- User authentication (sign up, log in) with JWT
- Create and manage personal events with status (BUSY, SWAPPABLE, SWAP_PENDING)
- Browse marketplace of available slots from other users
- Request swaps by selecting your own SWAPPABLE slot to offer
- Accept or reject swap requests with status updates
- Dynamic state management for real-time updates

## Tech Stack

- Backend: Node.js, Express, MongoDB (MongoDB Memory Server), JWT
- Frontend: React, Axios, React Router

## Installation

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm start`
4. Start the backend server: `cd backend && npm start`
5. Start the frontend server: `cd frontend && npm start`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/available` - Get available events for swapping (equivalent to GET /api/swappable-slots)

### Swaps
- `GET /api/swaps` - Get swap requests for user
- `POST /api/swaps` - Create a swap request (equivalent to POST /api/swap-request)
- `PUT /api/swaps/:id` - Accept or reject a swap request (equivalent to POST /api/swap-response)

## Database Schema

### User
- username: String
- email: String
- password: String (hashed)

### Event
- user: ObjectId (ref: User)
- title: String
- description: String
- startTime: Date
- endTime: Date
- status: String (enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'])

### SwapRequest
- requester: ObjectId (ref: User)
- requestedEvent: ObjectId (ref: Event)
- offeredEvent: ObjectId (ref: Event)
- status: String (enum: ['PENDING', 'ACCEPTED', 'REJECTED'])
- createdAt: Date

## Swap Logic

1. **GET /api/swappable-slots** (implemented as GET /api/events/available): Returns all events with status 'SWAPPABLE' from other users.

2. **POST /api/swap-request** (implemented as POST /api/swaps):
   - Requires mySlotId (user's SWAPPABLE event) and theirSlotId (target SWAPPABLE event)
   - Sets both events to SWAP_PENDING status
   - Creates SwapRequest record

3. **POST /api/swap-response** (implemented as PUT /api/swaps/:id):
   - If ACCEPTED: Requires offeredEvent ID, swaps user ownership, sets both events to BUSY
   - If REJECTED: Sets both events back to SWAPPABLE

## Usage

1. Sign up or log in
2. Create events in your calendar, mark some as "Available for swap" (SWAPPABLE)
3. Browse the marketplace for other users' SWAPPABLE slots
4. Click "Request Swap" on a slot, select one of your SWAPPABLE slots to offer
5. Check notifications for incoming requests (accept/reject) and outgoing request status
6. Upon acceptance, events are swapped between users' calendars
