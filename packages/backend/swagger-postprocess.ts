import { readFileSync, writeFileSync } from "fs";

/**
 * Post-procesa el swagger-output.json para agregar tags, summaries y descriptions
 * que swagger-autogen no pudo capturar debido al wrapper de rutas
 */

const swaggerFile = "./swagger-output.json";
const swagger = JSON.parse(readFileSync(swaggerFile, "utf-8"));

// Configuración de metadata para cada endpoint
const endpointMetadata: Record<
    string,
    Record<string, { tags: string[]; summary: string; description?: string }>
> = {
    "/api/auth/register": {
        post: {
            tags: ["Auth"],
            summary: "Registrar nuevo usuario",
            description: "Crea un nuevo usuario en el sistema",
        },
    },
    "/api/auth/login": {
        post: {
            tags: ["Auth"],
            summary: "Iniciar sesión",
            description: "Autentica un usuario y devuelve un token JWT",
        },
    },
    "/api/auth/refresh": {
        post: {
            tags: ["Auth"],
            summary: "Renovar token JWT",
            description: "Recibe un token vigente y devuelve uno nuevo",
        },
    },
    "/api/leads/": {
        post: {
            tags: ["Leads"],
            summary: "Crear nuevo lead",
            description:
                "Crea un lead. Vendedor: asignado a sí mismo. Admin: puede especificar userId",
        },
        get: {
            tags: ["Leads"],
            summary: "Obtener todos los leads del usuario",
            description:
                "Vendedor: solo ve sus leads. Admin: ve todos (o filtra por userId)",
        },
    },
    "/api/leads/{id}": {
        get: {
            tags: ["Leads"],
            summary: "Obtener un lead por ID",
            description: "Vendedor: solo sus leads. Admin: cualquier lead",
        },
        put: {
            tags: ["Leads"],
            summary: "Actualizar lead completo",
            description: "Vendedor: solo sus leads. Admin: cualquier lead",
        },
        delete: {
            tags: ["Leads"],
            summary: "Eliminar un lead",
            description: "Vendedor: solo sus leads. Admin: cualquier lead",
        },
    },
    "/api/leads/{id}/status": {
        patch: {
            tags: ["Leads"],
            summary: "Actualizar estado de un lead",
            description: "Vendedor: solo sus leads. Admin: cualquier lead",
        },
    },
    "/api/users/": {
        get: {
            tags: ["Users"],
            summary: "Obtener todos los usuarios (solo ADMIN)",
            description: "Lista todos los usuarios del sistema",
        },
    },
    "/api/users/{id}": {
        delete: {
            tags: ["Users"],
            summary: "Eliminar un usuario (solo ADMIN)",
            description: "Elimina un usuario del sistema",
        },
    },
    "/api/dashboard/user": {
        get: {
            tags: ["Dashboard"],
            summary: "Obtener métricas del usuario autenticado",
            description: "Devuelve estadísticas y métricas del usuario actual",
        },
    },
    "/api/dashboard/user/{id}": {
        get: {
            tags: ["Dashboard"],
            summary: "Obtener métricas de un usuario específico (solo ADMIN)",
            description: "Devuelve estadísticas de un usuario específico",
        },
    },
    "/api/dashboard/global": {
        get: {
            tags: ["Dashboard"],
            summary: "Obtener métricas globales del sistema (solo ADMIN)",
            description:
                "Devuelve estadísticas globales y ranking de vendedores",
        },
    },
};

// Aplicar metadata a los endpoints
for (const [path, methods] of Object.entries(endpointMetadata)) {
    if (swagger.paths[path]) {
        for (const [method, metadata] of Object.entries(methods)) {
            if (swagger.paths[path][method]) {
                swagger.paths[path][method].tags = metadata.tags;
                swagger.paths[path][method].summary = metadata.summary;
                if (metadata.description) {
                    swagger.paths[path][method].description =
                        metadata.description;
                }
            }
        }
    }
}

// Remover la barra final de /api/leads/ → /api/leads
if (swagger.paths["/api/leads/"]) {
    swagger.paths["/api/leads"] = swagger.paths["/api/leads/"];
    delete swagger.paths["/api/leads/"];
}

// Remover la barra final de /api/users/ → /api/users
if (swagger.paths["/api/users/"]) {
    swagger.paths["/api/users"] = swagger.paths["/api/users/"];
    delete swagger.paths["/api/users/"];
}

// Escribir el archivo actualizado
writeFileSync(swaggerFile, JSON.stringify(swagger, null, 2), "utf-8");

console.log("✅ Swagger post-procesado exitosamente!");
console.log(
    "📝 Tags, summaries y descriptions agregados a todos los endpoints",
);
console.log("🔧 Paths corregidos (removidas barras finales)");
