import type { Request, Response, NextFunction } from "express";
import { container } from "../../../../../shared/DependencyInjection.ts";

/**
 * Controller para métricas del dashboard
 */
export class DashboardController {
    /**
     * GET /dashboard/user
     * Obtener métricas del usuario actual
     */
    static async getUserMetrics(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            // Ejecutar caso de uso para el usuario actual
            const getUserMetricsUseCase = container.getGetUserMetricsUseCase();
            const metrics = await getUserMetricsUseCase.execute(
                {}, // Sin userId = métricas del usuario actual
                req.user!,
            );

            // Formatear respuesta
            res.status(200).json({
                success: true,
                data: {
                    metrics: {
                        ...metrics,
                        leadsRecientes: metrics.leadsRecientes.map((lead) => ({
                            id: lead.id,
                            nombre: lead.nombre,
                            email: lead.email.value,
                            empresa: lead.empresa,
                            montoEstimado: lead.montoEstimado,
                            estado: lead.estado,
                            createdAt: lead.createdAt,
                        })),
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /dashboard/user/:id
     * Obtener métricas de un usuario específico (admin only)
     */
    static async getUserMetricsById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { id } = req.params;

            // Ejecutar caso de uso
            const getUserMetricsUseCase = container.getGetUserMetricsUseCase();
            const metrics = await getUserMetricsUseCase.execute(
                {
                    userId: Number(id),
                },
                req.user!,
            );

            // Formatear respuesta
            res.status(200).json({
                success: true,
                data: {
                    metrics: {
                        ...metrics,
                        leadsRecientes: metrics.leadsRecientes.map((lead) => ({
                            id: lead.id,
                            nombre: lead.nombre,
                            email: lead.email.value,
                            empresa: lead.empresa,
                            montoEstimado: lead.montoEstimado,
                            estado: lead.estado,
                            createdAt: lead.createdAt,
                        })),
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /dashboard/global
     * Obtener métricas globales (admin only)
     */
    static async getGlobalMetrics(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            // Ejecutar caso de uso
            const getGlobalMetricsUseCase =
                container.getGetGlobalMetricsUseCase();
            const metrics = await getGlobalMetricsUseCase.execute(req.user!);

            // Formatear respuesta
            res.status(200).json({
                success: true,
                data: {
                    metrics: {
                        ...metrics,
                        leadsRecientes: metrics.leadsRecientes.map((lead) => ({
                            id: lead.id,
                            nombre: lead.nombre,
                            email: lead.email.value,
                            empresa: lead.empresa,
                            montoEstimado: lead.montoEstimado,
                            estado: lead.estado,
                            createdAt: lead.createdAt,
                        })),
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
