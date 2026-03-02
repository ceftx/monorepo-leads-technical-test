import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";

/**
 * Rutas de autenticación
 * Base path: /auth
 */
const router = Router();

/**
 * POST /auth/register
 * Registrar un nuevo usuario
 * Público (no requiere autenticación)
 */
router.post("/register", AuthController.register);

/**
 * POST /auth/login
 * Iniciar sesión y obtener JWT
 * Público (no requiere autenticación)
 */
router.post("/login", AuthController.login);

export default router;
