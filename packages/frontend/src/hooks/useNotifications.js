import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import socketService from '../services/socket.service';
import api from '../utils/axios';

/**
 * useNotifications - Hook para gestionar notificaciones
 *
 * @returns {Object} - { notifications, unreadCount, markAsRead, markAllAsRead, loading }
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Cargar notificaciones desde la API
   */
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');

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
      const response = await api.get('/notifications/unread-count');

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
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await api.post(`/notifications/${notificationId}/read`);

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
      const response = await api.post('/notifications/read-all');

      if (response.data.success) {
        // Actualizar estado local
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);

        toast.success('Todas las notificaciones marcadas como leídas');
      }
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      toast.error('Error al marcar notificaciones');
    }
  }, []);

  /**
   * Manejar nueva notificación desde WebSocket
   */
  const handleNewNotification = useCallback((data) => {
    console.log('📬 Nueva notificación recibida:', data);

    const notification = data.notification;

    // Agregar a la lista
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Mostrar toast
    const notificationTypes = {
      LEAD_CREATED: '🆕',
      LEAD_STATUS_CHANGED: '📝',
      LEAD_DELETED: '🗑️'
    };

    const emoji = notificationTypes[notification.type] || '🔔';
    toast.info(`${emoji} ${notification.message}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }, []);

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
