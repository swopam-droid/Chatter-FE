// React and necessary libraries
import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';     // Component that shows messages
import MessageInput from './MessageInput';   // Component for input box and send button
import { Client } from '@stomp/stompjs';     // STOMP client to talk to WebSocket
import SockJS from 'sockjs-client';          // SockJS to connect with Spring WebSocket server

export default function ChatWindow() {
  const [messages, setMessages] = useState([]); // Store chat messages
  const stompClientRef = useRef(null);          // Store STOMP client instance for WebSocket

  // useEffect runs once when the component is loaded (mounted)
  useEffect(() => {
    // Connect to the backend WebSocket server
    const socket = new SockJS('http://localhost:8080/ws'); // This URL must match Spring Boot's WebSocket config

    const stompClient = new Client({
      webSocketFactory: () => socket,   // Use SockJS for WebSocket connection
      reconnectDelay: 5000,             // Try reconnecting every 5s if connection drops
      debug: (str) => console.log(str), // Optional: logs WebSocket events in console

      // On successful connection
      onConnect: () => {
        console.log('Connected to WebSocket');

        // Subscribe to topic where server broadcasts messages
        stompClient.subscribe('/topic/messages', (message) => {
          const received = JSON.parse(message.body); // Convert message JSON to JS object
          setMessages((prev) => [...prev, received]); // Add new message to message list
        });
      },

      // If there's a STOMP error
      onStompError: (frame) => {
        console.error('Broker error: ' + frame.headers['message']);
        console.error('Details: ' + frame.body);
      }
    });

    stompClient.activate(); // Start the connection
    stompClientRef.current = stompClient; // Save reference to use later for sending

    // Cleanup function to run when component is removed/unloaded
    return () => {
      stompClient.deactivate(); // Disconnect from WebSocket
    };
  }, []); // Empty dependency array = only run once on component mount

  // Function to handle sending a message
  const handleSend = (text) => {
    const userMessage = {
      text,                          // The message content
      sender: 'user',                // You can change this to actual user info if available
      time: new Date().toLocaleTimeString() // Format current time
    };

    // Show your own message instantly on your screen
    setMessages(prev => [...prev, userMessage]);

    // Send message to backend WebSocket if connected
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat', // Backend listens here (@MessageMapping in Spring)
        body: JSON.stringify(userMessage) // Send as JSON string
      });
    }
  };

  return (
    <div style={styles.chatWindow}>
      <MessageList messages={messages} />     {/* Display messages */}
      <MessageInput onSend={handleSend} />    {/* Input box to send messages */}
    </div>
  );
}

// CSS styles in JS
const styles = {
  chatWindow: {
    width: '400px',
    height: '600px',
    border: '1px solid #ccc',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f8f8',
    fontFamily: 'Arial',
  }
};
