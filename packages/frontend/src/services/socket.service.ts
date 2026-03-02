import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: string;
  type: 'LEAD_CREATED' | 'LEAD_STATUS_CHANGED' | 'LEAD_DELETED';
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  leadId?: string;
}

export interface NotificationData {
  notification: Notification;
}

type NotificationCallback = (data: NotificationData) => void;

/**
 * SocketService - Cliente WebSocket con Socket.IO
 *
 * Maneja la conexión en tiempo real con el backend
 */
class SocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;

  /**
   * Conectar al servidor WebSocket
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('🔌 Socket ya está conectado');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const socketUrl = API_URL.replace('/api', ''); // Remove /api from URL

    console.log('🔌 Conectando a WebSocket:', socketUrl);

    this.socket = io(socketUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupListeners();
  }

  /**
   * Configurar listeners de eventos
   */
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor WebSocket');
      this.connected = true;
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Desconectado del servidor WebSocket:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ Error de conexión WebSocket:', error.message);
      this.connected = false;
    });

    this.socket.on('connected', (data: unknown) => {
      console.log('📨 Mensaje del servidor:', data);
    });
  }

  /**
   * Escuchar evento de notificación
   */
  onNotification(callback: NotificationCallback): void {
    if (!this.socket) {
      console.warn('⚠️  Socket no está conectado. Llama a connect() primero.');
      return;
    }

    this.socket.on('notification', callback);
  }

  /**
   * Dejar de escuchar notificaciones
   */
  offNotification(callback: NotificationCallback): void {
    if (this.socket) {
      this.socket.off('notification', callback);
    }
  }

  /**
   * Emitir evento para marcar notificación como leída
   */
  markNotificationAsRead(notificationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('notification:read', notificationId);
    }
  }

  /**
   * Desconectar del servidor
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Desconectando WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected(): boolean {
    return this.connected && (this.socket?.connected ?? false);
  }
}

// Singleton
const socketService = new SocketService();

export default socketService;
