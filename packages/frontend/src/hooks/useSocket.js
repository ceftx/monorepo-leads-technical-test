import { useEffect, useState } from 'react';
import socketService from '../services/socket.service';

/**
 * useSocket - Hook para gestionar conexión WebSocket
 *
 * @returns {Object} - { connected, connect, disconnect }
 */
export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Cleanup al desmontar
    return () => {
      if (socketService.isConnected()) {
        socketService.disconnect();
      }
    };
  }, []);

  const connect = (token) => {
    if (!token) {
      console.warn('⚠️  No se proporcionó token para WebSocket');
      return;
    }

    socketService.connect(token);

    // Actualizar estado de conexión
    const checkConnection = setInterval(() => {
      setConnected(socketService.isConnected());
    }, 1000);

    return () => clearInterval(checkConnection);
  };

  const disconnect = () => {
    socketService.disconnect();
    setConnected(false);
  };

  return {
    connected,
    connect,
    disconnect
  };
};
