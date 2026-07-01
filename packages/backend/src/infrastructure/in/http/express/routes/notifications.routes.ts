import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

/**
 * Rutas de notificaciones
 * Base path: /notifications
 *
 * TODAS las rutas requieren autenticación
 */
const router = Router();

// Aplicar authMiddleware a todas las rutas
router.use(authMiddleware);

/**
 * GET /notifications
 * #swagger.tags = ['Notifications']
 * #swagger.summary = 'Listar notificaciones del usuario'
 * #swagger.description = 'Obtiene las notificaciones del usuario autenticado'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get("/", NotificationController.list);

/**
 * GET /notifications/unread-count
 * #swagger.tags = ['Notifications']
 * #swagger.summary = 'Contar notificaciones no leídas'
 * #swagger.description = 'Obtiene la cantidad de notificaciones sin leer'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get("/unread-count", NotificationController.getUnreadCount);

/**
 * POST /notifications/:id/read
 * #swagger.tags = ['Notifications']
 * #swagger.summary = 'Marcar notificación como leída'
 * #swagger.description = 'Marca una notificación específica como leída'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.post("/:id/read", NotificationController.markAsRead);

/**
 * POST /notifications/read-all
 * #swagger.tags = ['Notifications']
 * #swagger.summary = 'Marcar todas como leídas'
 * #swagger.description = 'Marca todas las notificaciones del usuario como leídas'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.post("/read-all", NotificationController.markAllAsRead);

export default router;
