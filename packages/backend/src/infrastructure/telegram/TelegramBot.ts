import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "../../generated/prisma/index.js";

/**
 * TelegramBotService - Bot de Telegram para consultas del sistema
 *
 * Comandos disponibles:
 * /start - Mensaje de bienvenida
 * /stats - Estadísticas generales del sistema
 * /users - Total de usuarios
 * /leads - Total de leads y últimos 7 días
 * /monto - Monto estimado total
 * /ranking - Ranking de vendedores
 * /help - Lista de comandos
 */
export class TelegramBotService {
    private bot: TelegramBot;
    private prisma: PrismaClient;

    constructor(token: string, prisma: PrismaClient) {
        this.bot = new TelegramBot(token, { polling: true });
        this.prisma = prisma;

        this.setupCommands();
        console.log("✅ Telegram Bot configurado y activo");
    }

    /**
     * Configurar todos los comandos del bot
     */
    private setupCommands(): void {
        // Comando /start
        this.bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            const username =
                msg.from?.username || msg.from?.first_name || "Usuario";

            this.bot.sendMessage(
                chatId,
                `👋 ¡Hola ${username}! Bienvenido al Bot de Leads Management.\n\n` +
                    `Comandos disponibles:\n` +
                    `/stats - Ver estadísticas generales\n` +
                    `/users - Total de usuarios registrados\n` +
                    `/leads - Información de leads\n` +
                    `/monto - Monto estimado total\n` +
                    `/ranking - Ranking de vendedores\n` +
                    `/help - Ver esta ayuda`,
            );
        });

        // Comando /help
        this.bot.onText(/\/help/, (msg) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(
                chatId,
                `📚 *Comandos disponibles:*\n\n` +
                    `• /stats - Estadísticas completas del sistema\n` +
                    `• /users - Cantidad total de usuarios\n` +
                    `• /leads - Total de leads y creados en últimos 7 días\n` +
                    `• /monto - Monto estimado total de todos los leads\n` +
                    `• /ranking - Top vendedores por leads ganados\n` +
                    `• /help - Mostrar esta ayuda`,
                { parse_mode: "Markdown" },
            );
        });

        // Comando /users
        this.bot.onText(/\/users/, async (msg) => {
            const chatId = msg.chat.id;

            try {
                const totalUsers = await this.prisma.user.count();
                const admins = await this.prisma.user.count({
                    where: { rol: "ADMIN" },
                });
                const vendedores = await this.prisma.user.count({
                    where: { rol: "VENDEDOR" },
                });

                this.bot.sendMessage(
                    chatId,
                    `👥 *Usuarios del Sistema*\n\n` +
                        `Total: ${totalUsers}\n` +
                        `• Administradores: ${admins}\n` +
                        `• Vendedores: ${vendedores}`,
                    { parse_mode: "Markdown" },
                );
            } catch (error) {
                console.error("Error en /users:", error);
                this.bot.sendMessage(
                    chatId,
                    "❌ Error al obtener información de usuarios.",
                );
            }
        });

        // Comando /leads
        this.bot.onText(/\/leads/, async (msg) => {
            const chatId = msg.chat.id;

            try {
                const totalLeads = await this.prisma.lead.count();

                // Leads de los últimos 7 días
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const recentLeads = await this.prisma.lead.count({
                    where: {
                        createdAt: {
                            gte: sevenDaysAgo,
                        },
                    },
                });

                // Por estado
                const nuevo = await this.prisma.lead.count({
                    where: { estado: "NUEVO" },
                });
                const contactado = await this.prisma.lead.count({
                    where: { estado: "CONTACTADO" },
                });
                const ganado = await this.prisma.lead.count({
                    where: { estado: "GANADO" },
                });
                const perdido = await this.prisma.lead.count({
                    where: { estado: "PERDIDO" },
                });

                this.bot.sendMessage(
                    chatId,
                    `📊 *Leads del Sistema*\n\n` +
                        `Total: ${totalLeads}\n` +
                        `Últimos 7 días: ${recentLeads}\n\n` +
                        `*Por Estado:*\n` +
                        `🆕 Nuevo: ${nuevo}\n` +
                        `📞 Contactado: ${contactado}\n` +
                        `🎉 Ganado: ${ganado}\n` +
                        `❌ Perdido: ${perdido}`,
                    { parse_mode: "Markdown" },
                );
            } catch (error) {
                console.error("Error en /leads:", error);
                this.bot.sendMessage(
                    chatId,
                    "❌ Error al obtener información de leads.",
                );
            }
        });

        // Comando /monto
        this.bot.onText(/\/monto/, async (msg) => {
            const chatId = msg.chat.id;

            try {
                const leads = await this.prisma.lead.findMany({
                    select: { montoEstimado: true, estado: true },
                });

                const montoTotal = leads.reduce(
                    (sum, lead) => sum + Number(lead.montoEstimado),
                    0,
                );

                const montoGanado = leads
                    .filter((lead) => lead.estado === "GANADO")
                    .reduce((sum, lead) => sum + Number(lead.montoEstimado), 0);

                const montoPotencial = leads
                    .filter(
                        (lead) =>
                            lead.estado === "NUEVO" ||
                            lead.estado === "CONTACTADO",
                    )
                    .reduce((sum, lead) => sum + Number(lead.montoEstimado), 0);

                this.bot.sendMessage(
                    chatId,
                    `💰 *Montos del Sistema*\n\n` +
                        `Total estimado: $${montoTotal.toLocaleString("es-AR")}\n` +
                        `Ganado: $${montoGanado.toLocaleString("es-AR")}\n` +
                        `Potencial: $${montoPotencial.toLocaleString("es-AR")}`,
                    { parse_mode: "Markdown" },
                );
            } catch (error) {
                console.error("Error en /monto:", error);
                this.bot.sendMessage(chatId, "❌ Error al calcular montos.");
            }
        });

        // Comando /ranking
        this.bot.onText(/\/ranking/, async (msg) => {
            const chatId = msg.chat.id;

            try {
                // Obtener vendedores con sus leads ganados
                const vendedores = await this.prisma.user.findMany({
                    where: { rol: "VENDEDOR" },
                    include: {
                        leads: {
                            where: { estado: "GANADO" },
                        },
                    },
                });

                // Calcular ranking
                const ranking = vendedores
                    .map((vendedor) => {
                        const leadsGanados = vendedor.leads.length;
                        const montoGanado = vendedor.leads.reduce(
                            (sum, lead) => sum + Number(lead.montoEstimado),
                            0,
                        );

                        return {
                            nombre: vendedor.nombre,
                            leadsGanados,
                            montoGanado,
                        };
                    })
                    .filter((v) => v.leadsGanados > 0)
                    .sort((a, b) => b.montoGanado - a.montoGanado)
                    .slice(0, 5); // Top 5

                if (ranking.length === 0) {
                    this.bot.sendMessage(
                        chatId,
                        "📊 Aún no hay vendedores con leads ganados.",
                    );
                    return;
                }

                const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
                const message = ranking
                    .map(
                        (v, i) =>
                            `${medals[i]} *${v.nombre}*\n` +
                            `   Leads: ${v.leadsGanados} | Monto: $${v.montoGanado.toLocaleString("es-AR")}`,
                    )
                    .join("\n\n");

                this.bot.sendMessage(
                    chatId,
                    `🏆 *Ranking de Vendedores*\n\n${message}`,
                    { parse_mode: "Markdown" },
                );
            } catch (error) {
                console.error("Error en /ranking:", error);
                this.bot.sendMessage(chatId, "❌ Error al generar ranking.");
            }
        });

        // Comando /stats (completo)
        this.bot.onText(/\/stats/, async (msg) => {
            const chatId = msg.chat.id;

            try {
                // Usuarios
                const totalUsers = await this.prisma.user.count();

                // Leads
                const totalLeads = await this.prisma.lead.count();
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const recentLeads = await this.prisma.lead.count({
                    where: { createdAt: { gte: sevenDaysAgo } },
                });

                // Montos
                const leads = await this.prisma.lead.findMany({
                    select: { montoEstimado: true },
                });
                const montoTotal = leads.reduce(
                    (sum, lead) => sum + Number(lead.montoEstimado),
                    0,
                );

                this.bot.sendMessage(
                    chatId,
                    `📊 *Estadísticas del Sistema*\n\n` +
                        `👥 Usuarios: ${totalUsers}\n` +
                        `📋 Leads totales: ${totalLeads}\n` +
                        `🆕 Leads últimos 7 días: ${recentLeads}\n` +
                        `💰 Monto estimado total: $${montoTotal.toLocaleString("es-AR")}\n\n` +
                        `Usa /ranking para ver el top vendedores.`,
                    { parse_mode: "Markdown" },
                );
            } catch (error) {
                console.error("Error en /stats:", error);
                this.bot.sendMessage(
                    chatId,
                    "❌ Error al obtener estadísticas.",
                );
            }
        });

        // Manejar mensajes que no son comandos
        this.bot.on("message", (msg) => {
            if (!msg.text?.startsWith("/")) {
                const chatId = msg.chat.id;
                this.bot.sendMessage(
                    chatId,
                    "No entiendo ese mensaje. Usa /help para ver los comandos disponibles.",
                );
            }
        });

        // Manejar errores
        this.bot.on("polling_error", (error) => {
            console.error("❌ Telegram Bot polling error:", error);
        });
    }

    /**
     * Enviar notificación a un chatId específico (para futuras extensiones)
     */
    async sendNotification(chatId: number, message: string): Promise<void> {
        try {
            await this.bot.sendMessage(chatId, message, {
                parse_mode: "Markdown",
            });
        } catch (error) {
            console.error("Error enviando notificación Telegram:", error);
        }
    }
}
