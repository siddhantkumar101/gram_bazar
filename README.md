# GramBazaar

Hyperlocal rural marketplace monorepo for India.

## Stack
- Frontend: React 18 + Vite + Tailwind + React Router v6
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT with httpOnly cookies
- Realtime: Socket.io

## Structure
- `server` REST API
- `client` web app

## Run locally
1. Copy `server/.env.example` to `server/.env` and fill values.
2. Install dependencies in both `server` and `client`.
3. Start backend:
   - `cd server && npm run dev`
4. Start frontend:
   - `cd client && npm run dev`
