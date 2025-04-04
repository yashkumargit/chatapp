import React, { useState, useEffect } from "react";
import { Box, TextField, Paper, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import io from "socket.io-client";
import MessageList from "./MessageList";

const socket = io.connect("http://localhost:3001");

const Chat = () => {
  const { username, room, onlineUsers, setOnlineUsers } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || !room) {
      navigate("/login");
      return;
    }

    // 🔹 Send correct username & room data
    socket.emit("join_room", { username, room });

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]); // 🔥 Append only new message
    });

    // 🔥 Listen for online users
    socket.on("update_online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("update_online_users");
    };
  }, [username, room, navigate]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString().slice(0, 5),
      };

      socket.emit("send_message", messageData); // 🔥 Send to backend
      setMessage(""); // Clear input
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#F0F2F5",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "600px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        {/* Header - Room Info & Online Users */}
        <Paper
          sx={{
            padding: "10px",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#128C7E",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Room: {room}</span>
          <span>🟢 {onlineUsers.length} Online</span> {/* 🔥 Display Online Users */}
        </Paper>

        {/* Message List */}
        <Box sx={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          <MessageList messages={messages} username={username} />
        </Box>

        {/* Message Input */}
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            margin: "10px",
            borderRadius: "20px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <TextField
            fullWidth
            placeholder="Type a message..."
            variant="outlined"
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            sx={{
              "& fieldset": { border: "none" },
              backgroundColor: "#F8F8F8",
              borderRadius: "20px",
            }}
          />
          <IconButton onClick={sendMessage} sx={{ marginLeft: "8px", color: "#128C7E" }}>
            <SendIcon />
          </IconButton>
        </Paper>
      </Paper>
    </Box>
  );
};

export default Chat;
