import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import { ChatProvider } from './context/ChatContext';

const App = () => {
  return (
    <Router>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </ChatProvider>
    </Router>
  );
};

export default App;
