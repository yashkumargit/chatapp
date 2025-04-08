import React, { useState, useEffect } from "react";
import { Box, TextField, Paper, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import io from "socket.io-client";
import MessageList from "./MessageList";

// Establish socket connection only once
const socket = io("http://localhost:3001", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

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

    socket.emit("join_room", { username, room });

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("update_online_users", (users) => {
      setOnlineUsers(users);
    });

    // Optional: Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("receive_message");
      socket.off("update_online_users");
      socket.off("disconnect");
    };
  }, [username, room, navigate, setOnlineUsers]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      room,
      author: username,
      message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socket.emit("send_message", messageData);
    setMessage("");
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
        {/* Header */}
        <Paper
          sx={{
            padding: "10px",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#128C7E",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Room: {room}</span>
          <span>🟢 {onlineUsers.length} Online</span>
        </Paper>

        {/* Message list */}
        <Box sx={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          <MessageList messages={messages} username={username} />
        </Box>

        {/* Input area */}
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
