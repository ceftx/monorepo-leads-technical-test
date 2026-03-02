import { Lead } from "../entities/Lead.ts";
import { LeadStatus } from "../value-objects/LeadStatus.ts";

/**
 * Tipo para el ranking de vendedores por monto ganado
 */
export interface VendedorRanking {
    userId: number;
    nombreVendedor: string;
    montoGanado: number;
    leadsGanados: number;
}

/**
 * Tipo para la distribución de leads por estado
 */
export interface LeadDistribution {
    estado: LeadStatus;
    cantidad: number;
}

export interface ILeadRepository {
    // === Búsquedas ===
    findById(id: number): Promise<Lead | null>;
    findByUserId(userId: number): Promise<Lead[]>;
    findAll(): Promise<Lead[]>;

    // === Escritura ===
    create(lead: Lead): Promise<Lead>;
    update(lead: Lead): Promise<Lead>;
    delete(id: number): Promise<void>;

    // === Métricas para Dashboard ===

    // 1. Total de leads (global o por vendedor)
    countAll(userId?: number): Promise<number>;

    // 2. Distribución de leads por estado
    // Retorna un array con la cantidad de leads en cada estado
    getDistributionByStatus(userId?: number): Promise<LeadDistribution[]>;

    // 3. Monto estimado total acumulado
    sumMontoEstimado(userId?: number): Promise<number>;

    // 4. Leads creados en los últimos N días
    countRecentLeads(days: number, userId?: number): Promise<number>;

    // Retorna los leads completos (para mostrar evolución diaria)
    findRecentLeads(days: number, userId?: number): Promise<Lead[]>;

    // 5. Ranking de vendedores por monto ganado
    // Solo retorna vendedores con leads en estado GANADO
    getRankingByMontoGanado(): Promise<VendedorRanking[]>;
}
