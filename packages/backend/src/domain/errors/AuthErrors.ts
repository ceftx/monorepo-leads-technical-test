import { DomainError } from "./DomainError.ts";

export class InvalidEmailError extends DomainError {
    constructor(email: string) {
        super({
            code: "INVALID_EMAIL",
            message: `El email '${email}' no es válido`,
            metadata: { email },
        });
    }
}

export class UnauthorizedError extends DomainError {
    constructor(
        message: string = "No tienes permiso para realizar esta acción",
    ) {
        super({
            code: "UNAUTHORIZED",
            message: message,
            metadata: {},
        });
    }
}

export class InvalidPasswordError extends DomainError {
    constructor(reason: string, metadata?: Record<string, any>) {
        super({
            code: "INVALID_PASSWORD",
            message: reason,
            metadata,
        });
    }
}

export class EmailAlreadyExistsError extends DomainError {
    constructor(email: string) {
        super({
            code: "EMAIL_ALREADY_EXISTS",
            message: `El email ${email} ya está registrado`,
            metadata: { email },
        });
    }
}

export class InvalidCredentialsError extends DomainError {
    constructor() {
        super({
            code: "INVALID_CREDENTIALS",
            message: "Email o password incorrectos",
            metadata: {},
        });
    }
}
