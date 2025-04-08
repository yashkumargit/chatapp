require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./db");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
connectDB();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// ✅ Dummy Auth Route (you can enhance later with real auth)
app.post("/api/auth/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const token = `token-${username}`;
  return res.status(200).json({ token });
});

// ✅ Fetch Message History
app.get("/messages/:room", async (req, res) => {
  const { room } = req.params;
  try {
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Failed to get messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = {};

// ✅ Socket Events
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("join_room", ({ username, room }) => {
    if (!username || !room) {
      console.log("❌ Username or room missing");
      return;
    }

    socket.join(room);
    onlineUsers[socket.id] = { username, room };
    console.log(`🔹 ${username} joined room: ${room}`);

    const usersInRoom = Object.values(onlineUsers).filter(user => user.room === room);
    io.to(room).emit("update_online_users", usersInRoom);
  });

  socket.on("send_message", async (data) => {
    const { room, author, message } = data;
    console.log(`📩 New message from ${author} in room ${room}: ${message}`);

    try {
      const newMessage = new Message({
        room,
        sender: author,
        message
      });

      await newMessage.save();

      io.to(room).emit("receive_message", {
        author: newMessage.sender,
        message: newMessage.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      console.log(`❌ User disconnected: ${user.username}`);
      delete onlineUsers[socket.id];

      const usersInRoom = Object.values(onlineUsers).filter(u => u.room === user.room);
      io.to(user.room).emit("update_online_users", usersInRoom);
    }
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
