import React, { useState } from 'react';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div style={styles.inputContainer}>
      <input
        style={styles.input}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
      />
      <button style={styles.button} onClick={handleSend}>Send</button>
    </div>
  );
}

const styles = {
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    marginLeft: '10px',
    padding: '10px 16px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};
