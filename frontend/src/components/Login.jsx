import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const { setUsername, setRoom } = useChat();
  const [username, setLocalUsername] = useState('');
  const [room, setLocalRoom] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && room) {
      setUsername(username);
      setRoom(room);
      navigate('/chat');
    }
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 400, margin: 'auto', marginTop: 5 }}>
      <Typography variant="h5" align="center" gutterBottom>Join Chat Room</Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setLocalUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Room ID"
        variant="outlined"
        fullWidth
        value={room}
        onChange={(e) => setLocalRoom(e.target.value)}
        margin="normal"
      />
      <Button onClick={handleLogin} variant="contained" fullWidth sx={{ marginTop: 2 }}>
        Join Chat
      </Button>
    </Paper>
  );
};

export default Login;
