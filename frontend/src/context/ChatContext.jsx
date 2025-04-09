import React, { createContext, useContext, useState, useEffect } from "react";
import LogRocket from 'logrocket'; // ✅ Import LogRocket

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [room, setRoom] = useState(() => localStorage.getItem("room") || "");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (username) localStorage.setItem("username", username);
    if (room) localStorage.setItem("room", room);
  }, [username, room]);

  // ✅ Auto-identify user on app reload
  useEffect(() => {
    if (username) {
      LogRocket.identify(username, {
        name: username,
        room: room,
      });
    }
  }, [username, room]);

  const clearChatSession = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("room");
    setUsername("");
    setRoom("");
    setOnlineUsers([]);
  };

  return (
    <ChatContext.Provider value={{ username, setUsername, room, setRoom, onlineUsers, setOnlineUsers, clearChatSession }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
