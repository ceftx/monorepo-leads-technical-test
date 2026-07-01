import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { adminOnly } from "../middlewares/roleMiddleware.ts";

/**
 * Rutas de usuarios
 * Base path: /users
 *
 * TODAS las rutas requieren:
 * - Autenticación (authMiddleware)
 * - Rol de ADMIN (adminOnly)
 */
const router = Router();

// Aplicar middlewares a todas las rutas
router.use(authMiddleware);
router.use(adminOnly);

/**
 * GET /users
 * #swagger.tags = ['Users']
 * #swagger.summary = 'Listar todos los usuarios'
 * #swagger.description = 'Obtiene la lista completa de usuarios (solo ADMIN)'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get("/", UserController.list);

/**
 * DELETE /users/:id
 * #swagger.tags = ['Users']
 * #swagger.summary = 'Eliminar un usuario'
 * #swagger.description = 'Elimina un usuario y todos sus leads (solo ADMIN). No puede eliminarse a sí mismo'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.delete("/:id", UserController.delete);

export default router;
