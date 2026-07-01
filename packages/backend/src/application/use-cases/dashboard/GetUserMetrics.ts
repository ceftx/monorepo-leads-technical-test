import type {
    ILeadRepository,
    LeadDistribution,
} from "../../../domain/repositories/ILeadRepository.ts";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.ts";
import { Lead } from "../../../domain/entities/Lead.ts";
import { NotFoundError } from "../../../domain/errors/UserErrors.ts";
import { UnauthorizedError } from "../../../domain/errors/AuthErrors.ts";
import type { User } from "../../../domain/entities/User.ts";

export interface GetUserMetricsDTO {
    userId?: number; // Opcional: admin puede consultar métricas de cualquier vendedor
}

export interface UserMetricsResponse {
    userId: number;
    nombreUsuario: string;
    totalLeads: number;
    distribucionPorEstado: LeadDistribution[];
    montoEstimadoTotal: number;
    leadsUltimos7Dias: number;
    leadsRecientes: Lead[]; // Para gráfico de evolución diaria
}

export class GetUserMetrics {
    constructor(
        private leadRepository: ILeadRepository,
        private userRepository: IUserRepository,
    ) {}

    async execute(
        data: GetUserMetricsDTO,
        currentUser: User,
    ): Promise<UserMetricsResponse> {
        // 1. Determinar de quién obtener las métricas
        let targetUserId: number;

        if (data.userId) {
            // Se solicitan métricas de un usuario específico

            // Validar permisos: solo admin puede ver métricas de otros
            if (data.userId !== currentUser.id && !currentUser.isAdmin()) {
                throw new UnauthorizedError(
                    "No tienes permiso para ver las métricas de otros usuarios",
                );
            }

            // Validar que el usuario existe
            const targetUser = await this.userRepository.findById(data.userId);
            if (!targetUser) {
                throw new NotFoundError("Usuario", data.userId);
            }

            targetUserId = data.userId;
        } else {
            // No se especificó userId, usar el del usuario actual
            targetUserId = currentUser.id;
        }

        // 2. Obtener el usuario para mostrar su nombre
        const user = await this.userRepository.findById(targetUserId);
        if (!user) {
            throw new NotFoundError("Usuario", targetUserId);
        }

        // 3. Obtener todas las métricas en paralelo para mejor performance
        const [
            totalLeads,
            distribucionPorEstado,
            montoEstimadoTotal,
            leadsUltimos7Dias,
            leadsRecientes,
        ] = await Promise.all([
            this.leadRepository.countAll(targetUserId),
            this.leadRepository.getDistributionByStatus(targetUserId),
            this.leadRepository.sumMontoEstimado(targetUserId),
            this.leadRepository.countRecentLeads(7, targetUserId),
            this.leadRepository.findRecentLeads(7, targetUserId),
        ]);

        // 4. Construir respuesta
        return {
            userId: targetUserId,
            nombreUsuario: user.nombre,
            totalLeads,
            distribucionPorEstado,
            montoEstimadoTotal,
            leadsUltimos7Dias,
            leadsRecientes,
        };
    }
}
