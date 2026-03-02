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
 * Listar todos los usuarios
 * Solo admin
 */
router.get("/", UserController.list);

/**
 * DELETE /users/:id
 * Eliminar un usuario
 * Solo admin
 *
 * Restricciones:
 * - No puede eliminarse a sí mismo
 * - Los leads del usuario se eliminan en cascade
 */
router.delete("/:id", UserController.delete);

export default router;
