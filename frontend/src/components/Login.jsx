import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogRocket from 'logrocket'; // ✅ Import LogRocket

const Login = () => {
  const { setUsername, setRoom } = useChat();
  const [username, setLocalUsername] = useState('');
  const [room, setLocalRoom] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !room.trim()) {
      alert("Please enter both username and room ID.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        username,
        password: "dummy_password", // only if your backend expects it
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);
      localStorage.setItem("room", room); // ✅ store room for session restore

      setUsername(username);
      setRoom(room);

      // ✅ Identify the user for LogRocket
      LogRocket.identify(username, {
        name: username,
        room: room,
      });

      navigate("/chat");
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 400, margin: 'auto', marginTop: 8, borderRadius: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Join Chat Room
      </Typography>

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setLocalUsername(e.target.value)}
        margin="normal"
        autoComplete="off"
      />

      <TextField
        label="Room ID"
        variant="outlined"
        fullWidth
        value={room}
        onChange={(e) => setLocalRoom(e.target.value)}
        margin="normal"
        autoComplete="off"
      />

      <Button
        onClick={handleLogin}
        variant="contained"
        fullWidth
        sx={{ marginTop: 3, backgroundColor: '#128C7E', '&:hover': { backgroundColor: '#0f6e63' } }}
      >
        Join Chat
      </Button>
    </Paper>
  );
};

export default Login;
