import type {
    ILeadRepository,
    LeadDistribution,
    VendedorRanking,
} from "../../../domain/repositories/ILeadRepository.ts";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository.ts";
import { Lead } from "../../../domain/entities/Lead.ts";
import { UnauthorizedError } from "../../../domain/errors/AuthErrors.ts";
import type { User } from "../../../domain/entities/User.ts";

export interface GlobalMetricsResponse {
    // Métricas de Leads
    totalLeads: number;
    distribucionPorEstado: LeadDistribution[];
    montoEstimadoTotal: number;
    leadsUltimos7Dias: number;
    leadsRecientes: Lead[]; // Para gráfico de evolución diaria

    // Métricas de Usuarios
    totalUsuarios: number;

    // Ranking de Vendedores
    rankingVendedores: VendedorRanking[];
}

export class GetGlobalMetrics {
    constructor(
        private leadRepository: ILeadRepository,
        private userRepository: IUserRepository,
    ) {}

    async execute(currentUser: User): Promise<GlobalMetricsResponse> {
        // 1. Validar permisos: solo admin puede ver métricas globales
        if (!currentUser.isAdmin()) {
            throw new UnauthorizedError(
                "Solo los administradores pueden ver las métricas globales",
            );
        }

        // 2. Obtener todas las métricas en paralelo para mejor performance
        const [
            totalLeads,
            distribucionPorEstado,
            montoEstimadoTotal,
            leadsUltimos7Dias,
            leadsRecientes,
            totalUsuarios,
            rankingVendedores,
        ] = await Promise.all([
            // Métricas de Leads (sin userId = globales)
            this.leadRepository.countAll(),
            this.leadRepository.getDistributionByStatus(),
            this.leadRepository.sumMontoEstimado(),
            this.leadRepository.countRecentLeads(7),
            this.leadRepository.findRecentLeads(7),

            // Métricas de Usuarios
            this.userRepository.countAll(),

            // Ranking de Vendedores
            this.leadRepository.getRankingByMontoGanado(),
        ]);

        // 3. Construir respuesta
        return {
            totalLeads,
            distribucionPorEstado,
            montoEstimadoTotal,
            leadsUltimos7Dias,
            leadsRecientes,
            totalUsuarios,
            rankingVendedores,
        };
    }
}
