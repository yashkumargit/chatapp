import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

const Message = ({ message, author, time, username }) => {
  return (
    <ListItem
      sx={{
        display: 'flex',
        justifyContent: author === username ? 'flex-end' : 'flex-start',
      }}
    >
      <ListItemText
        sx={{
          backgroundColor: author === username ? 'blue' : 'gray',
          color: 'white',
          borderRadius: 2,
          padding: 1,
          maxWidth: '70%',
          wordWrap: 'break-word',
        }}
        primary={message}
        secondary={`${author} | ${time}`}
      />
    </ListItem>
  );
};

export default Message;