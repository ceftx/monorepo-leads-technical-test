import type { Request, Response, NextFunction } from "express";
import { container } from "../../../../../shared/DependencyInjection.ts";
import { UserRole } from "../../../../../domain/value-objects/UserRole.ts";
import { InvalidCredentialsError } from "../../../../../domain/errors/AuthErrors.ts";

/**
 * Controller para autenticación y registro de usuarios
 */
export class AuthController {
    /**
     * POST /auth/register
     * Registrar un nuevo usuario
     */
    static async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { email, password, nombre, rol } = req.body;

            // Validación básica de campos requeridos
            if (!email || !password || !nombre) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: "MISSING_FIELDS",
                        message:
                            "Los campos email, password y nombre son requeridos",
                    },
                });
                return;
            }

            // Ejecutar caso de uso
            const registerUseCase = container.getRegisterUserUseCase();
            const user = await registerUseCase.execute({
                email,
                password,
                nombre,
                rol: rol as UserRole,
            });

            // Respuesta exitosa (NO incluir password)
            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email.value,
                        nombre: user.nombre,
                        rol: user.rol,
                        createdAt: user.createdAt,
                    },
                },
            });
        } catch (error) {
            next(error); // Pasar al errorHandler
        }
    }

    /**
     * POST /auth/login
     * Autenticar usuario y obtener JWT
     */
    static async login(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validación básica
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: "MISSING_FIELDS",
                        message: "Los campos email y password son requeridos",
                    },
                });
                return;
            }

            // Ejecutar caso de uso
            const loginUseCase = container.getLoginUserUseCase();
            const result = await loginUseCase.execute({ email, password });

            // Respuesta exitosa
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error); // Pasar al errorHandler
        }
    }

    /**
     * POST /auth/refresh
     * Renovar token JWT
     */
    static async refreshToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { token } = req.body;

            // Validación básica
            if (!token) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: "MISSING_TOKEN",
                        message: "El token es requerido",
                    },
                });
                return;
            }

            // Ejecutar caso de uso
            const refreshTokenUseCase = container.getRefreshTokenUseCase();
            const result = await refreshTokenUseCase.execute(token);

            // Respuesta exitosa
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            // Token inválido o expirado
            if (
                error instanceof InvalidCredentialsError ||
                (error instanceof Error && error.message.includes("invalid")) ||
                (error instanceof Error && error.message.includes("expired"))
            ) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: "INVALID_TOKEN",
                        message: "Token inválido o expirado",
                    },
                });
                return;
            }
            next(error);
        }
    }
}
