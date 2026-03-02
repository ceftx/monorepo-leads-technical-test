import { useEffect, useState } from 'react';
import socketService from '../services/socket.service';

interface UseSocketReturn {
  connected: boolean;
  connect: (token: string) => (() => void) | undefined;
  disconnect: () => void;
}

/**
 * useSocket - Hook para gestionar conexión WebSocket
 *
 * @returns {UseSocketReturn} - { connected, connect, disconnect }
 */
export const useSocket = (): UseSocketReturn => {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    // Cleanup al desmontar
    return () => {
      if (socketService.isConnected()) {
        socketService.disconnect();
      }
    };
  }, []);

  const connect = (token: string): (() => void) | undefined => {
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

  const disconnect = (): void => {
    socketService.disconnect();
    setConnected(false);
  };

  return {
    connected,
    connect,
    disconnect
  };
};
