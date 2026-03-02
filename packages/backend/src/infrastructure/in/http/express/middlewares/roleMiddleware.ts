import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../../../../../domain/value-objects/UserRole.ts";

/**
 * Middleware de autorización por rol
 *
 * Factory function que retorna un middleware que valida si el usuario
 * tiene el rol requerido.
 *
 * IMPORTANTE: Debe usarse DESPUÉS de authMiddleware, ya que requiere req.user
 *
 * Uso:
 * router.delete('/users/:id', authMiddleware, roleMiddleware(UserRole.ADMIN), controller)
 */
export const roleMiddleware = (requiredRole: UserRole) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // 1. Verificar que el usuario existe (debe estar seteado por authMiddleware)
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: {
                    code: "NOT_AUTHENTICATED",
                    message:
                        "Usuario no autenticado. Asegúrate de usar authMiddleware antes de roleMiddleware",
                },
            });
            return;
        }

        // 2. Verificar que el usuario tiene el rol requerido
        if (req.user.rol !== requiredRole) {
            res.status(403).json({
                success: false,
                error: {
                    code: "INSUFFICIENT_PERMISSIONS",
                    message: `Se requiere el rol ${requiredRole} para acceder a este recurso`,
                    details: {
                        requiredRole,
                        userRole: req.user.rol,
                    },
                },
            });
            return;
        }

        // 3. Usuario tiene el rol correcto, continuar
        next();
    };
};

/**
 * Middleware que permite acceso solo a ADMIN
 */
export const adminOnly = roleMiddleware(UserRole.ADMIN);

/**
 * Middleware que permite acceso solo a VENDEDOR
 */
export const vendedorOnly = roleMiddleware(UserRole.VENDEDOR);
