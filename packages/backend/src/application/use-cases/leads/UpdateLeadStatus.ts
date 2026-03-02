import type { ILeadRepository } from "../../../domain/repositories/ILeadRepository.ts";
import { Lead } from "../../../domain/entities/Lead.ts";
import { LeadStatus } from "../../../domain/value-objects/LeadStatus.ts";
import { NotFoundError } from "../../../domain/errors/UserErrors.ts";
import { UnauthorizedError } from "../../../domain/errors/AuthErrors.ts";
import type { User } from "../../../domain/entities/User.ts";
import { container } from "../../../shared/DependencyInjection.ts";

export interface UpdateLeadStatusDTO {
    leadId: number;
    nuevoEstado: LeadStatus;
}

export class UpdateLeadStatus {
    constructor(private leadRepository: ILeadRepository) {}

    async execute(data: UpdateLeadStatusDTO, currentUser: User): Promise<Lead> {
        // 1. Buscar el lead
        const lead = await this.leadRepository.findById(data.leadId);
        if (!lead) {
            throw new NotFoundError("Lead", data.leadId);
        }

        // 2. Validar permisos usando el método del dominio
        if (!currentUser.canAccessLead(lead.userId)) {
            throw new UnauthorizedError(
                "No tienes permiso para actualizar este lead",
            );
        }

        // 3. Guardar el estado anterior para la notificación
        const oldStatus = lead.estado;

        // 4. Crear nueva versión del lead con el estado actualizado
        const updatedLead = Lead.create({
            id: lead.id,
            nombre: lead.nombre,
            email: lead.email.value,
            empresa: lead.empresa,
            montoEstimado: lead.montoEstimado,
            estado: data.nuevoEstado, // ← Estado actualizado
            userId: lead.userId,
            createdAt: lead.createdAt,
            updatedAt: new Date(), // Prisma lo actualiza automáticamente
        });

        // 5. Guardar en la base de datos
        const savedLead = await this.leadRepository.update(updatedLead);

        // 6. Enviar notificación
        const notificationService = container.getNotificationService();
        if (notificationService) {
            await notificationService.notifyLeadStatusChanged(
                {
                    id: savedLead.id,
                    nombre: savedLead.nombre,
                    empresa: savedLead.empresa,
                    montoEstimado: savedLead.montoEstimado,
                    userId: savedLead.userId,
                    estado: savedLead.estado,
                },
                oldStatus,
                {
                    id: currentUser.id,
                    nombre: currentUser.nombre,
                },
            );
        }

        return savedLead;
    }
}
