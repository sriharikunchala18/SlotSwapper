# SlotSwapper

## Overview

SlotSwapper is a peer-to-peer time-slot scheduling application that allows users to swap their busy slots with others. Users can create events on their calendar, mark certain slots as "SWAPPABLE" to offer for exchange, and browse a marketplace of available slots from other users to request swaps. The application handles the swap logic, including pending requests, acceptances, and rejections, ensuring a seamless experience for scheduling adjustments.

### Design Choices

- **Event Status System**: Events have statuses (BUSY, SWAPPABLE, SWAP_PENDING) to manage availability and swap states, preventing double-booking and ensuring atomic swap operations.
- **JWT Authentication**: Secure user sessions with token-based auth, stored in localStorage for persistence.
- **Real-time Updates**: Frontend uses polling for notifications and state updates, keeping the UI in sync without WebSockets for simplicity.
- **MongoDB with Mongoose**: Flexible schema for users, events, and swap requests; uses MongoDB Memory Server for local development to avoid external dependencies.
- **Docker Support**: Full containerization with Docker Compose for easy deployment, including MongoDB, backend, and frontend services.
- **Modular Architecture**: Separated backend (Express API) and frontend (React SPA) for scalability and maintainability.

## Features

- User authentication (sign up, log in) with JWT
- Create and manage personal events with status (BUSY, SWAPPABLE, SWAP_PENDING)
- Browse marketplace of available slots from other users
- Request swaps by selecting your own SWAPPABLE slot to offer
- Accept or reject swap requests with status updates
- Dynamic state management for real-time updates

## Tech Stack

- Backend: Node.js, Express, MongoDB (with MongoDB Memory Server for dev), JWT, Socket.io (for real-time connections)
- Frontend: React, Axios, React Router, CSS
- Database: MongoDB
- Deployment: Docker, Docker Compose

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- (Optional) Docker and Docker Compose for containerized setup

### Local Setup (Without Docker)

1. **Clone the repository**:
   ```
   git clone https://github.com/sriharikunchala18/SlotSwapper.git
   cd SlotSwapper
   ```

2. **Install backend dependencies**:
   ```
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```
   cd ../frontend
   npm install
   cd ..
   ```

4. **Start the backend server**:
   ```
   cd backend
   npm start
   ```
   The backend will run on http://localhost:5000. It uses MongoDB Memory Server, so no external MongoDB is required.

5. **Start the frontend server** (in a new terminal):
   ```
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000.

6. **Access the application**:
   Open http://localhost:3000 in your browser.

### Docker Setup (Recommended for Full Environment)

1. **Clone the repository**:
   ```
   git clone https://github.com/sriharikunchala18/SlotSwapper.git
   cd SlotSwapper
   ```

2. **Build and run with Docker Compose**:
   ```
   docker-compose up --build
   ```
   This will start MongoDB on port 27017, backend on port 5000, and frontend on port 3000.

3. **Access the application**:
   Open http://localhost:3000 in your browser.

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

## Assumptions and Challenges

### Assumptions
- Users have basic familiarity with calendar applications and understand time-slot concepts.
- MongoDB Memory Server is sufficient for development; production would use a persistent MongoDB instance.
- JWT tokens are stored securely in localStorage (in a real app, consider httpOnly cookies for better security).
- No concurrent swap requests on the same slot (handled by status locking).

### Challenges Faced
- Implementing atomic swap operations to prevent race conditions (solved with status-based locking).
- Managing real-time updates without WebSockets (used polling for simplicity, but could be optimized with Socket.io).
- Ensuring data consistency across events and swap requests during accept/reject operations.
- Balancing frontend state management with backend API calls for a responsive UI.

## Live Application

The application is deployed and accessible at: [https://slotswapper-demo.herokuapp.com](https://slotswapper-demo.herokuapp.com) (Note: This is a placeholder; replace with actual deployment URL if available.)
