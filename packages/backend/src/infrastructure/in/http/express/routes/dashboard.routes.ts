import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { adminOnly } from "../middlewares/roleMiddleware.ts";

/**
 * Rutas del dashboard (métricas)
 * Base path: /dashboard
 *
 * TODAS las rutas requieren autenticación
 */
const router = Router();

// Aplicar authMiddleware a todas las rutas
router.use(authMiddleware);

/**
 * GET /dashboard/user
 * @tags Dashboard
 * @summary Obtener métricas del usuario autenticado
 * @description Retorna estadísticas y métricas del usuario actual (total leads, distribución por estado, monto estimado, etc)
 * @security bearerAuth
 * @returns {UserMetrics} 200 - Métricas del usuario
 * @returns {Error} 401 - No autenticado
 */
router.get("/user", DashboardController.getUserMetrics);

/**
 * GET /dashboard/user/:id
 * @tags Dashboard
 * @summary Obtener métricas de un usuario específico
 * @description Permite al admin ver las métricas de cualquier vendedor
 * @security bearerAuth
 * @param {number} id.path.required - ID del usuario
 * @returns {UserMetrics} 200 - Métricas del usuario
 * @returns {Error} 401 - No autenticado
 * @returns {Error} 403 - Requiere rol ADMIN
 * @returns {Error} 404 - Usuario no encontrado
 */
router.get("/user/:id", adminOnly, DashboardController.getUserMetricsById);

/**
 * GET /dashboard/global
 * @tags Dashboard
 * @summary Obtener métricas globales del sistema
 * @description Retorna estadísticas globales: total leads, usuarios, ranking de vendedores, etc (solo ADMIN)
 * @security bearerAuth
 * @returns {GlobalMetrics} 200 - Métricas globales
 * @returns {Error} 401 - No autenticado
 * @returns {Error} 403 - Requiere rol ADMIN
 */
router.get("/global", adminOnly, DashboardController.getGlobalMetrics);

export default router;
