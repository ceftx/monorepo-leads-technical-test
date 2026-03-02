import { Router } from "express";
import { LeadController } from "../controllers/LeadController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

/**
 * Rutas de leads
 * Base path: /leads
 *
 * TODAS las rutas requieren autenticación
 */
const router = Router();

// Aplicar authMiddleware a todas las rutas
router.use(authMiddleware);

/**
 * POST /leads
 * Crear un nuevo lead
 * - Vendedor: crea lead asignado a sí mismo
 * - Admin: puede asignar a cualquier vendedor con userId opcional
 */
router.post("/", LeadController.create);

/**
 * GET /leads
 * Listar leads
 * - Vendedor: solo ve sus propios leads
 * - Admin: ve todos los leads (o filtrar por userId con query param)
 *
 * Query params opcionales:
 * - userId: number (solo admin puede filtrar por otro usuario)
 */
router.get("/", LeadController.list);

/**
 * GET /leads/:id
 * Obtener un lead específico
 * - Vendedor: solo puede ver sus propios leads
 * - Admin: puede ver cualquier lead
 */
router.get("/:id", LeadController.getById);

/**
 * PATCH /leads/:id/status
 * Actualizar el estado de un lead
 * - Vendedor: solo puede actualizar sus propios leads
 * - Admin: puede actualizar cualquier lead
 *
 * Body:
 * - estado: LeadStatus (NUEVO | CONTACTADO | GANADO | PERDIDO)
 */
router.patch("/:id/status", LeadController.updateStatus);

/**
 * DELETE /leads/:id
 * Eliminar un lead
 * - Vendedor: solo puede eliminar sus propios leads
 * - Admin: puede eliminar cualquier lead
 */
router.delete("/:id", LeadController.delete);

export default router;
