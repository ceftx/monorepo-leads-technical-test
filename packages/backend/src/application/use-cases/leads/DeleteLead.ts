import type { ILeadRepository } from "../../../domain/repositories/ILeadRepository.ts";
import { NotFoundError } from "../../../domain/errors/UserErrors.ts";
import { UnauthorizedError } from "../../../domain/errors/AuthErrors.ts";
import type { User } from "../../../domain/entities/User.ts";
import { container } from "../../../shared/DependencyInjection.ts";

export interface DeleteLeadDTO {
    leadId: number;
}

export class DeleteLead {
    constructor(private leadRepository: ILeadRepository) {}

    async execute(data: DeleteLeadDTO, currentUser: User): Promise<void> {
        // 1. Buscar el lead
        const lead = await this.leadRepository.findById(data.leadId);
        if (!lead) {
            throw new NotFoundError("Lead", data.leadId);
        }

        // 2. Validar permisos usando el método del dominio
        if (!currentUser.canAccessLead(lead.userId)) {
            throw new UnauthorizedError(
                "No tienes permiso para eliminar este lead",
            );
        }

        // 3. Guardar información del lead para la notificación
        const leadInfo = {
            id: lead.id,
            nombre: lead.nombre,
            empresa: lead.empresa,
            userId: lead.userId,
        };

        // 4. Eliminar de la base de datos
        await this.leadRepository.delete(data.leadId);

        // 5. Enviar notificación
        const notificationService = container.getNotificationService();
        if (notificationService) {
            await notificationService.notifyLeadDeleted(
                leadInfo.id,
                leadInfo.nombre,
                leadInfo.empresa,
                leadInfo.userId,
                {
                    id: currentUser.id,
                    nombre: currentUser.nombre,
                },
            );
        }
    }
}
