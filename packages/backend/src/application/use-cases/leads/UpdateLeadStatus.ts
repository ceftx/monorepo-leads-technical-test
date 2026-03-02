import type { ILeadRepository } from "../../../domain/repositories/ILeadRepository.ts";
import { Lead } from "../../../domain/entities/Lead.ts";
import { LeadStatus } from "../../../domain/value-objects/LeadStatus.ts";
import { NotFoundError } from "../../../domain/errors/UserErrors.ts";
import { UnauthorizedError } from "../../../domain/errors/AuthErrors.ts";
import type { User } from "../../../domain/entities/User.ts";

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

        // 3. Crear nueva versión del lead con el estado actualizado
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

        // 4. Guardar en la base de datos
        return await this.leadRepository.update(updatedLead);
    }
}
