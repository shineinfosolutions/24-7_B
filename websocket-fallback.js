// WebSocket fallback configuration for production
import { io } from 'socket.io-client';

const createSocketConnection = (serverUrl) => {
  const socket = io(serverUrl, {
    transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
    upgrade: true,
    rememberUpgrade: true,
    timeout: 20000,
    forceNew: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    maxReconnectionAttempts: 5
  });

  // Handle connection errors
  socket.on('connect_error', (error) => {
    console.log('Socket connection error:', error);
    // Fallback to HTTP polling for order updates
    if (error.message.includes('websocket')) {
      socket.io.opts.transports = ['polling'];
    }
  });

  return socket;
};

export default createSocketConnection;