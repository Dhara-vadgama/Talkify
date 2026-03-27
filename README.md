# Talkify – Real-Time Video Meeting Application

Talkify is a **real-time video conferencing web application** that allows multiple users to join a room, communicate via video/audio, share their screen, and chat instantly.  
The application is built using **WebRTC for peer-to-peer media streaming** and **Socket.IO for real-time signaling**.

This project demonstrates how modern video meeting platforms like Zoom or Google Meet work at a basic level.

---

## Live Demo

Try the application here:

🔗 https://talkify-1-p3j2.onrender.com/

To test the video call, open the link in **two different browsers or devices** and join the same room.


---

# Features

### Real-Time Video & Audio Communication
- Peer-to-peer video calling using WebRTC
- Multiple participants in the same room
- Toggle camera and microphone during the call

### Screen Sharing
- Share your screen with other participants
- Toggle screen share on/off

### Live Chat
- Send messages during the call
- Real-time messaging using Socket.IO
- Message notification badge

### Dynamic Video Layout
- Automatic grid layout for multiple participants
- Responsive design for desktop and mobile

### Room-Based Meetings
- Each URL creates a unique meeting room
- Users can join via a shared meeting link

---

# Technologies Used

## Frontend
- React.js
- CSS
- Material UI

## Backend
- Node.js
- Express.js
- Socket.IO

## Real-Time Communication
- WebRTC
- STUN Server (Google STUN)

## Deployment
- Render (Frontend + Backend)

---

# Project Structure
Talkify
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── environment.js
│ │ └── videoMeet.css
│ │
│ └── package.json
│
├── backend
│ ├── server.js
│ ├── socket handlers
│ └── package.json
│
└── README.md


---

# How It Works

1. A user opens the meeting URL.
2. The app requests **camera and microphone permissions**.
3. Socket.IO connects users inside the same room.
4. WebRTC creates peer-to-peer connections between participants.
5. Video/audio streams are shared directly between users.
6. Chat messages are transmitted using WebSockets.

---

# How to Run Locally

## 1. Clone the repository

````bash
git clone https://github.com/yourusername/talkify.git
cd talkify
2. Install dependencies
Frontend
cd frontend
npm install
Backend
cd backend
npm install
3. Start the backend server
npm start
4. Start the frontend
npm run dev
5. Open the app

http://localhost:5173



Author

Dhara Vadgama

BCA Student | Web Development Enthusiast
