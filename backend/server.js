// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 5000;

// Use CORS middleware to allow requests from any origin during development
app.use(cors());

const users = {}; // To store connected users
const privateRooms = {}; // To store private room data

io.on('connection', (socket) => {
  console.log('A user connected.');

  // Send available users to the new connection
  socket.emit('availableUsers', Object.values(users));

  // Listen for incoming messages from the client
  socket.on('message', (message) => {
    console.log('Received message:', message);

    const roomName = getPrivateRoomName(message.sender.id, message.recipient.id);

    // Store the message in the private room
    if (!privateRooms[roomName]) {
      privateRooms[roomName] = [];
    }
    privateRooms[roomName].push(message);

    // Send the message to the sender and recipient
    socket.emit('message', message);
    socket.to(roomName).emit('message', message);
  });

  // Listen for user connection
  socket.on('userConnected', (user) => {
    users[user.id] = user;

    // Join a private room with the user's ID
    socket.join(user.id);
  });

  // Get available users
  socket.on('getAvailableUsers', () => {
    socket.emit('availableUsers', Object.values(users));
  });

  // Clean up the user's data on disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected.');
    Object.keys(users).forEach((userId) => {
      if (users[userId] === socket) {
        delete users[userId];
      }
    });
  });
});

function getPrivateRoomName(userId1, userId2) {
  // To ensure consistency, always arrange user IDs in ascending order
  const sortedIds = [userId1, userId2].sort();
  return `privateRoom_${sortedIds[0]}_${sortedIds[1]}`;
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
