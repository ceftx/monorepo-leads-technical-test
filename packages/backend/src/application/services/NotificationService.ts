import {
    PrismaClient,
    NotificationType,
} from "../../generated/prisma/index.js";

/**
 * NotificationService - Servicio centralizado para gestión de notificaciones
 *
 * Responsabilidades:
 * 1. Crear notificaciones en la base de datos
 * 2. Determinar quién debe recibir notificaciones
 * 3. Emitir eventos para WebSocket
 * 4. Formatear mensajes de notificación
 */

interface LeadData {
    id: number;
    nombre: string;
    empresa: string;
    montoEstimado: number | string;
    userId: number;
    estado?: string;
}

interface UserData {
    id: number;
    nombre: string;
}

export class NotificationService {
    private prisma: PrismaClient;
    private socketEmitter?: (event: string, data: any) => void;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    /**
     * Configurar emisor de eventos WebSocket
     */
    setSocketEmitter(emitter: (event: string, data: any) => void): void {
        this.socketEmitter = emitter;
    }

    /**
     * Notificar creación de lead
     */
    async notifyLeadCreated(lead: LeadData, creator: UserData): Promise<void> {
        const message = `Nuevo lead: ${lead.nombre} - ${lead.empresa} ($${lead.montoEstimado})`;

        // Obtener todos los admins
        const admins = await this.prisma.user.findMany({
            where: { rol: "ADMIN" },
        });

        // Agregar al owner del lead si es vendedor
        const recipients = [...admins];
        const leadOwner = await this.prisma.user.findUnique({
            where: { id: lead.userId },
        });

        // Si el owner es vendedor y no está en la lista (no es admin), agregarlo
        if (
            leadOwner &&
            leadOwner.rol === "VENDEDOR" &&
            !recipients.find((r) => r.id === leadOwner.id)
        ) {
            recipients.push(leadOwner);
        }

        // Crear notificaciones
        const notifications = await Promise.all(
            recipients.map((recipient) =>
                this.prisma.notification.create({
                    data: {
                        userId: recipient.id,
                        type: NotificationType.LEAD_CREATED,
                        message,
                        data: {
                            leadId: lead.id,
                            leadName: lead.nombre,
                            empresa: lead.empresa,
                            monto: lead.montoEstimado.toString(),
                            creatorId: creator.id,
                            creatorName: creator.nombre,
                        },
                    },
                }),
            ),
        );

        // Emitir evento WebSocket
        if (this.socketEmitter) {
            notifications.forEach((notification) => {
                this.socketEmitter!("notification", {
                    userId: notification.userId,
                    notification,
                });
            });
        }
    }

    /**
     * Notificar cambio de estado de lead
     */
    async notifyLeadStatusChanged(
        lead: LeadData,
        oldStatus: string,
        updater: UserData,
    ): Promise<void> {
        const statusEmoji = {
            NUEVO: "🆕",
            CONTACTADO: "📞",
            GANADO: "🎉",
            PERDIDO: "❌",
        };

        const newStatus = lead.estado || "DESCONOCIDO";
        const emoji = (statusEmoji as any)[newStatus] || "";
        const message = `Lead ${lead.nombre}: ${oldStatus} → ${newStatus} ${emoji}`;

        // Obtener todos los admins
        const admins = await this.prisma.user.findMany({
            where: { rol: "ADMIN" },
        });

        // Agregar al owner del lead si es vendedor
        const recipients = [...admins];
        const leadOwner = await this.prisma.user.findUnique({
            where: { id: lead.userId },
        });

        // Si el owner es vendedor y no está en la lista (no es admin), agregarlo
        if (
            leadOwner &&
            leadOwner.rol === "VENDEDOR" &&
            !recipients.find((r) => r.id === leadOwner.id)
        ) {
            recipients.push(leadOwner);
        }

        // Crear notificaciones
        const notifications = await Promise.all(
            recipients.map((recipient) =>
                this.prisma.notification.create({
                    data: {
                        userId: recipient.id,
                        type: NotificationType.LEAD_STATUS_CHANGED,
                        message,
                        data: {
                            leadId: lead.id,
                            leadName: lead.nombre,
                            empresa: lead.empresa,
                            oldStatus,
                            newStatus: lead.estado,
                            updaterId: updater.id,
                            updaterName: updater.nombre,
                        },
                    },
                }),
            ),
        );

        // Emitir evento WebSocket
        if (this.socketEmitter) {
            notifications.forEach((notification) => {
                this.socketEmitter!("notification", {
                    userId: notification.userId,
                    notification,
                });
            });
        }
    }

    /**
     * Notificar eliminación de lead
     */
    async notifyLeadDeleted(
        leadId: number,
        leadName: string,
        empresa: string,
        leadOwnerId: number,
        deleter: UserData,
    ): Promise<void> {
        const message = `Lead eliminado: ${leadName} - ${empresa}`;

        // Obtener todos los admins
        const admins = await this.prisma.user.findMany({
            where: { rol: "ADMIN" },
        });

        // Agregar al owner del lead si es vendedor
        const recipients = [...admins];
        const leadOwner = await this.prisma.user.findUnique({
            where: { id: leadOwnerId },
        });

        // Si el owner es vendedor y no está en la lista (no es admin), agregarlo
        if (
            leadOwner &&
            leadOwner.rol === "VENDEDOR" &&
            !recipients.find((r) => r.id === leadOwner.id)
        ) {
            recipients.push(leadOwner);
        }

        // Crear notificaciones
        const notifications = await Promise.all(
            recipients.map((recipient) =>
                this.prisma.notification.create({
                    data: {
                        userId: recipient.id,
                        type: NotificationType.LEAD_DELETED,
                        message,
                        data: {
                            leadId,
                            leadName,
                            empresa,
                            deleterId: deleter.id,
                            deleterName: deleter.nombre,
                        },
                    },
                }),
            ),
        );

        // Emitir evento WebSocket
        if (this.socketEmitter) {
            notifications.forEach((notification) => {
                this.socketEmitter!("notification", {
                    userId: notification.userId,
                    notification,
                });
            });
        }
    }

    /**
     * Obtener notificaciones de un usuario
     */
    async getUserNotifications(
        userId: number,
        limit: number = 20,
    ): Promise<any[]> {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }

    /**
     * Marcar notificación como leída
     */
    async markAsRead(notificationId: number): Promise<void> {
        await this.prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
    }

    /**
     * Marcar todas las notificaciones de un usuario como leídas
     */
    async markAllAsRead(userId: number): Promise<void> {
        await this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }

    /**
     * Contar notificaciones no leídas
     */
    async countUnread(userId: number): Promise<number> {
        return this.prisma.notification.count({
            where: { userId, read: false },
        });
    }
}
