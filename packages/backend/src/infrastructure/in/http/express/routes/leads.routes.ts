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
 * #swagger.tags = ['Leads']
 * #swagger.summary = 'Crear un nuevo lead'
 * #swagger.description = 'Crea un lead. Vendedor: asignado a sí mismo. Admin: puede especificar userId'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = {
 *   required: true,
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/CreateLeadRequest" }
 *     }
 *   }
 * }
 * #swagger.responses[201] = {
 *   description: 'Lead creado exitosamente',
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/Lead" }
 *     }
 *   }
 * }
 */
router.post("/", LeadController.create);

/**
 * GET /leads
 * #swagger.tags = ['Leads']
 * #swagger.summary = 'Listar leads'
 * #swagger.description = 'Vendedor: solo ve sus leads. Admin: ve todos (o filtra por userId)'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.parameters['userId'] = {
 *   in: 'query',
 *   description: 'ID del usuario (solo admin)',
 *   required: false,
 *   type: 'number'
 * }
 */
router.get("/", LeadController.list);

/**
 * GET /leads/:id
 * #swagger.tags = ['Leads']
 * #swagger.summary = 'Obtener un lead por ID'
 * #swagger.description = 'Vendedor: solo sus leads. Admin: cualquier lead'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get("/:id", LeadController.getById);

/**
 * PATCH /leads/:id/status
 * #swagger.tags = ['Leads']
 * #swagger.summary = 'Actualizar estado del lead'
 * #swagger.description = 'Vendedor: solo sus leads. Admin: cualquier lead'
 * #swagger.security = [{ "bearerAuth": [] }]
 * #swagger.requestBody = {
 *   required: true,
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/UpdateLeadStatusRequest" }
 *     }
 *   }
 * }
 */
router.patch("/:id/status", LeadController.updateStatus);

/**
 * DELETE /leads/:id
 * #swagger.tags = ['Leads']
 * #swagger.summary = 'Eliminar un lead'
 * #swagger.description = 'Vendedor: solo sus leads. Admin: cualquier lead'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.delete("/:id", LeadController.delete);

export default router;
