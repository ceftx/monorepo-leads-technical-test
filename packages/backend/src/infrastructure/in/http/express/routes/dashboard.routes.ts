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
 * Obtener métricas del usuario actual
 * - Vendedor: solo ve sus propias métricas
 * - Admin: ve sus propias métricas (puede usar /dashboard/user/:id para ver otras)
 *
 * Responde con:
 * - Total de leads
 * - Distribución por estado
 * - Monto estimado total
 * - Leads de los últimos 7 días
 */
router.get("/user", DashboardController.getUserMetrics);

/**
 * GET /dashboard/user/:id
 * Obtener métricas de un usuario específico
 * Solo admin
 *
 * Permite al admin ver las métricas de cualquier vendedor
 */
router.get("/user/:id", adminOnly, DashboardController.getUserMetricsById);

/**
 * GET /dashboard/global
 * Obtener métricas globales del sistema
 * Solo admin
 *
 * Responde con:
 * - Total de leads (todos)
 * - Total de usuarios
 * - Distribución por estado (global)
 * - Monto estimado total (global)
 * - Leads de los últimos 7 días (global)
 * - Ranking de vendedores por monto ganado
 */
router.get("/global", adminOnly, DashboardController.getGlobalMetrics);

export default router;
