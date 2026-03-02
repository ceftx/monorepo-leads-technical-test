import { useEffect, useState, useCallback } from 'react';
import socketService, { Notification, NotificationData } from '../services/socket.service';
import api from '../api/axiosInstance';
import { useSnackbar } from '../contexts/SnackbarContext';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  refresh: () => Promise<void>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * useNotifications - Hook para gestionar notificaciones
 *
 * @returns {UseNotificationsReturn} - { notifications, unreadCount, markAsRead, markAllAsRead, loading }
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { showSnackbar } = useSnackbar();

  /**
   * Cargar notificaciones desde la API
   */
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Notification[]>>('/notifications');

      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener contador de notificaciones no leídas
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');

      if (response.data.success) {
        setUnreadCount(response.data.data.count);
      }
    } catch (error) {
      console.error('Error al obtener contador:', error);
    }
  }, []);

  /**
   * Marcar notificación como leída
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await api.post<ApiResponse<unknown>>(`/notifications/${notificationId}/read`);

      if (response.data.success) {
        // Actualizar estado local
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Notificar al servidor via WebSocket
        socketService.markNotificationAsRead(notificationId);
      }
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  }, []);

  /**
   * Marcar todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await api.post<ApiResponse<unknown>>('/notifications/read-all');

      if (response.data.success) {
        // Actualizar estado local
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);

        showSnackbar('Todas las notificaciones marcadas como leídas', 'success');
      }
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      showSnackbar('Error al marcar notificaciones', 'error');
    }
  }, [showSnackbar]);

  /**
   * Manejar nueva notificación desde WebSocket
   */
  const handleNewNotification = useCallback(
    (data: NotificationData | Notification) => {
      console.log('📬 Nueva notificación recibida:', data);

      // El backend puede enviar { notification: {...} } o el objeto directo
      const notification = 'notification' in data ? data.notification : data;

      // Agregar a la lista
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Mostrar snackbar
      const notificationTypes: Record<Notification['type'], string> = {
        LEAD_CREATED: '🆕',
        LEAD_STATUS_CHANGED: '📝',
        LEAD_DELETED: '🗑️'
      };

      const emoji = notificationTypes[notification.type] || '🔔';
      showSnackbar(`${emoji} ${notification.message}`, 'info');
    },
    [showSnackbar]
  );

  /**
   * Configurar listeners de WebSocket
   */
  useEffect(() => {
    // Escuchar notificaciones
    socketService.onNotification(handleNewNotification);

    // Cleanup
    return () => {
      socketService.offNotification(handleNewNotification);
    };
  }, [handleNewNotification]);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    refresh: fetchNotifications
  };
};
