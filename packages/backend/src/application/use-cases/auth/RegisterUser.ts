import type { IUserRepository } from "../../../domain/repositories/IUserRepository.ts";
import { User } from "../../../domain/entities/User.ts";
import { UserRole } from "../../../domain/value-objects/UserRole.ts";
import {
    InvalidPasswordError,
    EmailAlreadyExistsError,
} from "../../../domain/errors/AuthErrors.ts";
import type { BcryptService } from "../../../infrastructure/out/auth/BcryptService.ts";

export interface RegisterUserDTO {
    email: string;
    password: string;
    nombre: string;
    rol?: UserRole;
}

export class RegisterUser {
    constructor(
        private userRepository: IUserRepository,
        private bcryptService: BcryptService,
    ) {}

    async execute(data: RegisterUserDTO): Promise<User> {
        // 1. Validar longitud mínima del password ANTES de hashear
        if (!data.password || data.password.length < 8) {
            throw new InvalidPasswordError(
                "El password debe tener al menos 8 caracteres",
                { length: data.password?.length || 0 },
            );
        }

        if (data.password.length > 32) {
            throw new InvalidPasswordError(
                "El password no puede exceder 32 caracteres",
                { length: data.password.length },
            );
        }

        // 2. Validar que el email NO exista
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new EmailAlreadyExistsError(data.email);
        }

        // 3. Hashear password
        const hashedPassword = await this.bcryptService.hash(data.password);

        // 4. Crear entidad (Domain valida estructura)
        const user = User.create({
            id: 0, // Temporal, Prisma lo genera
            email: data.email,
            password: hashedPassword,
            nombre: data.nombre,
            rol: data.rol || UserRole.VENDEDOR,
        });

        // 5. Guardar en base de datos
        return await this.userRepository.create(user);
    }
}
