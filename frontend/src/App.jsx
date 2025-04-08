import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import { ChatProvider } from './context/ChatContext';

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat"
            element={isAuthenticated ? <Chat /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ChatProvider>
    </Router>
  );
};

export default App;
