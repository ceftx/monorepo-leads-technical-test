import type { Request, Response, NextFunction } from "express";
import { container } from "../../../../../shared/DependencyInjection.ts";

/**
 * Controller para gestión de usuarios (solo admin)
 */
export class UserController {
    /**
     * GET /users
     * Listar todos los usuarios
     */
    static async list(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userRepository = container.getUserRepository();
            const users = await userRepository.findAll();

            // Respuesta exitosa (sin passwords)
            res.status(200).json({
                success: true,
                data: {
                    users: users.map((user) => ({
                        id: user.id,
                        email: user.email.value,
                        nombre: user.nombre,
                        rol: user.rol,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    })),
                    total: users.length,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /users/:id
     * Eliminar un usuario (admin only)
     */
    static async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { id } = req.params;
            const userId = Number(id);

            // Validar que no intente borrarse a sí mismo
            if (req.user!.id === userId) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: "CANNOT_DELETE_SELF",
                        message: "No puedes eliminar tu propio usuario",
                    },
                });
                return;
            }

            // Verificar que el usuario existe
            const userRepository = container.getUserRepository();
            const user = await userRepository.findById(userId);

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: "NOT_FOUND",
                        message: `Usuario con id ${id} no encontrado`,
                    },
                });
                return;
            }

            // Eliminar usuario (los leads se eliminan en cascade)
            await userRepository.delete(userId);

            // Respuesta exitosa (204 No Content)
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
