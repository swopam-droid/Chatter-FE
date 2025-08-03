import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/api/chatter/ws';

export function connectWebSocket(onMessageReceived, onConnected) {
  return new Promise((resolve, reject) => {
    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/messages', (message) => {
          const body = JSON.parse(message.body);
          onMessageReceived(body);
        });

        onConnected(client);
        resolve(client);
      },
      onStompError: (frame) => {
        console.error('[STOMP] Error:', frame.headers['message']);
        reject(frame);
      }
    });

    client.activate();
  });
}
