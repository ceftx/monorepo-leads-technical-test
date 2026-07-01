import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Leads Management API",
        description:
            "API para gestión de leads con autenticación JWT y roles (ADMIN/VENDEDOR)",
        version: "1.0.0",
    },
    host: "monorepo-leads-technical-back-production.up.railway.app",
    basePath: "/api",
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "Auth",
            description: "Endpoints de autenticación",
        },
        {
            name: "Leads",
            description: "Gestión de leads",
        },
        {
            name: "Users",
            description: "Gestión de usuarios (solo ADMIN)",
        },
        {
            name: "Dashboard",
            description: "Métricas y estadísticas",
        },
    ],
    securityDefinitions: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            in: "header",
            description: "JWT token. Formato: Bearer {token}",
        },
    },
    definitions: {
        User: {
            id: 1,
            email: "user@example.com",
            nombre: "John Doe",
            rol: "VENDEDOR",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        },
        Lead: {
            id: 1,
            nombre: "Jane Smith",
            email: "jane@company.com",
            empresa: "Tech Corp",
            montoEstimado: 50000,
            estado: "NUEVO",
            userId: 1,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
        },
        RegisterRequest: {
            $email: "user@example.com",
            $password: "password123",
            $nombre: "John Doe",
            rol: "VENDEDOR",
        },
        LoginRequest: {
            $email: "user@example.com",
            $password: "password123",
        },
        RefreshTokenRequest: {
            $token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
        LoginResponse: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            user: {
                $ref: "#/definitions/User",
            },
        },
        CreateLeadRequest: {
            $nombre: "Jane Smith",
            $email: "jane@company.com",
            $empresa: "Tech Corp",
            $montoEstimado: 50000,
        },
        UpdateLeadStatusRequest: {
            $estado: "CONTACTADO",
        },
        UserMetrics: {
            userId: 1,
            nombreUsuario: "John Doe",
            totalLeads: 10,
            distribucionPorEstado: [
                {
                    estado: "NUEVO",
                    cantidad: 5,
                },
            ],
            montoEstimadoTotal: 500000,
            leadsUltimos7Dias: 5,
            leadsRecientes: [
                {
                    $ref: "#/definitions/Lead",
                },
            ],
        },
        GlobalMetrics: {
            totalLeads: 50,
            distribucionPorEstado: [
                {
                    estado: "NUEVO",
                    cantidad: 20,
                },
            ],
            montoEstimadoTotal: 2500000,
            leadsUltimos7Dias: 15,
            leadsRecientes: [
                {
                    $ref: "#/definitions/Lead",
                },
            ],
            totalUsuarios: 10,
            rankingVendedores: [
                {
                    userId: 2,
                    nombreVendedor: "John Doe",
                    montoGanado: 150000,
                    leadsGanados: 5,
                },
            ],
        },
        Error: {
            success: false,
            error: {
                code: "ERROR_CODE",
                message: "Error message",
            },
        },
    },
};

const outputFile = "./swagger-output.json";

// Usar el wrapper que monta todas las rutas con sus prefijos correctos
const routes = ["./swagger-routes-wrapper.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc).then(() => {
    console.log("✅ Swagger documentation generated successfully!");
    console.log(`📄 File: ${outputFile}`);
    console.log(
        "🚀 Start your server and visit: http://localhost:3000/api-docs",
    );
});
