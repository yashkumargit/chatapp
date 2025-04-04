require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./db"); // MongoDB connection
const Message = require("./models/Message"); // Message model

const app = express();
const server = http.createServer(app);
connectDB();

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 🔥 Store online users
const onlineUsers = {};

io.on("connection", (socket) => { 
  console.log(`✅ User connected: ${socket.id}`);

  // 🔹 Handle User Joining Room
  socket.on("join_room", ({ username, room }) => {
    if (!username || !room) return; // Fix undefined issue

    socket.join(room);
    onlineUsers[socket.id] = { username, room }; // 🔥 Track user

    console.log(`🔹 ${username} joined room: ${room}`);

    // 🔥 Send updated user list
    const usersInRoom = Object.values(onlineUsers).filter(user => user.room === room);
    io.to(room).emit("update_online_users", usersInRoom);
  });

  // 🔹 Handle Sending Messages
  socket.on("send_message", async (data) => {
    const { room, author, message } = data;
    console.log(`📩 New message in room ${room} from ${author}: ${message}`);

    try {
      const newMessage = new Message({ room, sender: author, message });
      await newMessage.save();

      // 🔥 Broadcast only the new message
      io.to(room).emit("receive_message", {
        author: newMessage.sender,
        message: newMessage.message,
        time: new Date().toLocaleTimeString(),
      });

    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  // 🔹 Handle User Disconnect
  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      console.log(`❌ User disconnected: ${user.username} (${socket.id})`);
      delete onlineUsers[socket.id];

      // 🔥 Send updated user list to the room
      io.to(user.room).emit("update_online_users", 
        Object.values(onlineUsers).filter(u => u.room === user.room)
      );
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
