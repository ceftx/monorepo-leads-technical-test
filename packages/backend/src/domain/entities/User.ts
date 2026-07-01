import { InvalidPasswordError } from "../errors/AuthErrors.ts";
import { InvalidUserNameError } from "../errors/UserErrors.ts";
import { Email } from "../value-objects/Email.ts";
import { UserRole } from "../value-objects/UserRole.ts";

export class User {
    private constructor(
        public readonly id: number,
        public readonly email: Email,
        public readonly password: string,
        public readonly nombre: string,
        public readonly rol: UserRole,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
    static create(props: {
        id: number;
        email: string;
        password: string;
        nombre: string;
        rol: UserRole;
        createdAt?: Date;
        updatedAt?: Date;
    }): User {
        // 1. Validar y crear Email Value Object
        const emailVO = new Email(props.email);
        // 2. Validar nombre
        const trimmedNombre = props.nombre.trim();

        if (trimmedNombre.length === 0) {
            throw new InvalidUserNameError(
                props.nombre,
                "El nombre no puede estar vacío",
            );
        }
        if (trimmedNombre.length > 100) {
            throw new InvalidUserNameError(
                props.nombre,
                "El nombre no puede exceder 100 caracteres",
            );
        }
        // 3. Validar password hasheado
        if (!props.password || props.password.trim().length === 0) {
            throw new InvalidPasswordError("El password no puede estar vacío");
        }
        // 4. Crear la instancia
        return new User(
            props.id,
            emailVO,
            props.password,
            trimmedNombre,
            props.rol,
            props.createdAt ?? new Date(),
            props.updatedAt ?? new Date(),
        );
    }
    // Métodos de negocio
    isAdmin(): boolean {
        return this.rol === UserRole.ADMIN;
    }
    canManageUsers(): boolean {
        return this.isAdmin();
    }
    canAccessLead(leadUserId: number): boolean {
        // Admin puede acceder a todos los leads
        if (this.isAdmin()) {
            return true;
        }
        // Vendedor solo puede acceder a sus propios leads
        return this.id === leadUserId;
    }
}
