import type { ILeadRepository } from "../../../domain/repositories/ILeadRepository.ts";
import { Lead } from "../../../domain/entities/Lead.ts";
import { UnauthorizedError } from "../../../domain/errors/AuthErrors.ts";
import type { User } from "../../../domain/entities/User.ts";

export interface GetLeadsByUserDTO {
    userId?: number; // Opcional: admin puede ver leads de cualquier usuario
}

export class GetLeadsByUser {
    constructor(private leadRepository: ILeadRepository) {}

    async execute(data: GetLeadsByUserDTO, currentUser: User): Promise<Lead[]> {
        // 1. Determinar qué leads mostrar
        if (data.userId) {
            // Se solicitó ver leads de un usuario específico

            // Validar permisos: solo admin puede ver leads de otros
            if (data.userId !== currentUser.id && !currentUser.isAdmin()) {
                throw new UnauthorizedError(
                    "No tienes permiso para ver los leads de otros usuarios",
                );
            }

            return await this.leadRepository.findByUserId(data.userId);
        } else {
            // No se especificó userId

            if (currentUser.isAdmin()) {
                // Admin ve todos los leads si no se especifica userId
                return await this.leadRepository.findAll();
            } else {
                // Vendedor ve solo sus propios leads
                return await this.leadRepository.findByUserId(currentUser.id);
            }
        }
    }
}
