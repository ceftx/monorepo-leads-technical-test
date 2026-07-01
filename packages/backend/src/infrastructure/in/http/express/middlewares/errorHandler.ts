import type { Request, Response, NextFunction } from "express";
import { DomainError } from "../../../../../domain/errors/DomainError.ts";
import { InvalidEmailError } from "../../../../../domain/errors/AuthErrors.ts";
import { EmailAlreadyExistsError } from "../../../../../domain/errors/AuthErrors.ts";
import { InvalidCredentialsError } from "../../../../../domain/errors/AuthErrors.ts";
import { UnauthorizedError } from "../../../../../domain/errors/AuthErrors.ts";
import { InvalidPasswordError } from "../../../../../domain/errors/AuthErrors.ts";
import { NotFoundError } from "../../../../../domain/errors/UserErrors.ts";
import { InvalidUserNameError } from "../../../../../domain/errors/UserErrors.ts";
import { InvalidLeadDataError } from "../../../../../domain/errors/LeadErrors.ts";

/**
 * Middleware de manejo centralizado de errores
 *
 * Responsabilidades:
 * 1. Capturar todos los errores de la aplicación
 * 2. Convertir DomainErrors en respuestas HTTP apropiadas
 * 3. Loggear errores para debugging
 * 4. Evitar que el servidor crashee
 * 5. NO exponer detalles internos en producción
 *
 * IMPORTANTE: Debe ser el ÚLTIMO middleware registrado en Express
 */
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): void => {
    // Log del error (en producción usar un logger profesional como Winston)
    console.error("❌ Error capturado:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });

    // === Errores de Dominio (DomainError) ===
    if (error instanceof DomainError) {
        const statusCode = getStatusCodeForDomainError(error);

        res.status(statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
                ...(process.env.NODE_ENV === "development" && {
                    metadata: error.metadata,
                    timestamp: error.timestamp,
                }),
            },
        });
        return;
    }

    // === Errores de validación de Prisma ===
    if (error.name === "PrismaClientValidationError") {
        res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Error de validación en los datos",
                ...(process.env.NODE_ENV === "development" && {
                    details: error.message,
                }),
            },
        });
        return;
    }

    // === Errores de unicidad de Prisma (unique constraint) ===
    if (error.name === "PrismaClientKnownRequestError") {
        const prismaError = error as any;
        if (prismaError.code === "P2002") {
            res.status(409).json({
                success: false,
                error: {
                    code: "DUPLICATE_ENTRY",
                    message: "Ya existe un registro con esos datos",
                    ...(process.env.NODE_ENV === "development" && {
                        fields: prismaError.meta?.target,
                    }),
                },
            });
            return;
        }
    }

    // === Errores desconocidos (500) ===
    res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message:
                process.env.NODE_ENV === "production"
                    ? "Ocurrió un error interno en el servidor"
                    : error.message,
            ...(process.env.NODE_ENV === "development" && {
                stack: error.stack,
            }),
        },
    });
};

/**
 * Mapea los errores de dominio a códigos HTTP apropiados
 */
function getStatusCodeForDomainError(error: DomainError): number {
    // Errores de validación → 400 Bad Request
    if (
        error instanceof InvalidEmailError ||
        error instanceof InvalidPasswordError ||
        error instanceof InvalidUserNameError ||
        error instanceof InvalidLeadDataError
    ) {
        return 400;
    }

    // Credenciales incorrectas → 401 Unauthorized
    if (error instanceof InvalidCredentialsError) {
        return 401;
    }

    // Sin permisos → 403 Forbidden
    if (error instanceof UnauthorizedError) {
        return 403;
    }

    // Recurso no encontrado → 404 Not Found
    if (error instanceof NotFoundError) {
        return 404;
    }

    // Email duplicado → 409 Conflict
    if (error instanceof EmailAlreadyExistsError) {
        return 409;
    }

    // Error de dominio genérico → 400 Bad Request
    return 400;
}
