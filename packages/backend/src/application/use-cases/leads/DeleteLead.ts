import type { ILeadRepository } from "../../../domain/repositories/ILeadRepository.ts";
import { NotFoundError } from "../../../domain/errors/UserErrors.ts";
import { UnauthorizedError } from "../../../domain/errors/AuthErrors.ts";
import type { User } from "../../../domain/entities/User.ts";

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

        // 3. Eliminar de la base de datos
        await this.leadRepository.delete(data.leadId);
    }
}
