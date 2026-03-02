import type { Request, Response, NextFunction } from "express";
import { container } from "../../../../../shared/DependencyInjection.ts";

/**
 * Middleware de autenticación JWT
 *
 * Responsabilidades:
 * 1. Extraer token del header Authorization
 * 2. Verificar el token con JwtService
 * 3. Buscar el usuario en la base de datos
 * 4. Agregar el usuario a req.user
 * 5. Llamar a next() para continuar con el siguiente middleware/controller
 *
 * Si falla en cualquier paso, retorna 401 Unauthorized
 */
export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        // 1. Extraer token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                error: {
                    code: "NO_TOKEN",
                    message: "No se proporcionó un token de autenticación",
                },
            });
            return;
        }

        // Formato esperado: "Bearer TOKEN"
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_TOKEN_FORMAT",
                    message:
                        "Formato de token inválido. Use: Authorization: Bearer TOKEN",
                },
            });
            return;
        }

        const token = parts[1];

        // 2. Verificar el token
        const jwtService = container.getJwtService();
        let payload;

        try {
            payload = jwtService.verify(token!);
        } catch (error) {
            res.status(401).json({
                success: false,
                error: {
                    code: "INVALID_TOKEN",
                    message: "Token inválido o expirado",
                },
            });
            return;
        }

        // 3. Buscar el usuario en la base de datos
        const userRepository = container.getUserRepository();
        const user = await userRepository.findById(payload.userId);

        if (!user) {
            res.status(401).json({
                success: false,
                error: {
                    code: "USER_NOT_FOUND",
                    message: "El usuario asociado al token no existe",
                },
            });
            return;
        }

        // 4. Agregar usuario a la request
        req.user = user;

        // 5. Continuar con el siguiente middleware/controller
        next();
    } catch (error) {
        // Error inesperado
        console.error("Error en authMiddleware:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: "Error interno en la autenticación",
            },
        });
    }
};
