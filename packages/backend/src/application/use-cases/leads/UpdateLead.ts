import type { ILeadRepository } from "../../../domain/repositories/ILeadRepository.js";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { Lead } from "../../../domain/entities/Lead.js";
import { container } from "../../../shared/DependencyInjection.js";

interface UpdateLeadInput {
    id: number;
    nombre: string;
    email: string;
    empresa: string;
    montoEstimado: number;
    updaterId: number;
}

export class UpdateLead {
    constructor(
        private leadRepository: ILeadRepository,
        private userRepository: IUserRepository,
    ) {}

    async execute(input: UpdateLeadInput): Promise<Lead> {
        // Validar que el lead existe
        const existingLead = await this.leadRepository.findById(input.id);
        if (!existingLead) {
            throw new Error("Lead no encontrado");
        }

        // Validar que el updater existe
        const updater = await this.userRepository.findById(input.updaterId);
        if (!updater) {
            throw new Error("Usuario no encontrado");
        }

        // Validar permisos: solo el owner o un admin puede actualizar
        const isAdmin = updater.rol.toString() === "ADMIN";
        const isOwner = existingLead.userId === updater.id;

        if (!isAdmin && !isOwner) {
            throw new Error("No tienes permisos para actualizar este lead");
        }

        // Crear nuevo Lead con datos actualizados (inmutabilidad)
        const updatedLead = Lead.create({
            id: existingLead.id,
            nombre: input.nombre,
            email: input.email,
            empresa: input.empresa,
            montoEstimado: input.montoEstimado,
            estado: existingLead.estado, // Estado no cambia en update básico
            userId: existingLead.userId,
            createdAt: existingLead.createdAt,
            updatedAt: new Date(),
        });

        // Guardar cambios
        await this.leadRepository.update(updatedLead);

        // Notificar cambios
        const notificationService = container.getNotificationService();
        if (notificationService) {
            await notificationService.notifyLeadCreated(updatedLead, updater);
        }

        return updatedLead;
    }
}
