import express, { type Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { container } from "../../../../shared/DependencyInjection.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

// Importar rutas
import authRoutes from "./routes/auth.routes.ts";
import leadsRoutes from "./routes/leads.routes.ts";
import usersRoutes from "./routes/users.routes.ts";
import dashboardRoutes from "./routes/dashboard.routes.ts";

// Load swagger doc
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = JSON.parse(
    readFileSync(
        join(__dirname, "../../../../../swagger-output.json"),
        "utf-8",
    ),
);

/**
 * Clase Server - Configuración completa del servidor Express
 *
 * Responsabilidades:
 * 1. Configurar middlewares globales (CORS, JSON parser)
 * 2. Registrar todas las rutas de la aplicación
 * 3. Configurar manejo de errores centralizado
 * 4. Iniciar el servidor HTTP
 * 5. Manejar graceful shutdown
 */
export class Server {
    private app: Application;
    private port: number;

    constructor(port: number = 3000) {
        this.app = express();
        this.port = port;

        this.configureMiddlewares();
        this.configureRoutes();
        this.configureErrorHandler();
    }

    /**
     * Configurar middlewares globales
     */
    private configureMiddlewares(): void {
        // CORS - Permitir requests desde el frontend
        this.app.use(
            cors({
                origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite default port
                credentials: true,
            }),
        );

        // Body parser - Parsear JSON en requests
        this.app.use(express.json());

        // Body parser - Parsear URL-encoded data
        this.app.use(express.urlencoded({ extended: true }));

        // Swagger documentation
        this.app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerDocument, {
                customCss: ".swagger-ui .topbar { display: none }",
                customSiteTitle: "Leads API Documentation",
            }),
        );

        // Health check endpoint
        this.app.get("/health", (req, res) => {
            res.status(200).json({
                success: true,
                message: "Server is running",
                timestamp: new Date().toISOString(),
            });
        });
    }

    /**
     * Registrar todas las rutas
     */
    private configureRoutes(): void {
        // Base path para la API
        const apiPrefix = "/api";

        // Rutas de autenticación
        this.app.use(`${apiPrefix}/auth`, authRoutes);

        // Rutas de leads
        this.app.use(`${apiPrefix}/leads`, leadsRoutes);

        // Rutas de usuarios (admin only)
        this.app.use(`${apiPrefix}/users`, usersRoutes);

        // Rutas de dashboard (métricas)
        this.app.use(`${apiPrefix}/dashboard`, dashboardRoutes);

        // Ruta 404 - Endpoint no encontrado
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    code: "ENDPOINT_NOT_FOUND",
                    message: `Endpoint ${req.method} ${req.originalUrl} no encontrado`,
                },
            });
        });
    }

    /**
     * Configurar el error handler (DEBE ser el último middleware)
     */
    private configureErrorHandler(): void {
        this.app.use(errorHandler);
    }

    /**
     * Iniciar el servidor
     */
    async start(): Promise<void> {
        try {
            // Verificar conexión a la base de datos
            const prisma = container.getPrisma();
            await prisma.$connect();
            console.log("✅ Conexión a la base de datos establecida");

            // Iniciar servidor HTTP
            this.app.listen(this.port, () => {
                console.log("🚀 ====================================");
                console.log(`🚀 Servidor corriendo en puerto ${this.port}`);
                console.log(
                    `🚀 Environment: ${process.env.NODE_ENV || "development"}`,
                );
                console.log(
                    `🚀 API Base URL: http://localhost:${this.port}/api`,
                );
                console.log("🚀 ====================================");
                console.log("");
                console.log("📋 Endpoints disponibles:");
                console.log("   Auth:");
                console.log(
                    `     POST   http://localhost:${this.port}/api/auth/register`,
                );
                console.log(
                    `     POST   http://localhost:${this.port}/api/auth/login`,
                );
                console.log("");
                console.log("   Leads:");
                console.log(
                    `     POST   http://localhost:${this.port}/api/leads`,
                );
                console.log(
                    `     GET    http://localhost:${this.port}/api/leads`,
                );
                console.log(
                    `     GET    http://localhost:${this.port}/api/leads/:id`,
                );
                console.log(
                    `     PATCH  http://localhost:${this.port}/api/leads/:id/status`,
                );
                console.log(
                    `     DELETE http://localhost:${this.port}/api/leads/:id`,
                );
                console.log("");
                console.log("   Users (Admin):");
                console.log(
                    `     GET    http://localhost:${this.port}/api/users`,
                );
                console.log(
                    `     DELETE http://localhost:${this.port}/api/users/:id`,
                );
                console.log("");
                console.log("   Dashboard:");
                console.log(
                    `     GET    http://localhost:${this.port}/api/dashboard/user`,
                );
                console.log(
                    `     GET    http://localhost:${this.port}/api/dashboard/user/:id (Admin)`,
                );
                console.log(
                    `     GET    http://localhost:${this.port}/api/dashboard/global (Admin)`,
                );
                console.log("");
                console.log(
                    `💚 Health check: http://localhost:${this.port}/health`,
                );
                console.log("🚀 ====================================");
            });

            // Manejar señales de terminación (graceful shutdown)
            this.setupGracefulShutdown();
        } catch (error) {
            console.error("❌ Error al iniciar el servidor:", error);
            process.exit(1);
        }
    }

    /**
     * Configurar graceful shutdown
     */
    private setupGracefulShutdown(): void {
        const shutdown = async (signal: string) => {
            console.log(`\n⚠️  Señal ${signal} recibida. Cerrando servidor...`);

            try {
                // Desconectar de la base de datos
                await container.disconnect();
                console.log("✅ Desconexión de la base de datos exitosa");

                console.log("✅ Servidor cerrado correctamente");
                process.exit(0);
            } catch (error) {
                console.error("❌ Error durante el shutdown:", error);
                process.exit(1);
            }
        };

        // Escuchar señales de terminación
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    }

    /**
     * Obtener la instancia de Express (útil para tests)
     */
    getApp(): Application {
        return this.app;
    }
}
