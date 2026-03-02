import type { ILeadRepository } from "../../../domain/repositories/ILeadRepository.ts";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.ts";
import { Lead } from "../../../domain/entities/Lead.ts";
import { LeadStatus } from "../../../domain/value-objects/LeadStatus.ts";
import { NotFoundError } from "../../../domain/errors/UserErrors.ts";
import { UnauthorizedError } from "../../../domain/errors/AuthErrors.ts";
import type { User } from "../../../domain/entities/User.ts";
import { container } from "../../../shared/DependencyInjection.ts";

export interface CreateLeadDTO {
    nombre: string;
    email: string;
    empresa: string;
    montoEstimado: number;
    userId?: number; // Opcional: admin puede asignar a otro vendedor
}

export class CreateLead {
    constructor(
        private leadRepository: ILeadRepository,
        private userRepository: IUserRepository,
    ) {}

    async execute(data: CreateLeadDTO, currentUser: User): Promise<Lead> {
        // 1. Determinar a quién se asigna el lead
        let assignedUserId: number;

        if (data.userId) {
            // Admin puede asignar a cualquier vendedor
            if (!currentUser.isAdmin()) {
                throw new UnauthorizedError(
                    "Solo los administradores pueden asignar leads a otros usuarios",
                );
            }

            // Validar que el usuario asignado existe
            const targetUser = await this.userRepository.findById(data.userId);
            if (!targetUser) {
                throw new NotFoundError("Usuario", data.userId);
            }

            assignedUserId = data.userId;
        } else {
            // Asignar al usuario actual
            assignedUserId = currentUser.id;
        }

        // 2. Crear la entidad Lead (Domain valida estructura)
        const lead = Lead.create({
            id: 0, // Temporal, Prisma lo genera
            nombre: data.nombre,
            email: data.email,
            empresa: data.empresa,
            montoEstimado: data.montoEstimado,
            estado: LeadStatus.NUEVO, // Estado inicial siempre NUEVO
            userId: assignedUserId,
        });

        // 3. Guardar en la base de datos
        const createdLead = await this.leadRepository.create(lead);

        // 4. Enviar notificación
        const notificationService = container.getNotificationService();
        if (notificationService) {
            await notificationService.notifyLeadCreated(
                createdLead,
                currentUser,
            );
        }

        return createdLead;
    }
}
