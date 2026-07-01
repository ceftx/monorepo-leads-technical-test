import type { Request, Response } from "express";
import { container } from "../../../../../shared/DependencyInjection.ts";

/**
 * NotificationController - Controlador de notificaciones
 */
export class NotificationController {
    /**
     * GET /notifications
     * Obtener notificaciones del usuario autenticado
     */
    static async list(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const notificationService = container.getNotificationService();

            if (!notificationService) {
                res.status(503).json({
                    success: false,
                    error: {
                        code: "SERVICE_UNAVAILABLE",
                        message: "Servicio de notificaciones no disponible",
                    },
                });
                return;
            }

            const notifications =
                await notificationService.getUserNotifications(userId);

            res.json({
                success: true,
                data: notifications,
            });
        } catch (error) {
            console.error("Error en NotificationController.list:", error);
            res.status(500).json({
                success: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Error al obtener notificaciones",
                },
            });
        }
    }

    /**
     * POST /notifications/:id/read
     * Marcar notificación como leída
     */
    static async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            const notificationId = parseInt(req.params.id as string);
            const notificationService = container.getNotificationService();

            if (!notificationService) {
                res.status(503).json({
                    success: false,
                    error: {
                        code: "SERVICE_UNAVAILABLE",
                        message: "Servicio de notificaciones no disponible",
                    },
                });
                return;
            }

            await notificationService.markAsRead(notificationId);

            res.json({
                success: true,
                message: "Notificación marcada como leída",
            });
        } catch (error) {
            console.error("Error en NotificationController.markAsRead:", error);
            res.status(500).json({
                success: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Error al marcar notificación como leída",
                },
            });
        }
    }

    /**
     * POST /notifications/read-all
     * Marcar todas las notificaciones como leídas
     */
    static async markAllAsRead(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const notificationService = container.getNotificationService();

            if (!notificationService) {
                res.status(503).json({
                    success: false,
                    error: {
                        code: "SERVICE_UNAVAILABLE",
                        message: "Servicio de notificaciones no disponible",
                    },
                });
                return;
            }

            await notificationService.markAllAsRead(userId);

            res.json({
                success: true,
                message: "Todas las notificaciones marcadas como leídas",
            });
        } catch (error) {
            console.error(
                "Error en NotificationController.markAllAsRead:",
                error,
            );
            res.status(500).json({
                success: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Error al marcar notificaciones como leídas",
                },
            });
        }
    }

    /**
     * GET /notifications/unread-count
     * Obtener cantidad de notificaciones no leídas
     */
    static async getUnreadCount(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const notificationService = container.getNotificationService();

            if (!notificationService) {
                res.status(503).json({
                    success: false,
                    error: {
                        code: "SERVICE_UNAVAILABLE",
                        message: "Servicio de notificaciones no disponible",
                    },
                });
                return;
            }

            const count = await notificationService.countUnread(userId);

            res.json({
                success: true,
                data: { count },
            });
        } catch (error) {
            console.error(
                "Error en NotificationController.getUnreadCount:",
                error,
            );
            res.status(500).json({
                success: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Error al obtener contador de notificaciones",
                },
            });
        }
    }
}
