# GramBazaar

Hyperlocal rural marketplace monorepo for India.

## 🚀 Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Voice Features**: Web Speech API for accessibility

## 📦 Features
- Voice-to-Text for easy listing creation
- Real-time order tracking
- Multilingual support (Hindi/English)
- Buyer & Seller role separation

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
