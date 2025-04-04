import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]); // 🔥 Store online users

  return (
    <ChatContext.Provider value={{ username, setUsername, room, setRoom, onlineUsers, setOnlineUsers }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
