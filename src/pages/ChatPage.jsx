import React, { useEffect, useRef, useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Paper
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { connectWebSocket } from '../services/websocket';

function ChatPage() {
  const location = useLocation();
  const username = location.state?.username || '';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (username) {
      connectWebSocket(
        (msg) => setMessages((prev) => [...prev, msg]),
        (client) => {
          stompClientRef.current = client;
          client.publish({
            destination: '/api/chatter/chat/addUser',
            body: JSON.stringify({ sender: username })
          });
        }
      );
    }
  }, [username]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

  const sendMessage = () => {
    const client = stompClientRef.current;
    if (!client || typeof client.publish !== 'function' || !message.trim()) return;

   client.publish({
     destination: '/api/chatter/chat/sendMessage',
     body: JSON.stringify({
       sender: username,
       content: message,
       timestamp: new Date().toISOString()
     })
   });

    setMessage('');
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5">Welcome, {username}</Typography>

        <Paper variant="outlined" sx={{ mt: 2, mb: 2, p: 2, height: 400, overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <Box key={i} mb={1}>
              <Typography variant="subtitle2"><strong>{msg.sender}</strong></Typography>
              <Typography variant="body2">{msg.content}</Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Paper>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ChatPage;
