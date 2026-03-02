import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";

/**
 * SocketServer - Servidor WebSocket con Socket.IO
 *
 * Responsabilidades:
 * 1. Configurar servidor Socket.IO
 * 2. Autenticar conexiones con JWT
 * 3. Gestionar rooms por usuario
 * 4. Emitir notificaciones a usuarios específicos
 */
export class SocketServer {
    private io: SocketIOServer;
    private userSockets: Map<number, Set<string>>; // userId -> Set de socketIds

    constructor(httpServer: HTTPServer, corsOrigin: string) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: corsOrigin,
                credentials: true,
            },
        });

        this.userSockets = new Map();
        this.setupMiddleware();
        this.setupConnectionHandlers();

        console.log("✅ WebSocket Server configurado");
    }

    /**
     * Middleware de autenticación JWT
     */
    private setupMiddleware(): void {
        this.io.use((socket: Socket, next) => {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(
                    new Error("Authentication error: No token provided"),
                );
            }

            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_SECRET || "secret",
                ) as { userId: number; email: string; rol: string };

                // Agregar datos del usuario al socket
                socket.data.userId = decoded.userId;
                socket.data.email = decoded.email;
                socket.data.rol = decoded.rol;

                next();
            } catch (error) {
                next(new Error("Authentication error: Invalid token"));
            }
        });
    }

    /**
     * Configurar handlers de conexión
     */
    private setupConnectionHandlers(): void {
        this.io.on("connection", (socket: Socket) => {
            const userId = socket.data.userId;
            const userEmail = socket.data.email;

            console.log(`🔌 Usuario conectado: ${userEmail} (ID: ${userId})`);

            // Agregar socket al tracking de usuario
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId)!.add(socket.id);

            // Unirse a room personal
            socket.join(`user:${userId}`);

            // Handler de desconexión
            socket.on("disconnect", () => {
                console.log(
                    `❌ Usuario desconectado: ${userEmail} (ID: ${userId})`,
                );

                // Remover socket del tracking
                const sockets = this.userSockets.get(userId);
                if (sockets) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) {
                        this.userSockets.delete(userId);
                    }
                }
            });

            // Handler para marcar notificación como leída
            socket.on("notification:read", (notificationId: number) => {
                console.log(
                    `✓ Notificación ${notificationId} marcada como leída por usuario ${userId}`,
                );
            });

            // Enviar mensaje de bienvenida
            socket.emit("connected", {
                message: "Conectado al servidor de notificaciones",
                userId,
            });
        });
    }

    /**
     * Emitir notificación a un usuario específico
     */
    emitToUser(userId: number, event: string, data: any): void {
        this.io.to(`user:${userId}`).emit(event, data);
    }

    /**
     * Emitir notificación a todos los usuarios conectados
     */
    emitToAll(event: string, data: any): void {
        this.io.emit(event, data);
    }

    /**
     * Obtener servidor Socket.IO (para acceso externo)
     */
    getIO(): SocketIOServer {
        return this.io;
    }

    /**
     * Verificar si un usuario está conectado
     */
    isUserConnected(userId: number): boolean {
        return (
            this.userSockets.has(userId) &&
            this.userSockets.get(userId)!.size > 0
        );
    }

    /**
     * Obtener cantidad de usuarios conectados
     */
    getConnectedUsersCount(): number {
        return this.userSockets.size;
    }
}
