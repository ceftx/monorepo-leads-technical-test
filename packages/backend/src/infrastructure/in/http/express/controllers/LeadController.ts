import type { Request, Response, NextFunction } from "express";
import { container } from "../../../../../shared/DependencyInjection.ts";
import { LeadStatus } from "../../../../../domain/value-objects/LeadStatus.ts";

/**
 * Controller para gestión de leads
 */
export class LeadController {
    /**
     * POST /leads
     * Crear un nuevo lead
     */
    static async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { nombre, email, empresa, montoEstimado, userId } = req.body;

            // Validación básica
            if (!nombre || !email || !empresa || montoEstimado === undefined) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: "MISSING_FIELDS",
                        message:
                            "Los campos nombre, email, empresa y montoEstimado son requeridos",
                    },
                });
                return;
            }

            // Ejecutar caso de uso
            const createLeadUseCase = container.getCreateLeadUseCase();
            const dto: any = {
                nombre,
                email,
                empresa,
                montoEstimado: Number(montoEstimado),
            };
            if (userId) {
                dto.userId = Number(userId);
            }
            const lead = await createLeadUseCase.execute(
                dto,
                req.user!, // Usuario autenticado (garantizado por authMiddleware)
            );

            // Respuesta exitosa
            res.status(201).json({
                success: true,
                data: {
                    lead: {
                        id: lead.id,
                        nombre: lead.nombre,
                        email: lead.email.value,
                        empresa: lead.empresa,
                        montoEstimado: lead.montoEstimado,
                        estado: lead.estado,
                        userId: lead.userId,
                        createdAt: lead.createdAt,
                        updatedAt: lead.updatedAt,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /leads
     * Listar leads (propios o todos si es admin)
     */
    static async list(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { userId } = req.query;

            // Ejecutar caso de uso
            const getLeadsUseCase = container.getGetLeadsByUserUseCase();
            const dto: any = {};
            if (userId) {
                dto.userId = Number(userId);
            }
            const leads = await getLeadsUseCase.execute(dto, req.user!);

            // Respuesta exitosa
            res.status(200).json({
                success: true,
                data: {
                    leads: leads.map((lead) => ({
                        id: lead.id,
                        nombre: lead.nombre,
                        email: lead.email.value,
                        empresa: lead.empresa,
                        montoEstimado: lead.montoEstimado,
                        estado: lead.estado,
                        userId: lead.userId,
                        createdAt: lead.createdAt,
                        updatedAt: lead.updatedAt,
                    })),
                    total: leads.length,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /leads/:id
     * Obtener un lead específico
     */
    static async getById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { id } = req.params;

            // Buscar lead
            const leadRepository = container.getLeadRepository();
            const lead = await leadRepository.findById(Number(id));

            if (!lead) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: "NOT_FOUND",
                        message: `Lead con id ${id} no encontrado`,
                    },
                });
                return;
            }

            // Validar permisos
            if (!req.user!.canAccessLead(lead.userId)) {
                res.status(403).json({
                    success: false,
                    error: {
                        code: "FORBIDDEN",
                        message: "No tienes permiso para acceder a este lead",
                    },
                });
                return;
            }

            // Respuesta exitosa
            res.status(200).json({
                success: true,
                data: {
                    lead: {
                        id: lead.id,
                        nombre: lead.nombre,
                        email: lead.email.value,
                        empresa: lead.empresa,
                        montoEstimado: lead.montoEstimado,
                        estado: lead.estado,
                        userId: lead.userId,
                        createdAt: lead.createdAt,
                        updatedAt: lead.updatedAt,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /leads/:id/status
     * Actualizar estado de un lead
     */
    static async updateStatus(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            // Validación básica
            if (!estado) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: "MISSING_FIELDS",
                        message: "El campo estado es requerido",
                    },
                });
                return;
            }

            // Validar que el estado es válido
            if (!Object.values(LeadStatus).includes(estado as LeadStatus)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: "INVALID_STATUS",
                        message: `Estado inválido. Valores permitidos: ${Object.values(LeadStatus).join(", ")}`,
                    },
                });
                return;
            }

            // Ejecutar caso de uso
            const updateStatusUseCase = container.getUpdateLeadStatusUseCase();
            const lead = await updateStatusUseCase.execute(
                {
                    leadId: Number(id),
                    nuevoEstado: estado as LeadStatus,
                },
                req.user!,
            );

            // Respuesta exitosa
            res.status(200).json({
                success: true,
                data: {
                    lead: {
                        id: lead.id,
                        nombre: lead.nombre,
                        email: lead.email.value,
                        empresa: lead.empresa,
                        montoEstimado: lead.montoEstimado,
                        estado: lead.estado,
                        userId: lead.userId,
                        createdAt: lead.createdAt,
                        updatedAt: lead.updatedAt,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /leads/:id
     * Eliminar un lead
     */
    static async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { id } = req.params;

            // Ejecutar caso de uso
            const deleteLeadUseCase = container.getDeleteLeadUseCase();
            await deleteLeadUseCase.execute(
                {
                    leadId: Number(id),
                },
                req.user!,
            );

            // Respuesta exitosa (204 No Content)
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
