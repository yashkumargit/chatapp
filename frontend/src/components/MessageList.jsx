import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const getColor = (name) => {
  if (!name) return "#000"; // Fallback color if name is undefined
  const colors = ["#ff5733", "#33ff57", "#3357ff", "#ff33a6", "#ffbd33"]; // Different colors for users
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length]; // Assign color based on name hash
};

const MessageList = ({ messages = [], username }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((msg, index) => {
          if (!msg || !msg.message) return null; // Skip invalid messages

          const messageLength = msg.message.length || 0;
          const dynamicWidth = Math.min(
            60 + messageLength * 6,
            window.innerWidth / 2
          ); // Dynamic width, max 50% of screen

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: msg.author === username ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  maxWidth: "50vw", // Max width of 50% of viewport
                  width: `${dynamicWidth}px`, // Dynamic width
                  padding: "12px",
                  borderRadius: "16px",
                  alignSelf: msg.author === username ? "flex-end" : "flex-start",
                  backgroundColor: msg.author === username ? "#DCF8C6" : "#E0E0E0",
                  color: "black",
                  boxShadow: 2,
                  fontSize: "16px",
                  wordWrap: "break-word", // Prevent overflow
                  position: "relative",
                }}
              >
                {/* Name inside the message (top-left) */}
                {msg.author && msg.author !== username && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      position: "absolute",
                      top: "6px",
                      left: "10px",
                      color: getColor(msg.author),
                    }}
                  >
                    {msg.author}
                  </Typography>
                )}

                {/* Adjusted padding for message text to avoid overlapping name */}
                <Typography
                  variant="body1"
                  sx={{ marginTop: msg.author !== username ? "16px" : "0px" }}
                >
                  {msg.message || "⚠️ [Message not available]"}
                </Typography>

                {/* Time till minutes */}
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    fontSize: "12px",
                    marginTop: "5px",
                    color: "gray",
                  }}
                >
                  {msg.time ? msg.time.slice(0, 5) : "--:--"} {/* Display only HH:MM */}
                </Typography>
              </Paper>
            </Box>
          );
        })
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
          No messages yet.
        </Typography>
      )}
    </Box>
  );
};

export default MessageList;
