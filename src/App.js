import React, { useState, useEffect, useRef } from 'react';
import { connectWebSocket } from './websocket';

function App() {
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (username) {
      connectWebSocket(
        msg => setChat(prev => [...prev, msg]),
        client => {
          stompClientRef.current = client;
          client.publish({
            destination: '/api/chatter/chat/addUser',
            body: JSON.stringify({ sender: username })
          });
        }
      );
    }
  }, [username]);

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

  if (!username) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Enter Username</h2>
        <input
          value={tempUsername}
          onChange={e => setTempUsername(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && tempUsername.trim()) {
              setUsername(tempUsername.trim());
            }
          }}
        />
        <button onClick={() => setUsername(tempUsername.trim())}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, {username}</h2>
      <div style={{ border: '1px solid #ccc', height: 200, overflowY: 'auto', padding: 10, marginBottom: 10 }}>
        {chat.map((msg, i) => (
          <div key={i}><strong>{msg.sender}</strong>: {msg.content}</div>
        ))}
      </div>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
