import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/api/chatter/ws';

export const connectWebSocket = (onMessage, onConnect) => {
  const client = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    reconnectDelay: 5000,
    debug: str => console.log('[STOMP DEBUG]', str),
    onConnect: () => {
      console.log('[STOMP] Connected');

      client.subscribe('/topic/messages', message => {
        const body = JSON.parse(message.body);
        onMessage(body);
      });

      onConnect(client); // Only pass the client once it is connected
    },
  });

  client.activate();
};
