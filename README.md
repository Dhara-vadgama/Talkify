# Talkify

## Overview
Talkify is a real-time video calling and chat application built with React (frontend) and Express + Socket.io (backend). It uses MongoDB for user data storage and WebRTC for peer-to-peer communication.

## Project Architecture
- **Frontend**: React + Vite (port 5000), MUI components, React Router
- **Backend**: Express + Socket.io (port 3001), Mongoose ODM
- **Database**: MongoDB Atlas (connection string in .env)

## Directory Structure
```
frontend/          - React + Vite frontend
  src/
    pages/         - Landing, Authentication pages
    contexts/      - Auth context with API calls
    assest/        - Static assets (images)
backend/           - Express + Socket.io backend
  src/
    controllers/   - Socket manager, user controllers
    models/        - Mongoose models (user, meeting)
    routes/        - Express routes
```

## Configuration
- Frontend runs on 0.0.0.0:5000 with Vite proxy to backend
- Backend runs on localhost:3001
- API calls from frontend are proxied via Vite: `/api/*` -> `http://localhost:3001`
- Socket.io connections are also proxied via Vite

## Environment Variables
- `MONGO_URL` - MongoDB connection string (in backend/.env)

