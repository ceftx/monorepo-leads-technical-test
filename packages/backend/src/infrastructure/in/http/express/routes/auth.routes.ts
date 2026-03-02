import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";

/**
 * Rutas de autenticación
 * Base path: /auth
 */
const router = Router();

/**
 * POST /auth/register
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Registrar un nuevo usuario'
 * #swagger.description = 'Crea una nueva cuenta de usuario (VENDEDOR por defecto, solo ADMIN puede crear otros ADMIN)'
 * #swagger.requestBody = {
 *   required: true,
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/RegisterRequest" }
 *     }
 *   }
 * }
 * #swagger.responses[201] = {
 *   description: 'Usuario creado exitosamente',
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/User" }
 *     }
 *   }
 * }
 * #swagger.responses[400] = {
 *   description: 'Email ya está en uso',
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/Error" }
 *     }
 *   }
 * }
 */
router.post("/register", AuthController.register);

/**
 * POST /auth/login
 * #swagger.tags = ['Auth']
 * #swagger.summary = 'Iniciar sesión'
 * #swagger.description = 'Autentica un usuario y devuelve un JWT token'
 * #swagger.requestBody = {
 *   required: true,
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/LoginRequest" }
 *     }
 *   }
 * }
 * #swagger.responses[200] = {
 *   description: 'Login exitoso',
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/LoginResponse" }
 *     }
 *   }
 * }
 * #swagger.responses[401] = {
 *   description: 'Credenciales inválidas',
 *   content: {
 *     "application/json": {
 *       schema: { $ref: "#/components/schemas/Error" }
 *     }
 *   }
 * }
 */
router.post("/login", AuthController.login);

export default router;
