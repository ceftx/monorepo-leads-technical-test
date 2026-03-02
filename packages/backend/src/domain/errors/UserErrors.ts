import { DomainError } from "./DomainError.ts";

export class InvalidUserNameError extends DomainError {
    constructor(nombre: string, reason: string) {
        super({
            code: "INVALID_USER_NAME",
            message: reason,
            metadata: { nombre, length: nombre.length },
        });
    }
}

export class NotFoundError extends DomainError {
    constructor(resource: string, id: number | string) {
        super({
            code: "NOT_FOUND",
            message: `${resource} con id ${id} no encontrado`,
            metadata: { resource, id },
        });
    }
}
