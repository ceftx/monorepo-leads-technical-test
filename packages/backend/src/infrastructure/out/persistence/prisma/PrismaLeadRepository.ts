import { PrismaClient } from "../../../../generated/prisma/index.js";
import type {
    ILeadRepository,
    VendedorRanking,
    LeadDistribution,
} from "../../../../domain/repositories/ILeadRepository.js";
import { Lead } from "../../../../domain/entities/Lead.js";
import { LeadStatus } from "../../../../domain/value-objects/LeadStatus.js";

export class PrismaLeadRepository implements ILeadRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findById(id: number): Promise<Lead | null> {
        const leadPrisma = await this.prisma.lead.findUnique({
            where: { id },
        });

        if (!leadPrisma) {
            return null;
        }

        return this.toDomain(leadPrisma);
    }

    async findByUserId(userId: number): Promise<Lead[]> {
        const leadsPrisma = await this.prisma.lead.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return leadsPrisma.map((lead) => this.toDomain(lead));
    }

    async findAll(): Promise<Lead[]> {
        const leadsPrisma = await this.prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
        });

        return leadsPrisma.map((lead) => this.toDomain(lead));
    }

    async create(lead: Lead): Promise<Lead> {
        const leadPrisma = await this.prisma.lead.create({
            data: {
                nombre: lead.nombre,
                email: lead.email.value,
                empresa: lead.empresa,
                montoEstimado: lead.montoEstimado,
                estado: lead.estado,
                userId: lead.userId,
            },
        });

        return this.toDomain(leadPrisma);
    }

    async update(lead: Lead): Promise<Lead> {
        const leadPrisma = await this.prisma.lead.update({
            where: { id: lead.id },
            data: {
                nombre: lead.nombre,
                email: lead.email.value,
                empresa: lead.empresa,
                montoEstimado: lead.montoEstimado,
                estado: lead.estado,
            },
        });

        return this.toDomain(leadPrisma);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.lead.delete({
            where: { id },
        });
    }

    // === Métricas para Dashboard ===

    async countAll(userId?: number): Promise<number> {
        if (userId) {
            return await this.prisma.lead.count({
                where: { userId },
            });
        }
        return await this.prisma.lead.count();
    }

    async getDistributionByStatus(
        userId?: number,
    ): Promise<LeadDistribution[]> {
        const distribution = userId
            ? await this.prisma.lead.groupBy({
                  by: ["estado"],
                  where: { userId },
                  _count: {
                      id: true,
                  },
              })
            : await this.prisma.lead.groupBy({
                  by: ["estado"],
                  _count: {
                      id: true,
                  },
              });

        return distribution.map((item) => ({
            estado: item.estado as LeadStatus,
            cantidad: (item._count as { id: number }).id,
        }));
    }

    async sumMontoEstimado(userId?: number): Promise<number> {
        const result = userId
            ? await this.prisma.lead.aggregate({
                  where: { userId },
                  _sum: {
                      montoEstimado: true,
                  },
              })
            : await this.prisma.lead.aggregate({
                  _sum: {
                      montoEstimado: true,
                  },
              });

        return Number(result._sum?.montoEstimado) || 0;
    }

    async countRecentLeads(days: number, userId?: number): Promise<number> {
        const date = new Date();
        date.setDate(date.getDate() - days);

        return await this.prisma.lead.count({
            where: {
                createdAt: {
                    gte: date,
                },
                ...(userId ? { userId } : {}),
            },
        });
    }

    async findRecentLeads(days: number, userId?: number): Promise<Lead[]> {
        const date = new Date();
        date.setDate(date.getDate() - days);

        const leadsPrisma = await this.prisma.lead.findMany({
            where: {
                createdAt: {
                    gte: date,
                },
                ...(userId ? { userId } : {}),
            },
            orderBy: { createdAt: "asc" },
        });

        return leadsPrisma.map((lead) => this.toDomain(lead));
    }

    async getRankingByMontoGanado(): Promise<VendedorRanking[]> {
        const ranking = await this.prisma.lead.groupBy({
            by: ["userId"],
            where: {
                estado: LeadStatus.GANADO,
            },
            _sum: {
                montoEstimado: true,
            },
            _count: {
                id: true,
            },
            orderBy: {
                _sum: {
                    montoEstimado: "desc",
                },
            },
        });

        // Obtener nombres de los vendedores
        const rankingWithNames = await Promise.all(
            ranking.map(async (item) => {
                const user = await this.prisma.user.findUnique({
                    where: { id: item.userId },
                    select: { nombre: true },
                });

                return {
                    userId: item.userId,
                    nombreVendedor: user?.nombre || "Usuario desconocido",
                    montoGanado: Number(item._sum.montoEstimado) || 0,
                    leadsGanados: item._count.id,
                };
            }),
        );

        return rankingWithNames;
    }

    /**
     * Mapea un modelo de Prisma a una entidad de Domain
     */
    private toDomain(leadPrisma: any): Lead {
        return Lead.create({
            id: leadPrisma.id,
            nombre: leadPrisma.nombre,
            email: leadPrisma.email,
            empresa: leadPrisma.empresa,
            montoEstimado: Number(leadPrisma.montoEstimado),
            estado: leadPrisma.estado as LeadStatus,
            userId: leadPrisma.userId,
            createdAt: leadPrisma.createdAt,
            updatedAt: leadPrisma.updatedAt,
        });
    }
}
