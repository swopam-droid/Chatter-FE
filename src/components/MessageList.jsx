import React, { useEffect, useRef } from 'react';

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.messageList}>
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            ...styles.message,
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#dcf8c6' : '#e5e5ea'
          }}
        >
          <div>{msg.text}</div>
          <div style={styles.timestamp}>{msg.time}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

const styles = {
  messageList: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
    fontSize: '14px',
  },
  timestamp: {
    fontSize: '10px',
    color: '#888',
    marginTop: '4px',
    textAlign: 'right',
  }
};
